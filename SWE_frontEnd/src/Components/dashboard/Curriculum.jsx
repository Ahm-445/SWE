import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Map } from "lucide-react";

export default function Curriculum({
  curriculum,
  coursesByLevel,
  currentLevel,
}) {
  const [showCurriculum, setShowCurriculum] = useState(false);

  return (
    <section className=" bg-white rounded-[2rem] border border-[#e6dfd5] shadow-sm overflow-hidden">
      <button
        onClick={() => setShowCurriculum(!showCurriculum)}
        className="w-full p-6 md:p-7 flex items-center justify-between text-right hover:bg-[#fffdfa] transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center">
            <Map className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">
              الخطة الدراسية
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              استكشف مقررات هندسة البرمجيات حسب المستوى
            </p>
          </div>
        </div>

        {showCurriculum ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {showCurriculum && (
        <div className="border-t border-[#eee7de] p-5 md:p-7 space-y-3">
          {curriculum.map((item) => {
            const courses = coursesByLevel[item.level] || [];
            const isCurrent = item.level === currentLevel;

            return (
              <div
                key={item.level}
                className={`rounded-2xl border p-4 transition ${
                  isCurrent
                    ? "border-amber-300 bg-amber-50/50"
                    : "border-[#e6dfd5] bg-[#fffdfa]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-gray-800">
                        {item.label}
                      </h3>

                      {isCurrent && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-extrabold">
                          مستواك الحالي
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500">
                      {courses.length} مقررات
                    </span>
                    <ArrowLeft className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {courses.map((course) => (
                    <span
                      key={course.id}
                      className={`px-3 py-2 rounded-xl text-xs font-bold ${
                        isCurrent
                          ? "bg-white border border-amber-200 text-gray-700"
                          : "bg-[#fbf8f3] border border-[#e6dfd5] text-gray-600"
                      }`}
                    >
                      {course.code}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
