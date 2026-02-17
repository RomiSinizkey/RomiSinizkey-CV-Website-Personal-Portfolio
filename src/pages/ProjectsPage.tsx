import { Link } from "react-router-dom";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Projects</h1>
        <Link to="/" className="text-white/70 hover:text-white transition">← Home</Link>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-white/70">Next: add a modern Webflow-style grid.</div>
      </div>
    </div>
  );
}
