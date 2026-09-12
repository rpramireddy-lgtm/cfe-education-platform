import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-brand-700 mb-4">CfE Learning</h1>
        <p className="text-lg text-slate-600 mb-8">
          Interactive learning for Scotland&apos;s Curriculum for Excellence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-primary">
            Sign in
          </Link>
          <Link href="/register" className="btn-secondary">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
