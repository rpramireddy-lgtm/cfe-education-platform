import { signOut } from "aws-amplify/auth";
import { redirect } from "next/navigation";

export default function ParentDashboardPage() {
  async function handleSignOut() {
    "use server";
    await signOut();
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Parent Dashboard</h1>
          <form action={handleSignOut}>
            <button type="submit" className="btn-secondary text-sm">
              Sign out
            </button>
          </form>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <h2 className="font-semibold text-slate-700 mb-1">Children</h2>
            <p className="text-slate-500 text-sm">Manage child profiles — coming in Phase 2.</p>
          </div>
          <div className="card">
            <h2 className="font-semibold text-slate-700 mb-1">Progress</h2>
            <p className="text-slate-500 text-sm">View learning progress — coming in Phase 4.</p>
          </div>
          <div className="card">
            <h2 className="font-semibold text-slate-700 mb-1">Subscription</h2>
            <p className="text-slate-500 text-sm">Manage billing — coming in Phase 6.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
