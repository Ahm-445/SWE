import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  Map,
  Target,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { courses } from "../data/courses";

const levelNames = {
  third: "المستوى الثالث",
  fourth: "المستوى الرابع",
  fifth: "المستوى الخامس",
  sixth: "المستوى السادس",
  seventh: "المستوى السابع",
  eighth: "المستوى الثامن",
};

const levelCodes = {
  "third": [
    "فيز ١٠٣",
    "ريض ١٠٦",
    "عال ١١١",
    "ريض ١٥١"
  ],
  "fourth": [
    "فيز ١٠٤",
    "عال ١١٣",
    "هاب ٢١١",
    "ريض ٢٤٤",
    "هال ٣٠٣"
  ],
  "fifth": [
    "عال ٢١٢",
    "عال ٢٢٠",
    "هاب ٣١٢",
    "هاب ٣١٤"
  ],
  "sixth": [
    "عال ٢٢٧",
    "نال ٢٣٠",
    "هاب ٣٢١",
    "هاب ٣٣٣",
    "هاب ٣٨١"
  ],
  "seventh": [
    "سلم ١٠٧",
    "هاب ٤٣٤",
    "هاب ٤٤٤",
    "هاب ٤٧٧",
    "هاب ٤٨٢",
    "هاب ٤٩٦"
  ],
  "eighth": [
    "سلم ١٠٨",
    "هاب ٤٥٥",
    "هاب ٤٦٦",
    "هاب ٤٩٧",
    "هاب ٤٧٩"
  ]
};

export const coursesByLevel = Object.fromEntries(
  Object.entries(levelCodes).map(([level, codes]) => [
    level,
    codes
      .map((code) => courses.find((course) => course.code === code))
      .filter(Boolean)
      .map((course) => ({
        ...course,
        telegramUrl: course.telegram || null,
        prerequisite: course.prerequisite || null,
      })),
  ])
);

export const unassignedCourses = courses
  .filter(
    (course) =>
      !Object.values(levelCodes)
        .flat()
        .includes(course.code)
  )
  .map((course) => ({
    ...course,
    telegramUrl: course.telegram || null,
    prerequisite: course.prerequisite || null,
  }));

const curriculum = [
  {
    level: "third",
    label: "المستوى الثالث",
    description: "بداية مقررات التخصص الأساسية",
  },
  {
    level: "fourth",
    label: "المستوى الرابع",
    description: "مقررات التخصص والعلوم المساندة",
  },
  {
    level: "fifth",
    label: "المستوى الخامس",
    description: "مقررات هندسة البرمجيات الأساسية",
  },
  {
    level: "sixth",
    label: "المستوى السادس",
    description: "مقررات متقدمة في هندسة البرمجيات",
  },
  {
    level: "seventh",
    label: "المستوى السابع",
    description: "مقررات متقدمة ومشروع التخرج",
  },
  {
    level: "eighth",
    label: "المستوى الثامن",
    description: "مقررات التخرج والمقررات النهائية",
  },
];

const API_BASE = "https://swe-78u0.onrender.com/api";

