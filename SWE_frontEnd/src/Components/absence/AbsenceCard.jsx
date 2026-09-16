import {
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  BookOpen,
  Minus,
} from "lucide-react";

// بطاقة حساب الغياب للمقرر
export default function AbsenceCard({ course, onUpdateHours, onSetExactHours, onRemove }) {
  const weeklyHours = course.lecture + course.lab + course.tutorial;
  const totalSemesterHours = weeklyHours * 14;
  const maxAllowedAbsenceHours = Math.floor(totalSemesterHours * 0.25);
  
  const absentHours = course.absentHours || 0;
  const percentage = totalSemesterHours > 0 ? ((absentHours / totalSemesterHours) * 100) : 0;
  const remainingHours = Math.max(0, maxAllowedAbsenceHours - absentHours);

  // تحديد الحالة
  let statusBadge = { label: "في أمان", color: "bg-emerald-50 text-emerald-700 border-emerald-200", barColor: "bg-emerald-500", icon: ShieldCheck };
  if (absentHours >= maxAllowedAbsenceHours) {
    statusBadge = { label: "محروم (تجاوزت الحد)", color: "bg-red-50 text-red-700 border-red-200", barColor: "bg-red-500", icon: XCircle };
  } else if (percentage >= 15) {
    statusBadge = { label: "تنبيه (اقتربت من الحرمان)", color: "bg-amber-50 text-amber-700 border-amber-200", barColor: "bg-amber-500", icon: AlertTriangle };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#e6dfd5] shadow-xs hover:border-amber-400/80 transition-all text-right">
      
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#faf5ef] rounded-2xl border border-[#e6dfd5] text-gray-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-gray-800">{course.code}</h3>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border flex items-center gap-1 ${statusBadge.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {course.lecture} س محاضرة {course.tutorial > 0 ? `• ${course.tutorial} س تمارين` : ""} {course.lab > 0 ? `• ${course.lab} س عملي` : ""} ({weeklyHours} س/أسبوعياً)
            </p>
          </div>
        </div>

        <button
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          title="حذف المقرر"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* شريط نسبة الغياب التفاعلي */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-gray-500">نسبة الغياب من إجمالي ساعات المقرر:</span>
          <span className="text-sm font-black text-gray-800">{percentage.toFixed(2)}%</span>
        </div>

        <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${statusBadge.barColor}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-[11px] text-gray-400 mt-1.5 px-0.5 font-medium">
          <span>0%</span>
          <span className="text-amber-800 font-bold">حد الحرمان 25% ({maxAllowedAbsenceHours} ساعة)</span>
          <span>100%</span>
        </div>
      </div>

      {/* قسم تعديل الساعات وعداد الغياب */}
      <div className="bg-[#fbf8f3] rounded-2xl border border-[#e6dfd5] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
        <div>
          <span className="block text-xs font-bold text-gray-700">ساعات غيابك الحالية:</span>
          <span className="text-[11px] text-gray-400">سجل كل ساعة تغيبت عنها</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateHours(-1)}
            disabled={absentHours <= 0}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-amber-50 disabled:opacity-40 transition-colors shadow-2xs"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="number"
            min="0"
            max={totalSemesterHours}
            value={absentHours}
            onChange={(e) => onSetExactHours(e.target.value)}
            className="w-16 h-10 text-center font-black text-base bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
          />

          <button
            onClick={() => onUpdateHours(1)}
            className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center font-bold text-white hover:bg-gray-800 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* الملخص الرقمي السفلي */}
      <div className="grid grid-cols-3 gap-2 text-center pt-2">
        <div className="bg-[#faf5ef]/60 p-2.5 rounded-xl border border-[#e6dfd5]/60">
          <span className="block text-[11px] text-gray-500">إجمالي الساعات</span>
          <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{totalSemesterHours} ساعة</span>
        </div>
        <div className="bg-[#faf5ef]/60 p-2.5 rounded-xl border border-[#e6dfd5]/60">
          <span className="block text-[11px] text-gray-500">حد الغياب (25%)</span>
          <span className="text-sm font-extrabold text-amber-900 mt-0.5 block">{maxAllowedAbsenceHours} ساعة</span>
        </div>
        <div className="bg-[#faf5ef]/60 p-2.5 rounded-xl border border-[#e6dfd5]/60">
          <span className="block text-[11px] text-gray-500">المتبقي للحرمان</span>
          <span className={`text-sm font-extrabold mt-0.5 block ${remainingHours === 0 ? "text-red-600" : "text-emerald-700"}`}>
            {remainingHours} ساعة
          </span>
        </div>
      </div>

    </div>
  );
}
