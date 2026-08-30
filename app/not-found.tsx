import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071917] text-white p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold text-emerald-400">404</h1>
        <h2 className="text-xl font-semibold">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div>
          <Link
            href="/dashboard"
            className="inline-block py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
