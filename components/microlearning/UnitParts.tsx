import type { ReactNode } from "react";

export type UnitProps = {
    seconds: number;
    isSaving: boolean;
    isTimeLocked: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export function UnitHeader({
    eyebrow,
    title,
    meta,
}: {
    eyebrow?: ReactNode;
    title: string;
    meta: string;
}) {
    return (
        <header className="border-b border-slate-200 pb-6">
            {eyebrow && (
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                    {eyebrow}
                </p>
            )}

            <h1
                className={`${eyebrow ? "mt-4" : ""
                    } text-2xl font-semibold tracking-tight text-[#172B45] sm:text-3xl`}
            >
                {title}
            </h1>

            <p className="mt-2 text-sm text-slate-500">{meta}</p>
        </header>
    );
}

export function Section({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
                <h2 className="text-sm font-semibold text-[#172B45]">
                    {title}
                </h2>
            </div>

            <div className="space-y-3 p-5 text-sm leading-7 text-slate-600 sm:p-6">
                {children}
            </div>
        </section>
    );
}

export function Key({ children }: { children: ReactNode }) {
    return <p className="font-semibold text-[#172B45]">{children}</p>;
}

export function Note({ children }: { children: ReactNode }) {
    return <p className="text-xs italic text-slate-500">{children}</p>;
}

export function Bullets({ items }: { items: ReactNode[] }) {
    return (
        <ul className="list-disc space-y-2 pl-5">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}

export function Table({
    head,
    rows,
}: {
    head: [string, string];
    rows: [ReactNode, ReactNode][];
}) {
    return (
        <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                        <th className="px-4 py-2.5 font-semibold text-slate-900">
                            {head[0]}
                        </th>
                        <th className="px-4 py-2.5 font-semibold text-slate-900">
                            {head[1]}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr
                            key={index}
                            className="border-b border-slate-100 last:border-b-0"
                        >
                            <td className="px-4 py-2.5 align-top font-medium text-slate-800">
                                {row[0]}
                            </td>
                            <td className="px-4 py-2.5 align-top">{row[1]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function Mock({ children }: { children: ReactNode }) {
    return (
        <div className="select-none space-y-2 rounded-md border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-700">
            {children}
        </div>
    );
}

export function FakeButton({
    children,
    muted,
}: {
    children: ReactNode;
    muted?: boolean;
}) {
    return (
        <div
            className={`pointer-events-none inline-block rounded-md px-4 py-2 text-sm font-semibold ${muted
                    ? "bg-slate-200 text-slate-700"
                    : "bg-[#172B45] text-white"
                }`}
        >
            {children}
        </div>
    );
}

export function NextHint({ children }: { children: ReactNode }) {
    return <p className="text-sm italic text-slate-500">{children}</p>;
}

export function UnitFooter({
    unit,
    seconds,
    isSaving,
    errorMessage,
    onFinish,
}: UnitProps & { unit: number }) {
    return (
        <footer className="border-t border-slate-200 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        Waktu membaca
                    </p>

                    <p className="mt-1 text-sm tabular-nums text-slate-500">
                        {Math.floor(seconds / 60)} menit {seconds % 60} detik
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onFinish}
                    disabled={isSaving}
                    className="w-full cursor-pointer rounded-md bg-[#172B45] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-48"
                >
                    {isSaving ? "Menyimpan..." : `Selesaikan Unit ${unit}`}
                </button>
            </div>

            {errorMessage && (
                <p className="mt-4 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                    {errorMessage}
                </p>
            )}
        </footer>
    );
}