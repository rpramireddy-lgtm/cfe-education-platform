export default function UnauthorisedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Access restricted</h1>
        <p className="text-slate-600">You do not have permission to view this page.</p>
      </div>
    </main>
  );
}