function getStoredUser() {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [progress, setProgress] = useState({});
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState("");

  const navigate = useNavigate();
  const user = getStoredUser();

  const currentLevel = user?.term_level || "third";

  const currentCourses = coursesByLevel[currentLevel] || [];

  const currentLevelName =
    levelNames[currentLevel] || "المستوى الدراسي";

  const totalHours = useMemo(() => {
    return currentCourses.reduce((sum, course) => sum + course.hours, 0);
  }, [currentCourses]);

  const loadProgress = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token || !currentCourses.length) {
      setProgress({});
      setIsProgressLoading(false);
      return;
    }

    try {
      setIsProgressLoading(true);
      setProgressError("");

      const results = await Promise.all(
        currentCourses.map(async (course) => {
          const courseId = encodeURIComponent(course.id);

          const [contentResponse, progressResponse] = await Promise.all([
            fetch(`${API_BASE}/courses/${courseId}/content`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/courses/${courseId}/progress`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const contentData = await contentResponse.json();
          const progressData = await progressResponse.json();

          if (!contentResponse.ok || !progressResponse.ok) {
            throw new Error(
              contentData.error ||
              progressData.error ||
              "تعذر تحميل تقدم المواد."
            );
          }

          const allContent = [
            ...(contentData.defaultContent || []),
            ...(contentData.userContent || []),
          ];

          const lectures = allContent.filter(
            (item) => item.type === "lecture"
          );

          const completedIds = new Set(
            (progressData || [])
              .filter((item) => item.completed)
              .map((item) => Number(item.content_id))
          );

          const value =
            lectures.length > 0
              ? Math.round(
                  (lectures.filter((lecture) =>
                    completedIds.has(Number(lecture.id))
                  ).length / lectures.length) * 100
                )
              : 0;

          return [course.id, value];
        })
      );

      setProgress(Object.fromEntries(results));
    } catch (error) {
      console.error("Dashboard progress:", error);
      setProgressError(error.message || "تعذر تحميل تقدم المواد.");
    } finally {
      setIsProgressLoading(false);
    }
  }, [currentCourses]);

  useEffect(() => {
    loadProgress();

    const handleFocus = () => loadProgress();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [loadProgress]);

  const completedCourses = currentCourses.filter(
    (course) => (progress[course.id] || 0) >= 100
  ).length;

  const overallProgress =
    currentCourses.length > 0
      ? Math.round(
          currentCourses.reduce(
            (sum, course) => sum + (progress[course.id] || 0),
            0
          ) / currentCourses.length
        )
      : 0;

    setProgress(newProgress);
    saveProgress(newProgress);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#faf5ef] font-custom px-4 py-6 md:px-8 md:py-10 pb-20"
    >
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HERO
        ====================================================== */}

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

                  <p className="text-xs text-gray-400 mt-1">
                    لوحة الطالب
                  </p>
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
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/student", { replace: true });
                }}
                className="px-5 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition"
              >
                تسجيل الخروج
              </button>
            </div>

            {/* Overall progress */}

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
                {completedCourses} من {currentCourses.length} مواد مكتملة
              </p>

            </div>

          </div>
        </section>


        {/* =====================================================
            QUICK STATS
        ====================================================== */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <StatCard
            icon={BookOpen}
            label="مواد المستوى"
            value={currentCourses.length}
            suffix="مواد"
          />

          <StatCard
            icon={CalendarDays}
            label="الساعات"
            value={totalHours}
            suffix="ساعة"
          />

          <StatCard
            icon={CheckCircle2}
            label="مواد مكتملة"
            value={completedCourses}
            suffix={`من ${currentCourses.length}`}
          />

          <StatCard
            icon={Trophy}
            label="التقدم"
            value={`${overallProgress}%`}
            suffix="هذا المستوى"
          />

        </section>


        {/* =====================================================
            CURRENT COURSES
        ====================================================== */}

        <section className="bg-white rounded-[2rem] border border-[#e6dfd5] shadow-sm overflow-hidden mb-6">

          <div className="p-6 md:p-7 border-b border-[#eee7de]">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                  </div>

                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">
                      مقرراتي
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                      {currentLevelName}
                    </p>
                  </div>

                </div>

              </div>

              <span className="w-fit px-4 py-2 rounded-xl bg-[#fbf8f3] border border-[#e6dfd5] text-sm font-bold text-gray-600">
                {currentCourses.length} مقررات
              </span>

            </div>

          </div>


          {progressError && (
            <div className="mx-4 md:mx-6 mt-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 p-4 text-sm font-bold">
              {progressError}
            </div>
          )}

          {isProgressLoading && (
            <div className="mx-4 md:mx-6 mt-4 rounded-2xl bg-[#fbf8f3] border border-[#e6dfd5] p-4 text-sm font-bold text-gray-500">
              جاري تحديث تقدم المواد...
            </div>
          )}

          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            {currentCourses.map((course) => {

              const courseProgress = progress[course.id] || 0;
              const isExpanded = expandedCourse === course.id;

              return (
                <div
                  key={course.id}
                  className="rounded-3xl border border-[#e6dfd5] bg-[#fffdfa] overflow-hidden hover:shadow-md transition-shadow"
                >

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="w-11 h-11 shrink-0 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-extrabold text-xs">
                          {course.code.split(" ")[0]}
                        </div>

                        <div>

                          <p className="text-xs font-bold text-amber-600">
                            {course.code}
                          </p>

                          <h3 className="font-extrabold text-gray-800 mt-1">
                            {course.name}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            {course.department} • {course.hours} ساعات
                          </p>

                        </div>

                      </div>

                      <span className="text-sm font-extrabold text-gray-700">
                        {courseProgress}%
                      </span>

                    </div>


                    {/* Progress */}

                    <div className="mt-5">

                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">
                          تقدم المذاكرة
                        </span>

                        <span className="font-bold text-gray-600">
                          {courseProgress}%
                        </span>
                      </div>

                      <div className="h-2.5 bg-[#eee7de] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${courseProgress}%`,
                          }}
                        />
                      </div>

                    </div>


                    {/* Actions */}

                    <div className="flex flex-wrap gap-2 mt-5">

                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
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


                  {/* Expanded Course */}

                  {isExpanded && (
                    <div className="border-t border-[#eee7de] bg-[#fbf8f3] p-5">

                      <div className="flex items-center justify-between mb-4">

                        <div>
                          <p className="text-sm font-extrabold text-gray-800">
                            تقدمك في {course.code}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            حاليًا سنجعل النسبة قابلة للتعديل، وفي المرحلة التالية
                            ستُحسب من أجزاء المادة التي تضيفها.
                          </p>
                        </div>

                        <Target className="w-5 h-5 text-amber-500" />

                      </div>


                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={courseProgress}
                        onChange={(e) =>
                          updateCourseProgress(
                            course.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-full accent-amber-500"
                      />


                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>


                      {course.prerequisite && (
                        <div className="mt-5 bg-white rounded-2xl border border-[#e6dfd5] p-4">

                          <p className="text-xs text-gray-400 font-bold">
                            المتطلب السابق
                          </p>

                          <p className="text-sm font-extrabold text-gray-700 mt-1">
                            {course.prerequisite}
                          </p>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </section>


        {/* =====================================================
            EXAMS / STUDY PLAN PREVIEW
        ====================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-[2rem] border border-[#e6dfd5] shadow-sm p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-gray-800">
                  خطط الاختبارات
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  تابع استعدادك للميد والفاينل
                </p>
              </div>

            </div>

            <div className="rounded-2xl bg-[#fbf8f3] border border-[#e6dfd5] p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="font-extrabold text-gray-800">
                    لا توجد خطط اختبارات بعد
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    أضف اختبارًا وحدد الأجزاء التي تريد مذاكرتها.
                  </p>
                </div>

                <button className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition">
                  + إضافة اختبار
                </button>

              </div>

            </div>

          </div>


          {/* Study idea */}

          <div className="bg-gray-900 rounded-[2rem] shadow-sm p-6 text-white relative overflow-hidden">

            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-amber-500/20 blur-2xl" />

            <div className="relative">

              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
              </div>

              <h2 className="text-xl font-extrabold">
                خطوتك القادمة 🎯
              </h2>

              <p className="text-sm text-gray-300 mt-2 leading-6">
                قريبًا تقدر تقسم كل مادة إلى Chapters ومحاضرات
                وتحدد الأجزاء الداخلة في كل اختبار، ونحسب لك نسبة
                الإنجاز تلقائيًا.
              </p>

              <div className="flex items-center gap-2 mt-5 text-xs text-gray-400">
                <Trophy className="w-4 h-4 text-amber-400" />
                كل إنجاز يقربك من هدفك.
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CURRICULUM
        ====================================================== */}

        <section className="bg-white rounded-[2rem] border border-[#e6dfd5] shadow-sm overflow-hidden">

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

      </div>
    </div>
  );



/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}) {
  return (
    <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm p-5">

      <div className="flex items-center justify-between gap-3">

        <div>

          <p className="text-xs md:text-sm text-gray-400 font-bold">
            {label}
          </p>

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