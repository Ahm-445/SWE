import { BookOpen } from "lucide-react";
import CourseCard from "./CourseCard";

export default function CoursesSection({
  courses,
  progress,
  loading,
  error,
  currentLevelName,
  onOpenCourse,
}) {
  return (
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
                <p className="text-sm text-gray-400 mt-1">{currentLevelName}</p>
              </div>
            </div>
          </div>

          <span className="w-fit px-4 py-2 rounded-xl bg-[#fbf8f3] border border-[#e6dfd5] text-sm font-bold text-gray-600">
            {courses.length} مقررات
          </span>
        </div>
      </div>

      {error && (
        <div className="mx-4 md:mx-6 mt-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 p-4 text-sm font-bold">
          {error}
        </div>
      )}

      {loading && (
        <div className="mx-4 md:mx-6 mt-4 rounded-2xl bg-[#fbf8f3] border border-[#e6dfd5] p-4 text-sm font-bold text-gray-500">
          جاري تحديث تقدم المواد...
        </div>
      )}

      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={progress[course.id] || 0}
            onOpen={() => onOpenCourse(course.id)}
          />
        ))}
      </div>
    </section>
  );
}
