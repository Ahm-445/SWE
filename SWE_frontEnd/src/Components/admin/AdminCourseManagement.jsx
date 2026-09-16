import {
  BookOpen,
  FileText,
  RefreshCw,
} from "lucide-react";

export default function AdminCourseManagement({
  selectedCourse,
  setSelectedCourse,
  courses,
  courseError,
  courseLoading,
  contentForm,
  setContentForm,
  savingContent,
  onContentSubmit,
  examForm,
  setExamForm,
  savingExam,
  onExamSubmit,
  defaultChapters,
  defaultLectures,
  toggleExamContent,
  chapters,
  courseExams,
}) {
  return (
        <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm overflow-hidden mb-6">
          <div className="p-5 md:p-6 border-b border-[#e6dfd5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">
                  إدارة محتوى المواد
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  إضافة محتوى واختبارات افتراضية تظهر لجميع الطلاب
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 space-y-6">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">
                اختر المادة
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-xl border border-[#e6dfd5] bg-[#fffdf9] px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="">اختر المادة</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.id} — {course.name}
                  </option>
                ))}
              </select>
            </div>

            {courseError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-bold">
                {courseError}
              </div>
            )}

            {!selectedCourse ? (
              <div className="rounded-2xl bg-[#fbf8f3] p-6 text-center text-sm text-gray-500 font-bold">
                اختر مادة لبدء إدارة محتواها واختباراتها.
              </div>
            ) : courseLoading ? (
              <div className="py-8 flex justify-center">
                <RefreshCw className="w-7 h-7 text-amber-500 animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add content */}
                  <form
                    onSubmit={onContentSubmit}
                    className="rounded-2xl border border-[#e6dfd5] p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                      <h3 className="font-extrabold text-gray-800">
                        إضافة محتوى
                      </h3>
                    </div>

                    <select
                      value={contentForm.type}
                      onChange={(e) =>
                        setContentForm((c) => ({
                          ...c,
                          type: e.target.value,
                          parent_id: "",
                        }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold"
                    >
                      <option value="chapter">Chapter</option>
                      <option value="lecture">Lecture</option>
                    </select>

                    {contentForm.type === "lecture" && (
                      <select
                        value={contentForm.parent_id}
                        onChange={(e) =>
                          setContentForm((c) => ({
                            ...c,
                            parent_id: e.target.value,
                          }))
                        }
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold"
                      >
                        <option value="">اختر الـ Chapter</option>
                        {defaultChapters.map((chapter) => (
                          <option key={chapter.id} value={chapter.id}>
                            {chapter.title}
                          </option>
                        ))}
                      </select>
                    )}

                    <input
                      value={contentForm.title}
                      onChange={(e) =>
                        setContentForm((c) => ({
                          ...c,
                          title: e.target.value,
                        }))
                      }
                      placeholder="عنوان المحتوى"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold"
                    />

                    <textarea
                      value={contentForm.description}
                      onChange={(e) =>
                        setContentForm((c) => ({
                          ...c,
                          description: e.target.value,
                        }))
                      }
                      placeholder="الوصف (اختياري)"
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                    />

                    <input
                      type="number"
                      min="0"
                      value={contentForm.order_index}
                      onChange={(e) =>
                        setContentForm((c) => ({
                          ...c,
                          order_index: e.target.value,
                        }))
                      }
                      placeholder="الترتيب"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                    />

                    <button
                      type="submit"
                      disabled={savingContent}
                      className="w-full rounded-xl bg-amber-500 text-white py-3 font-extrabold hover:bg-amber-600 disabled:opacity-60"
                    >
                      {savingContent ? "جاري الإضافة..." : "إضافة المحتوى"}
                    </button>
                  </form>

                  {/* Add exam */}
                  <form
                    onSubmit={onExamSubmit}
                    className="rounded-2xl border border-[#e6dfd5] p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <h3 className="font-extrabold text-gray-800">
                        إضافة اختبار
                      </h3>
                    </div>

                    <input
                      value={examForm.name}
                      onChange={(e) =>
                        setExamForm((c) => ({
                          ...c,
                          name: e.target.value,
                        }))
                      }
                      placeholder="اسم الاختبار"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold"
                    />

                    <input
                      type="date"
                      dir="ltr"
                      value={examForm.exam_date}
                      onChange={(e) =>
                        setExamForm((c) => ({
                          ...c,
                          exam_date: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-right"
                    />

                    <div>
                      <p className="text-sm font-extrabold text-gray-700 mb-2">
                        أجزاء المادة الداخلة في الاختبار
                      </p>

                      {defaultLectures.length === 0 ? (
                        <p className="text-xs text-gray-400 bg-[#fbf8f3] rounded-xl p-3">
                          أضف محاضرات أولًا حتى تستطيع ربطها بالاختبار.
                        </p>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {defaultLectures.map((lecture) => (
                            <label
                              key={lecture.id}
                              className="flex items-center gap-3 rounded-xl bg-[#fbf8f3] px-3 py-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={examForm.content_ids.includes(lecture.id)}
                                onChange={() => toggleExamContent(lecture.id)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm font-bold text-gray-700">
                                {lecture.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={savingExam}
                      className="w-full rounded-xl bg-gray-900 text-white py-3 font-extrabold hover:bg-gray-800 disabled:opacity-60"
                    >
                      {savingExam ? "جاري الإضافة..." : "إضافة الاختبار"}
                    </button>
                  </form>
                </div>

                {/* Current default content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-[#fbf8f3] p-5">
                    <h3 className="font-extrabold text-gray-800 mb-3">
                      المحتوى الحالي
                    </h3>

                    {chapters.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        لا يوجد محتوى افتراضي حتى الآن.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {chapters.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-xl px-4 py-3 border border-[#e6dfd5]"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold text-gray-800">
                                {item.type === "chapter" ? "📚" : "📖"}{" "}
                                {item.title}
                              </span>
                              <span className="text-xs text-gray-400">
                                #{item.order_index}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl bg-[#fbf8f3] p-5">
                    <h3 className="font-extrabold text-gray-800 mb-3">
                      الاختبارات الحالية
                    </h3>

                    {courseExams.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        لا توجد اختبارات افتراضية حتى الآن.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {courseExams.map((exam) => (
                          <div
                            key={exam.id}
                            className="bg-white rounded-xl px-4 py-3 border border-[#e6dfd5]"
                          >
                            <p className="font-extrabold text-gray-800">
                              {exam.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1" dir="ltr">
                              {exam.exam_date}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
  );
}
