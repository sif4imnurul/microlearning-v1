"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/consent");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6 text-sm text-slate-600">
      Mengalihkan ke halaman persetujuan...
    </main>
  );
}