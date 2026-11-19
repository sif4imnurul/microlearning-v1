import type {
    Analysis,
    CategoryStat,
    CleanRow,
    Desc,
    ItemStat,
    PairedT,
    Wilcoxon,
} from "@/lib/adminTypes";

export function describe(values: number[]): Desc {
    const n = values.length;

    if (n === 0) {
        return { n: 0, mean: null, median: null, sd: null, min: null, max: null };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, v) => sum + v, 0) / n;
    const median =
        n % 2 === 1
            ? sorted[(n - 1) / 2]
            : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const sd =
        n > 1
            ? Math.sqrt(
                values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1)
            )
            : null;

    return { n, mean, median, sd, min: sorted[0], max: sorted[n - 1] };
}

const LANCZOS = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5,
];

function logGamma(xx: number) {
    let y = xx;
    let tmp = xx + 5.5;
    tmp -= (xx + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;

    for (let j = 0; j < 6; j++) {
        y += 1;
        ser += LANCZOS[j] / y;
    }

    return -tmp + Math.log((2.5066282746310005 * ser) / xx);
}

function betaContinuedFraction(a: number, b: number, x: number) {
    const tiny = 1e-300;
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - (qab * x) / qap;

    if (Math.abs(d) < tiny) d = tiny;
    d = 1 / d;
    let h = d;

    for (let m = 1; m <= 200; m++) {
        const m2 = 2 * m;
        let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));

        d = 1 + aa * d;
        if (Math.abs(d) < tiny) d = tiny;
        c = 1 + aa / c;
        if (Math.abs(c) < tiny) c = tiny;
        d = 1 / d;
        h *= d * c;

        aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));

        d = 1 + aa * d;
        if (Math.abs(d) < tiny) d = tiny;
        c = 1 + aa / c;
        if (Math.abs(c) < tiny) c = tiny;
        d = 1 / d;

        const delta = d * c;
        h *= delta;

        if (Math.abs(delta - 1) < 3e-12) break;
    }

    return h;
}

function regularizedBeta(a: number, b: number, x: number) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    const front = Math.exp(
        logGamma(a + b) -
        logGamma(a) -
        logGamma(b) +
        a * Math.log(x) +
        b * Math.log(1 - x)
    );

    if (x < (a + 1) / (a + b + 2)) {
        return (front * betaContinuedFraction(a, b, x)) / a;
    }

    return 1 - (front * betaContinuedFraction(b, a, 1 - x)) / b;
}

function tTwoSidedP(t: number, df: number) {
    return regularizedBeta(df / 2, 0.5, df / (df + t * t));
}

function tCritical(df: number) {
    let low = 0;
    let high = 200;

    for (let i = 0; i < 100; i++) {
        const mid = (low + high) / 2;

        if (tTwoSidedP(mid, df) > 0.05) {
            low = mid;
        } else {
            high = mid;
        }
    }

    return (low + high) / 2;
}

function normalCdf(z: number) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const p =
        d *
        t *
        (0.3193815 +
            t *
            (-0.3565638 +
                t * (1.781478 + t * (-1.821256 + t * 1.330274))));

    return z > 0 ? 1 - p : p;
}

export function pairedTTest(pre: number[], post: number[]): PairedT | null {
    const n = pre.length;

    if (n < 2) return null;

    const diffs = post.map((value, i) => value - pre[i]);
    const meanDiff = diffs.reduce((sum, v) => sum + v, 0) / n;
    const sdDiff = Math.sqrt(
        diffs.reduce((sum, v) => sum + (v - meanDiff) ** 2, 0) / (n - 1)
    );

    if (sdDiff === 0) return null;

    const se = sdDiff / Math.sqrt(n);
    const t = meanDiff / se;
    const df = n - 1;
    const p = tTwoSidedP(t, df);
    const margin = tCritical(df) * se;

    return {
        n,
        meanDiff,
        sdDiff,
        t,
        df,
        p,
        ciLow: meanDiff - margin,
        ciHigh: meanDiff + margin,
        dz: meanDiff / sdDiff,
    };
}

