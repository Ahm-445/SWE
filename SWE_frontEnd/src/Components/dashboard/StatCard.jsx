export default function StatCard({ icon: Icon, label, value, suffix }) {
  return (
    <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs md:text-sm text-gray-400 font-bold">{label}</p>

          <div className="flex items-end gap-2 mt-2">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-800">
              {value}
            </p>

            <span className="text-[10px] md:text-xs text-gray-400 font-bold mb-1">
              {suffix}
            </span>
          </div>
        </div>

        <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#fbf8f3] border border-[#e6dfd5] flex items-center justify-center">
          <Icon className="w-5 h-5 text-amber-600" />
        </div>
      </div>
    </div>
  );
}
