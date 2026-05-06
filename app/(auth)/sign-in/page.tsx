import Link from 'next/link'

export default function SignInPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Auth</p>
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-slate-400">
            Firebase Auth client integration will be connected here in the next feature pass.
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-950"
        >
          Continue with email
        </button>

        <p className="text-sm text-slate-400">
          No account yet?{' '}
          <Link className="text-slate-100 underline underline-offset-4" href="/sign-up">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