export function wilcoxonTest(pre: number[], post: number[]): Wilcoxon | null {
    const diffs = post
        .map((value, i) => value - pre[i])
        .filter((value) => value !== 0);
    const n = diffs.length;

    if (n < 1) return null;

    const order = diffs
        .map((value, index) => ({ abs: Math.abs(value), index }))
        .sort((a, b) => a.abs - b.abs);

    const ranks = new Array<number>(n).fill(0);
    let tieCorrection = 0;
    let i = 0;

    while (i < n) {
        let j = i;

        while (j + 1 < n && order[j + 1].abs === order[i].abs) j++;

        const rank = (i + j) / 2 + 1;
        const size = j - i + 1;

        for (let k = i; k <= j; k++) ranks[order[k].index] = rank;

        tieCorrection += size ** 3 - size;
        i = j + 1;
    }

    let wPlus = 0;
    let wMinus = 0;

    diffs.forEach((value, index) => {
        if (value > 0) wPlus += ranks[index];
        else wMinus += ranks[index];
    });

    const mean = (n * (n + 1)) / 4;
    const variance =
        (n * (n + 1) * (2 * n + 1)) / 24 - tieCorrection / 48;

    if (variance <= 0) return null;

    const w = Math.min(wPlus, wMinus);
    const z = (Math.abs(w - mean) - 0.5) / Math.sqrt(variance);
    const signedZ = wPlus >= wMinus ? z : -z;
    const p = Math.min(1, 2 * (1 - normalCdf(Math.abs(z))));

    return { n, wPlus, wMinus, z: signedZ, p, r: Math.abs(z) / Math.sqrt(n) };
}

function rate(values: (number | null)[]) {
    const valid = values.filter((v): v is number => v !== null);

    if (valid.length === 0) return null;

    return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

export function analyze(
    rows: CleanRow[],
    preCategory: string[],
    postCategory: string[]
): Analysis {
    const complete = rows.filter(
        (row) => row.pre_score !== null && row.post_score !== null
    );

    const pre = complete.map((row) => row.pre_score as number);
    const post = complete.map((row) => row.post_score as number);

    const numbers = (pick: (row: CleanRow) => number | null) =>
        complete
            .map(pick)
            .filter((value): value is number => value !== null);

    const improvements = complete.map((row) => row.improvement as number);

    const itemStats = (
        items: (row: CleanRow) => (number | null)[],
        prefix: string,
        categories: string[]
    ): ItemStat[] =>
        Array.from({ length: 12 }, (_, i) => ({
            label: `${prefix}${i + 1}`,
            category: categories[i] ?? "Belum dipetakan",
            correctRate: rate(complete.map((row) => items(row)[i])),
        }));

    const itemsPre = itemStats((row) => row.items_pre, "P", preCategory);
    const itemsPost = itemStats((row) => row.items_post, "Q", postCategory);

    const categoryNames = Array.from(
        new Set([...preCategory, ...postCategory])
    );

    const categories: CategoryStat[] = categoryNames
        .map((category) => {
            const collect = (
                items: (row: CleanRow) => (number | null)[],
                names: string[]
            ) => {
                const values: (number | null)[] = [];

                names.forEach((name, i) => {
                    if (name === category) {
                        complete.forEach((row) => values.push(items(row)[i]));
                    }
                });

                return rate(values);
            };

            return {
                category,
                preCorrectRate: collect((row) => row.items_pre, preCategory),
                postCorrectRate: collect((row) => row.items_post, postCategory),
            };
        })
        .sort(
            (a, b) =>
                (a.postCorrectRate ?? 2) - (b.postCorrectRate ?? 2)
        );

    return {
        n: complete.length,
        pre: describe(pre),
        post: describe(post),
        accuracyPre: describe(numbers((row) => row.accuracy_pre)),
        accuracyPost: describe(numbers((row) => row.accuracy_post)),
        improvement: describe(improvements),
        confidencePre: describe(numbers((row) => row.confidence_pre)),
        confidencePost: describe(numbers((row) => row.confidence_post)),
        pairedT: pairedTTest(pre, post),
        wilcoxon: wilcoxonTest(pre, post),
        improvedCount: improvements.filter((v) => v > 0).length,
        sameCount: improvements.filter((v) => v === 0).length,
        declinedCount: improvements.filter((v) => v < 0).length,
        itemsPre,
        itemsPost,
        categories,
    };
}