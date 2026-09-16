import { GraduationCap, Target } from "lucide-react";

export default function DashboardHero({
  user,
  overallProgress,
  completedCourses,
  totalCourses,
  onLogout,
}) {
  return (
    <section className="relative overflow-hidden bg-white rounded-[2rem] border border-[#e6dfd5] shadow-sm p-6 md:p-8 mb-6">
      <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="absolute -bottom-24 right-10 w-64 h-64 rounded-full bg-orange-100/40 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-amber-600" />
            </div>

            <div>
              <p className="text-sm text-amber-800/60 font-bold">
                مجتمع هندسة البرمجيات — KSU
              </p>
              <p className="text-xs text-gray-400 mt-1">لوحة الطالب</p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            أهلاً {user?.name || "بك"} 👋
          </h1>

          <p className="text-gray-500 mt-2">
            خلّنا نتابع تقدمك الأكاديمي خطوة بخطوة.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onLogout}
            className="px-5 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition"
          >
            تسجيل الخروج
          </button>
        </div>

        <div className="w-full lg:w-[330px] bg-[#fbf8f3] rounded-3xl border border-[#e6dfd5] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 font-bold">
                تقدمك في مقررات المستوى
              </p>
              <p className="text-3xl font-extrabold text-gray-800 mt-1">
                {overallProgress}%
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
          </div>

          <div className="h-3 bg-white rounded-full overflow-hidden border border-[#eee7de]">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-3">
            {completedCourses} من {totalCourses} مواد مكتملة
          </p>
        </div>
      </div>
    </section>
  );
}
