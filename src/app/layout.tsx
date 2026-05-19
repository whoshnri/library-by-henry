import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Henry's Library",
  description: "Reviews of books, articles, and substack posts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-10">
          <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Henry Bassey Library
              </p>
              <h1 className="text-2xl font-semibold">Review Archive</h1>
            </div>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/" className="rounded-full border border-zinc-700 px-4 py-2">
                Reviews
              </Link>
              <Link
                href="/admin"
                className="rounded-full bg-zinc-100 px-4 py-2 font-medium text-zinc-950"
              >
                Admin CRM
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
