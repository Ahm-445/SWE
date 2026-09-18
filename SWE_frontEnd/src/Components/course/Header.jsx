import { useNavigate } from "react-router-dom";

export const CourseHeader = ({ course, progress, completedCount, allLectures, setShowExamModal }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 font-custom">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="mb-5 flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-[#172033]"
          >
            <span className="text-lg">
              →
            </span>

            العودة للوحة التحكم
          </button>

          <div className="overflow-hidden rounded-3xl border border-[#e8dfd4] bg-white shadow-sm">
            <div className="p-6 md:p-8">

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#fff1d6] text-3xl">
                    📚
                  </div>

                  <div>

                    <p className="mb-1 text-sm font-bold text-[#f28c28]">
                      {course.code ||
                        course.id}
                    </p>

                    <h1 className="text-2xl font-black text-[#172033] md:text-3xl">
                      {course.name ||
                        course.title ||
                        "المادة"}
                    </h1>

                    {course.description && (
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {course.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowExamModal(true)
                  }
                  className="rounded-xl bg-[#172033] px-6 py-3 font-bold text-white transition hover:opacity-90"
                >
                  + إضافة اختبار
                </button>
              </div>

              {/* Progress */}

              <div className="mt-8 rounded-2xl bg-[#faf7f2] p-5">

                <div className="mb-3 flex items-center justify-between gap-4">

                  <span className="font-bold text-[#172033]">
                    تقدمك في المادة
                  </span>

                  <span className="font-black text-[#f28c28]">
                    {progress}%
                  </span>
                </div>

                <div
                  dir="ltr"
                  className="h-3 overflow-hidden rounded-full bg-[#e8dfd4]"
                >
                  <div
                    className="h-full rounded-full bg-[#f28c28] transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  أنجزت{" "}
                  {completedCount} من{" "}
                  {allLectures.length}{" "}
                  محاضرة
                </p>
              </div>
            </div>
          </div>
        </div>
  )}
