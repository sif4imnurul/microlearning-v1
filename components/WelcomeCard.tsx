
export default function WelcomeCard() {
    return (
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-md">
            <p className="mb-3 text-sm font-semibold text-blue-600">
                PENELITIAN KEAMANAN INFORMASI
            </p>

            <h1 className="mb-4 text-3xl font-bold text-gray-900">
                Selamat Datang!
            </h1>

            <p className="mb-6 text-gray-600">
                Selamat datang di aplikasi pembelajaran
                keamanan informasi berbasis Microlearning.
            </p>

            <button className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                Mulai Penelitian
            </button>
        </div>
    );
}
