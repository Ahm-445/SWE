export default function RatingBar({ label, value, color }) {
  const percent = value
    ? Math.min(Math.max(Number(value), 0), 100).toFixed(1)
    : "0.0";

  return (
    <div className="bg-[#fcfaf7] p-3.5 rounded-2xl border border-[#e6dfd5]">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-gray-700">{label}</span>
        <span className="text-xs font-black text-gray-900">{percent}%</span>
      </div>

      <div className="w-full bg-gray-200/70 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
