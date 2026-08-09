import { useState } from "react";
import { Plus, Trash2, AlertCircle, RefreshCw } from "lucide-react";

const KSU_GRADES = [
  { grade: "أ+", weight: 5.00 },
  { grade: "أ", weight: 4.75 },
  { grade: "ب+", weight: 4.50 },
  { grade: "ب", weight: 4.00 },
  { grade: "ج+", weight: 3.50 },
  { grade: "ج", weight: 3.00 },
  { grade: "د+", weight: 2.50 },
  { grade: "د", weight: 2.00 },
  { grade: "هـ", weight: 1.00 },
  { grade: "NP (ناجح بدون درجة)", weight: null },
  { grade: "NF (راسب بدون درجة)", weight: null },
];

export default function GPACalculator() {
  const [prevGpa, setPrevGpa] = useState("");
  const [prevHours, setPrevHours] = useState("");

  const [courses, setCourses] = useState([
    { id: 1, name: "مادة 1", hours: 3, gradeWeight: 5.00 },
    { id: 2, name: "مادة 2", hours: 3, gradeWeight: 4.75 },
    { id: 3, name: "مادة 3", hours: 4, gradeWeight: 4.50 },
  ]);

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now(),
        name: `مادة ${courses.length + 1}`,
        hours: 3,
        gradeWeight: 5.00,
      },
    ]);
  };

  const removeCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const updateCourse = (id, field, value) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleReset = () => {
    setPrevGpa("");
    setPrevHours("");
    setCourses([{ id: 1, name: "مادة 1", hours: 3, gradeWeight: 5.00 }]);
  };

  const currentTotalHours = courses.reduce(
    (sum, c) => sum + (Number(c.hours) || 0),
    0
  );

  let currentPoints = 0;
  let currentGpaHours = 0;

  courses.forEach((c) => {
    if (c.gradeWeight !== null && c.gradeWeight !== "null") {
      const h = Number(c.hours) || 0;
      const w = Number(c.gradeWeight);
      currentPoints += h * w;
      currentGpaHours += h;
    }
  });

  const semesterGPA =
    currentGpaHours > 0 ? (currentPoints / currentGpaHours).toFixed(2) : "0.00";

  const pGpa = Number(prevGpa) || 0;
  const pHours = Number(prevHours) || 0;

  const totalPreviousPoints = pGpa * pHours;
  const newCumulativeHours = pHours + currentGpaHours;
  const newCumulativePoints = totalPreviousPoints + currentPoints;

  const cumulativeGPA =
    newCumulativeHours > 0
      ? (newCumulativePoints / newCumulativeHours).toFixed(2)
      : "0.00";

  return (
    <div dir="rtl" className="overflow-y-auto min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8 pb-20 md:pb-24">      
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-[#e6dfd5] p-6 md:p-8 mb-12">        
        {/* العناوين */}
        <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              حاسبة المعدل التراكمي — جامعة الملك سعود
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              سلم 5.00 نقاط والحد الأقصى للساعات 20 ساعة
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> إعادة ضبط
          </button>
        </div>

        {currentTotalHours > 20 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <span className="text-sm font-semibold">
              تنبيه: إجمالي الساعات الحالية ({currentTotalHours} ساعة) يتجاوز الحد الأقصى المسموح به (20 ساعة في الفصل).
            </span>
          </div>
        )}

        {/* قسم البيانات السابقة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-[#fbf8f3] p-5 rounded-2xl border border-[#e6dfd5]">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              المعدل التراكمي السابق (من 5.00)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              max="5"
              placeholder="مثال: 4.25"
              value={prevGpa}
              onChange={(e) => setPrevGpa(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              إجمالي الساعات المكتسبة السابقة
            </label>
            <input
              type="number"
              min="0"
              placeholder="مثال: 45"
              value={prevHours}
              onChange={(e) => setPrevHours(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
        </div>

        {/* قسم المواد الحالية */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              مواد الفصل الحالي ({courses.length})
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
              مجموع الساعات: {currentTotalHours} / 20
            </span>
          </div>


          <div className="max-h-[320px] overflow-y-auto space-y-3 pl-1 pr-1 border border-gray-100 rounded-2xl p-2 bg-gray-50/50">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-amber-400 transition-all shadow-sm"
              >
                {/* اسم المادة */}
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  className="w-full sm:w-1/3 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="اسم المادة"
                />

                {/* عدد الساعات */}
                <div className="w-full sm:w-1/4 flex items-center gap-2">
                  <span className="text-xs text-gray-500 shrink-0">الساعات:</span>
                  <select
                    value={course.hours}
                    onChange={(e) => updateCourse(course.id, "hours", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 9, 12].map((h) => (
                      <option key={h} value={h}>
                        {h} ساعة
                      </option>
                    ))}
                  </select>
                </div>

                {/* التقدير والدرجة */}
                <div className="w-full sm:w-1/3 flex items-center gap-2">
                  <span className="text-xs text-gray-500 shrink-0">التقدير:</span>
                  <select
                    value={course.gradeWeight === null ? "null" : course.gradeWeight}
                    onChange={(e) => {
                      const val = e.target.value === "null" ? null : Number(e.target.value);
                      updateCourse(course.id, "gradeWeight", val);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    {KSU_GRADES.map((g, idx) => (
                      <option key={idx} value={g.weight === null ? "null" : g.weight}>
                        {g.grade} {g.weight !== null ? `(${g.weight})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* زر الحذف */}
                <button
                  onClick={() => removeCourse(course.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors shrink-0"
                  title="حذف المادة"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* زر إضافة مادة */}
          <button
            onClick={addCourse}
            className="mt-4 w-full py-3 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-amber-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" /> إضافة مادة جديدة
          </button>
        </div>

        {/* النتائج والمعدلات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#e6dfd5]">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-3xl shadow-md text-center">
            <span className="text-xs opacity-90 font-medium">المعدل الفصلي المتوقع</span>
            <div className="text-4xl font-extrabold mt-2 mb-1">{semesterGPA}</div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">من 5.00</span>
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-md text-center">
            <span className="text-xs text-gray-400 font-medium">المعدل التراكمي الجديد</span>
            <div className="text-4xl font-extrabold mt-2 mb-1 text-amber-400">{cumulativeGPA}</div>
            <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
              إجمالي الساعات: {newCumulativeHours} ساعة
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}