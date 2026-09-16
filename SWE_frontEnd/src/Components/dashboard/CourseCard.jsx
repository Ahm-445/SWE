import { ExternalLink, Target } from "lucide-react";

export default function CourseCard({ course, progress, onOpen }) {
  return (
    <div className="rounded-3xl border border-[#e6dfd5] bg-[#fffdfa] overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-extrabold text-xs">
              {course.code.split(" ")[0]}
            </div>

            <div>
              <p className="text-xs font-bold text-amber-600">{course.code}</p>

              <h3 className="font-extrabold text-gray-800 mt-1">
                {course.name}
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                {course.department} • {course.hours} ساعات
              </p>
            </div>
          </div>

          <span className="text-sm font-extrabold text-gray-700">{progress}%</span>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">تقدم المذاكرة</span>
            <span className="font-bold text-gray-600">{progress}%</span>
          </div>

          <div className="h-2.5 bg-[#eee7de] rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={onOpen}
            className="w-full mt-4 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition"
          >
            دخول للمادة
          </button>

          {course.telegramUrl && (
            <a
              href={course.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#e6dfd5] bg-white text-gray-700 text-xs font-bold hover:bg-[#fbf8f3] transition"
            >
              <ExternalLink className="w-4 h-4" />
              المصادر
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-[#eee7de] bg-[#fbf8f3] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-gray-800">تقدم المادة</p>
            <p className="text-xs text-gray-400 mt-1">
              النسبة تُحسب تلقائيًا من المحاضرات المكتملة داخل المادة.
            </p>
          </div>

          <Target className="w-5 h-5 text-amber-500" />
        </div>

        <div className="mt-4 h-2.5 bg-white rounded-full overflow-hidden border border-[#eee7de]">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {course.prerequisite && (
          <div className="mt-5 bg-white rounded-2xl border border-[#e6dfd5] p-4">
            <p className="text-xs text-gray-400 font-bold">المتطلب السابق</p>
            <p className="text-sm font-extrabold text-gray-700 mt-1">
              {course.prerequisite}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
