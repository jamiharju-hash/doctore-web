import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Doctore AI</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Next.js foundation reset complete.
          </h1>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            This repository now targets a Next.js App Router architecture instead of the previous Vite SPA baseline.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700" href="/dashboard">
            <div className="text-lg font-medium">Open dashboard shell</div>
            <div className="mt-2 text-sm text-slate-400">App layout, protected routing, and API boundaries start here.</div>
          </Link>

          <Link className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700" href="/sign-in">
            <div className="text-lg font-medium">Open auth flow</div>
            <div className="mt-2 text-sm text-slate-400">Firebase Auth and server session verification foundation.</div>
          </Link>
        </div>
      </div>
    </main>
  )
}
