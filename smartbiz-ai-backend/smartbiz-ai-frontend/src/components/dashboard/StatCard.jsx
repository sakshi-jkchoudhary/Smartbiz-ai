export default function StatCard({ label, value, icon: Icon, trend, trendUp, accent = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? 'bg-brand-600 border-brand-600' : 'bg-white border-slate-100'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className={`text-xs font-medium ${accent ? 'text-brand-100' : 'text-slate-500'}`}>
          {label}
        </p>
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              accent ? 'bg-white/15' : 'bg-slate-50'
            }`}
          >
            <Icon className={`w-4 h-4 ${accent ? 'text-white' : 'text-slate-400'}`} />
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold ${accent ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      {trend && (
        <p
          className={`text-xs mt-2 font-medium ${
            accent
              ? 'text-brand-100'
              : trendUp
              ? 'text-emerald-600'
              : 'text-red-500'
          }`}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
