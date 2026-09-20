import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courses } from "../data/courses";
import UpcomingExams from "../Components/dashboard/UpcomingExams";
import DashboardHero from "../Components/dashboard/DashboardHero";
import StatsSection from "../Components/dashboard/StatsSection";
import CoursesSection from "../Components/dashboard/CoursesSection";
import StudyIdea from "../Components/dashboard/StudyIdea";
import Curriculum from "../Components/dashboard/Curriculum";
import Zkr from "../Components/dashboard/Zkr"

const levelNames = {
  third: "المستوى الثالث",
  fourth: "المستوى الرابع",
  fifth: "المستوى الخامس",
  sixth: "المستوى السادس",
  seventh: "المستوى السابع",
  eighth: "المستوى الثامن",
};

const levelCodes = {
  third: ["فيز ١٠٣", "ريض ١٠٦", "عال ١١١", "ريض ١٥١"],
  fourth: ["فيز ١٠٤", "عال ١١٣", "هاب ٢١١", "ريض ٢٤٤", "هال ٣٠٣"],
  fifth: ["عال ٢١٢", "عال ٢٢٠", "هاب ٣١٢", "هاب ٣١٤"],
  sixth: ["عال ٢٢٧", "نال ٢٣٠", "هاب ٣٢١", "هاب ٣٣٣", "هاب ٣٨١"],
  seventh: ["سلم ١٠٧", "هاب ٤٣٤", "هاب ٤٤٤", "هاب ٤٧٧", "هاب ٤٨٢", "هاب ٤٩٦"],
  eighth: ["سلم ١٠٨", "هاب ٤٥٥", "هاب ٤٦٦", "هاب ٤٩٧", "هاب ٤٧٩"],
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
  .filter((course) => !Object.values(levelCodes).flat().includes(course.code))
  .map((course) => ({
    ...course,
    telegramUrl: course.telegram || null,
    prerequisite: course.prerequisite || null,
  }));

const curriculum = [
  { level: "third", label: "المستوى الثالث", description: "بداية مقررات التخصص الأساسية" },
  { level: "fourth", label: "المستوى الرابع", description: "مقررات التخصص والعلوم المساندة" },
  { level: "fifth", label: "المستوى الخامس", description: "مقررات هندسة البرمجيات الأساسية" },
  { level: "sixth", label: "المستوى السادس", description: "مقررات متقدمة في هندسة البرمجيات" },
  { level: "seventh", label: "المستوى السابع", description: "مقررات متقدمة ومشروع التخرج" },
  { level: "eighth", label: "المستوى الثامن", description: "مقررات التخرج والمقررات النهائية" },
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
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState("");

  const navigate = useNavigate();
  const user = getStoredUser();

  const currentLevel = user?.term_level || "third";
  const currentCourses = coursesByLevel[currentLevel] || [];
  const currentLevelName = levelNames[currentLevel] || "المستوى الدراسي";

  const totalHours = useMemo(
    () => currentCourses.reduce((sum, course) => sum + course.hours, 0),
    [currentCourses]
  );

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

          const lectures = allContent.filter((item) => item.type === "lecture");

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
                  ).length /
                    lectures.length) *
                    100
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/student", { replace: true });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#faf5ef] font-custom px-4 py-6 md:px-8 md:py-10 pb-20"
    >
      <div className="max-w-7xl mx-auto">
        <DashboardHero
          user={user}
          overallProgress={overallProgress}
          completedCourses={completedCourses}
          totalCourses={currentCourses.length}
          onLogout={handleLogout}
        />

        <StatsSection
          totalCourses={currentCourses.length}
          totalHours={totalHours}
          completedCourses={completedCourses}
          overallProgress={overallProgress}
        />


        <div className=" flex flex-col xl:flex-row gap-6 items-start ">
          <div className=" flex-1 w-full ">
            <CoursesSection
              courses={currentCourses}
              progress={progress}
              loading={isProgressLoading}
              error={progressError}
              currentLevelName={currentLevelName}
              onOpenCourse={(id) => navigate(`/course/${id}`)}
            />
          </div>

        <div className=" w-full xl:w-[330px] flex-col space-y-6 shrink-0 ">
          <UpcomingExams courses={currentCourses} />
          <StudyIdea />
          <Zkr/>
        </div>

        </div>

        <div className="mt-8 md:mt-10">
          <Curriculum
            curriculum={curriculum}
            coursesByLevel={coursesByLevel}
            currentLevel={currentLevel}
          />
        </div>
        
      </div>
    </div>
  );
}
