type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
};

export default function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {delta ? (
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
