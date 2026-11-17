
type UnitLayoutProps = {
    unitNumber: number;
    title: string;
    intro: string;
    children: React.ReactNode;
    scenario: string;
    reminder: string;
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function UnitLayout({
    unitNumber,
    title,
    intro,
    children,
    scenario,
    reminder,
    seconds,
    isSaving,
    errorMessage,
    onFinish,
}: UnitLayoutProps) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(remainingSeconds).padStart(2, "0")}`;

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-blue-600">
                        MICROLEARNING A03
                    </p>

                    <div className="mt-3 flex justify-between">
                        <h1 className="font-bold text-gray-900">
                            Unit {unitNumber} dari 6
                        </h1>

                        <span className="text-sm text-gray-500">
                            {Math.round((unitNumber / 6) * 100)}%
                        </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                                width: `${(unitNumber / 6) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                <article className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-sm font-semibold text-blue-600">
                        U{unitNumber}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                        {title}
                    </h2>

                    <p className="mt-4 leading-7 text-gray-600">
                        {intro}
                    </p>

                    <div className="mt-7 space-y-6">
                        {children}
                    </div>

                    <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
                        <p className="font-bold text-blue-800">
                            CONTOH KASUS
                        </p>

                        <p className="mt-3 leading-7 text-gray-800">
                            {scenario}
                        </p>
                    </div>

                    <div className="mt-5 rounded-xl bg-gray-50 p-5">
                        <h3 className="font-bold text-gray-900">
                            Hal yang perlu diingat
                        </h3>

                        <p className="mt-2 leading-7 text-gray-600">
                            {reminder}
                        </p>
                    </div>
                </article>

                <div className="mt-5 rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Waktu aktif unit ini
                    </p>

                    <p className="mt-1 text-3xl font-bold tabular-nums text-gray-900">
                        {formattedTime}
                    </p>

                    {errorMessage && (
                        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={onFinish}
                        disabled={isSaving}
                        className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSaving
                            ? "Menyimpan..."
                            : unitNumber === 6
                                ? "Selesaikan Microlearning"
                                : "Selesaikan Unit dan Lanjut"}
                    </button>

                    <p className="mt-3 text-center text-xs text-gray-500">
                        Unit yang telah diselesaikan tidak dapat dibuka kembali.
                    </p>
                </div>
            </div>
        </main>
    );
}
