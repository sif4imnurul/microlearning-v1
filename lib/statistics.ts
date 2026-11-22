export type DescriptiveStats = {
    n: number;
    mean: number;
    median: number;
    sd: number;
    min: number;
    max: number;
};

export type PairedTestStats = {
    n: number;
    meanDiff: number;
    tStat: number;
    df: number;
    tPValue: number;
    wilcoxonW: number;
    wilcoxonZ: number;
    wilcoxonPValue: number;
};

export function calcDescriptive(values: number[]): DescriptiveStats {
    const n = values.length;
    if (n === 0) {
        return { n: 0, mean: 0, median: 0, sd: 0, min: 0, max: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;

    const mid = Math.floor(n / 2);
    const median =
        n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    const variance =
        n > 1
            ? values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
            (n - 1)
            : 0;

    return {
        n,
        mean: Number(mean.toFixed(2)),
        median: Number(median.toFixed(2)),
        sd: Number(Math.sqrt(variance).toFixed(2)),
        min: Number(sorted[0].toFixed(2)),
        max: Number(sorted[n - 1].toFixed(2)),
    };
}

function logGamma(z: number): number {
    const coef = [
        76.18009172947146, -86.50532032941677, 24.01409824083091,
        -1.231739572450155, 0.001208650973866179, -0.000005395239384953,
    ];
    let x = z;
    let y = z;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < coef.length; j++) {
        y += 1;
        ser += coef[j] / y;
    }
    return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

function betacf(a: number, b: number, x: number): number {
    const maxIter = 100;
    const eps = 3e-7;
    const fpmin = 1e-30;
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - (qab * x) / qap;
    if (Math.abs(d) < fpmin) d = fpmin;
    d = 1 / d;
    let h = d;

    for (let m = 1; m <= maxIter; m++) {
        const m2 = 2 * m;
        let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < fpmin) d = fpmin;
        c = 1 + aa / c;
        if (Math.abs(c) < fpmin) c = fpmin;
        d = 1 / d;
        h *= d * c;

        aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < fpmin) d = fpmin;
        c = 1 + aa / c;
        if (Math.abs(c) < fpmin) c = fpmin;
        d = 1 / d;
        const del = d * c;
        h *= del;
        if (Math.abs(del - 1) < eps) break;
    }
    return h;
}

function regularizedIncompleteBeta(a: number, b: number, x: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(
        logGamma(a + b) -
        logGamma(a) -
        logGamma(b) +
        a * Math.log(x) +
        b * Math.log(1 - x)
    );
    if (x < (a + 1) / (a + b + 2)) {
        return (bt * betacf(a, b, x)) / a;
    }
    return 1 - (bt * betacf(b, a, 1 - x)) / b;
}

function normalTwoTailedP(z: number): number {
    const absZ = Math.abs(z) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * absZ);
    const poly =
        (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
            0.284496736) *
            t +
            0.254829592) *
            t) *
        Math.exp(-absZ * absZ);
    return Math.min(1, Math.max(0, poly));
}

export function calcPairedTests(
    preValues: number[],
    postValues: number[]
): PairedTestStats {
    const n = Math.min(preValues.length, postValues.length);
    if (n < 2) {
        return {
            n,
            meanDiff: 0,
            tStat: 0,
            df: Math.max(0, n - 1),
            tPValue: 1,
            wilcoxonW: 0,
            wilcoxonZ: 0,
            wilcoxonPValue: 1,
        };
    }

    const diffs: number[] = [];
    for (let i = 0; i < n; i++) {
        diffs.push(postValues[i] - preValues[i]);
    }

    const meanDiff = diffs.reduce((acc, d) => acc + d, 0) / n;
    const sdDiff = Math.sqrt(
        diffs.reduce((acc, d) => acc + Math.pow(d - meanDiff, 2), 0) / (n - 1)
    );
    const df = n - 1;
    const tStat = sdDiff > 0 ? meanDiff / (sdDiff / Math.sqrt(n)) : 0;
    const tPValue =
        sdDiff > 0
            ? regularizedIncompleteBeta(df / 2, 0.5, df / (df + tStat * tStat))
            : 1;

    // Wilcoxon Signed-Rank Test
    const nonZero = diffs
        .filter((d) => d !== 0)
        .map((d) => ({ sign: d > 0 ? 1 : -1, abs: Math.abs(d) }))
        .sort((a, b) => a.abs - b.abs);

    const nr = nonZero.length;
    if (nr === 0) {
        return {
            n,
            meanDiff: Number(meanDiff.toFixed(2)),
            tStat: Number(tStat.toFixed(3)),
            df,
            tPValue: Number(tPValue.toFixed(4)),
            wilcoxonW: 0,
            wilcoxonZ: 0,
            wilcoxonPValue: 1,
        };
    }

    let wPlus = 0;
    let wMinus = 0;
    let tieCorrection = 0;

    let idx = 0;
    while (idx < nr) {
        let end = idx;
        while (end + 1 < nr && nonZero[end + 1].abs === nonZero[idx].abs) {
            end++;
        }
        const tieCount = end - idx + 1;
        const avgRank = (idx + 1 + (end + 1)) / 2;
        if (tieCount > 1) {
            tieCorrection += Math.pow(tieCount, 3) - tieCount;
        }
        for (let k = idx; k <= end; k++) {
            if (nonZero[k].sign > 0) wPlus += avgRank;
            else wMinus += avgRank;
        }
        idx = end + 1;
    }

    const wStat = Math.min(wPlus, wMinus);
    const expectedW = (nr * (nr + 1)) / 4;
    const varianceW =
        (nr * (nr + 1) * (2 * nr + 1)) / 24 - tieCorrection / 48;
    const sdW = varianceW > 0 ? Math.sqrt(varianceW) : 0;
    const zStat =
        sdW > 0
            ? Math.max(0, Math.abs(wStat - expectedW) - 0.5) / sdW
            : 0;
    const wilcoxonPValue = sdW > 0 ? normalTwoTailedP(zStat) : 1;

    return {
        n,
        meanDiff: Number(meanDiff.toFixed(2)),
        tStat: Number(tStat.toFixed(3)),
        df,
        tPValue: Number(tPValue.toFixed(4)),
        wilcoxonW: Number(wStat.toFixed(2)),
        wilcoxonZ: Number(zStat.toFixed(3)),
        wilcoxonPValue: Number(wilcoxonPValue.toFixed(4)),
    };
}