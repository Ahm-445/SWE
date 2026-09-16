import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { coursesByLevel } from "./Dashboard";

const API_BASE = "https://swe-78u0.onrender.com/api";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function normalizeContent(items = []) {
  return items.map((item, index) => ({
    id: item.id,
    course_id: item.course_id,
    user_id: item.user_id,
    parent_id: item.parent_id ?? null,
    type: item.type || "chapter",
    title: item.title || "بدون عنوان",
    description: item.description || "",
    order_index:
      typeof item.order_index === "number"
        ? item.order_index
        : index,
    is_default: Boolean(item.is_default),
  }));
}

function buildTree(items) {
  const normalized = normalizeContent(items);

  const chapters = normalized
    .filter((item) => item.parent_id === null)
    .sort((a, b) => a.order_index - b.order_index);

  return chapters.map((chapter) => ({
    ...chapter,
    children: normalized
      .filter(
        (item) =>
          String(item.parent_id) === String(chapter.id)
      )
      .sort((a, b) => a.order_index - b.order_index),
  }));
}

function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function getCourseFromCatalog(courseId) {
  for (const level of Object.keys(coursesByLevel || {})) {
    const courses = coursesByLevel[level] || [];

    const found = courses.find(
      (course) =>
        String(course.id) === String(courseId)
    );

    if (found) return found;
  }

  return null;
}

export default function Course() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const userId = currentUser?.id;

  const course = useMemo(
    () => getCourseFromCatalog(courseId),
    [courseId]
  );

  const [content, setContent] = useState([]);
  const [exams, setExams] = useState([]);

  const [completedItems, setCompletedItems] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddContent, setShowAddContent] =
    useState(false);

  const [showExamModal, setShowExamModal] =
    useState(false);

  const [expandedChapters, setExpandedChapters] =
    useState({});

  const [newContent, setNewContent] = useState({
    type: "chapter",
    title: "",
    description: "",
    parent_id: null,
  });

  const [examForm, setExamForm] = useState({
    name: "",
    date: "",
    selectedParts: [],
  });

  const [savingContent, setSavingContent] =
    useState(false);

  const [savingExam, setSavingExam] =
    useState(false);

  const [savingProgress, setSavingProgress] =
    useState({});

  // =========================================================
  // تحميل بيانات المادة
  // =========================================================

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("يجب تسجيل الدخول أولاً.");
        setLoading(false);
        return;
      }

      try {
        const [
          contentResponse,
          examsResponse,
          progressResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE}/courses/${courseId}/content`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            `${API_BASE}/courses/${courseId}/exams`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            `${API_BASE}/courses/${courseId}/progress`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        if (!contentResponse.ok) {
          throw new Error(
            "تعذر تحميل محتوى المادة."
          );
        }

        if (!examsResponse.ok) {
          throw new Error(
            "تعذر تحميل اختبارات المادة."
          );
        }

        if (!progressResponse.ok) {
          throw new Error(
            "تعذر تحميل تقدم المادة."
          );
        }

        const contentData =
          await contentResponse.json();

        const examsData =
          await examsResponse.json();

        const progressData =
          await progressResponse.json();

        const apiContent = [
          ...(contentData.defaultContent || []),
          ...(contentData.userContent || []),
        ];

        const apiExams = [
          ...(examsData.defaultExams || []),
          ...(examsData.userExams || []),
        ];

        setContent(
          normalizeContent(apiContent)
        );

        setExams(apiExams);

        const progressMap = {};

        progressData.forEach((item) => {
          progressMap[item.content_id] =
            Boolean(item.completed);
        });

        setCompletedItems(progressMap);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "حدث خطأ أثناء تحميل بيانات المادة."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId, userId]);

  // =========================================================
  // شجرة المحتوى
  // =========================================================

  const contentTree = useMemo(
    () => buildTree(content),
    [content]
  );

  const allLectures = useMemo(() => {
    return content.filter(
      (item) => item.type === "lecture"
    );
  }, [content]);

  // =========================================================
  // التقدم
  // =========================================================

  const completedCount = useMemo(() => {
    return allLectures.filter(
      (item) => completedItems[item.id]
    ).length;
  }, [allLectures, completedItems]);

  const progress = useMemo(() => {
    if (allLectures.length === 0) {
      return 0;
    }

    return Math.round(
      (completedCount / allLectures.length) *
        100
    );
  }, [allLectures, completedCount]);

  // =========================================================
  // فتح وإغلاق الفصل
  // =========================================================

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // =========================================================
  // تغيير حالة المحاضرة
  // =========================================================

  const toggleCompleted = async (contentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("يجب تسجيل الدخول أولاً.");
      return;
    }

    const newValue =
      !Boolean(completedItems[contentId]);

    // تحديث فوري للواجهة
    setCompletedItems((prev) => ({
      ...prev,
      [contentId]: newValue,
    }));

    setSavingProgress((prev) => ({
      ...prev,
      [contentId]: true,
    }));

    try {
      const response = await fetch(
        `${API_BASE}/courses/${courseId}/progress/${contentId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            completed: newValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "تعذر حفظ تقدم المادة."
        );
      }
    } catch (error) {
      console.error(error);

      // إرجاع القيمة القديمة
      setCompletedItems((prev) => ({
        ...prev,
        [contentId]: !newValue,
      }));

      alert(
        error.message ||
          "تعذر حفظ التقدم."
      );
    } finally {
      setSavingProgress((prev) => ({
        ...prev,
        [contentId]: false,
      }));
    }
  };

  // =========================================================
  // إضافة محتوى
  // =========================================================

  const openAddContent = (
    parentId = null,
    type = "chapter"
  ) => {
    setNewContent({
      type,
      title: "",
      description: "",
      parent_id: parentId,
    });

    setShowAddContent(true);
  };

  const addContent = async () => {
    if (!newContent.title.trim()) {
      alert("اكتب عنوان المحتوى.");
      return;
    }

    if (
      newContent.type === "lecture" &&
      !newContent.parent_id
    ) {
      alert("اختر الفصل أولاً.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("يجب تسجيل الدخول أولاً.");
      return;
    }

    setSavingContent(true);

    try {
      const response = await fetch(
        `${API_BASE}/courses/${courseId}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            parent_id:
              newContent.parent_id || null,

            type: newContent.type,

            title:
              newContent.title.trim(),

            description:
              newContent.description.trim() ||
              "",

            order_index: content.length,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "تعذر إضافة المحتوى."
        );
      }

      const createdContent =
        normalizeContent([data])[0];

      setContent((prev) => [
        ...prev,
        createdContent,
      ]);

      // فتح الفصل تلقائيًا عند إضافة محاضرة
      if (createdContent.parent_id) {
        setExpandedChapters((prev) => ({
          ...prev,
          [createdContent.parent_id]: true,
        }));
      }

      setNewContent({
        type: "chapter",
        title: "",
        description: "",
        parent_id: null,
      });

      setShowAddContent(false);
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "حدث خطأ أثناء إضافة المحتوى."
      );
    } finally {
      setSavingContent(false);
    }
  };

  // =========================================================
  // الاختبارات
  // =========================================================

  const toggleExamPart = (contentId) => {
    setExamForm((prev) => {
      const exists =
        prev.selectedParts.includes(
          contentId
        );

      return {
        ...prev,

        selectedParts: exists
          ? prev.selectedParts.filter(
              (id) =>
                String(id) !==
                String(contentId)
            )
          : [
              ...prev.selectedParts,
              contentId,
            ],
      };
    });
  };

  const addExam = async () => {
    if (!examForm.name.trim()) {
      alert("اكتب اسم الاختبار.");
      return;
    }

    if (!examForm.date) {
      alert("اختر تاريخ الاختبار.");
      return;
    }

    if (
      examForm.selectedParts.length === 0
    ) {
      alert(
        "اختر جزءًا واحدًا على الأقل من محتوى المادة."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("يجب تسجيل الدخول أولاً.");
      return;
    }

    setSavingExam(true);

    try {
      const response = await fetch(
        `${API_BASE}/courses/${courseId}/exams`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: examForm.name.trim(),

            exam_date:
              examForm.date,

            content_ids:
              examForm.selectedParts,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "تعذر إضافة الاختبار."
        );
      }

      setExams((prev) => [
        ...prev,
        data,
      ]);

      setExamForm({
        name: "",
        date: "",
        selectedParts: [],
      });

      setShowExamModal(false);
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "حدث خطأ أثناء إضافة الاختبار."
      );
    } finally {
      setSavingExam(false);
    }
  };

  // =========================================================
  // نسبة إنجاز الاختبار
  // =========================================================

  const getExamProgress = (exam) => {
    const ids = exam.content_ids || [];

    if (ids.length === 0) {
      return 0;
    }

    const completed = ids.filter(
      (id) => completedItems[id]
    ).length;

    return Math.round(
      (completed / ids.length) *
        100
    );
  };

  // =========================================================
  // عرض المحاضرة
  // =========================================================

  const renderLecture = (lecture) => {
    const completed = Boolean(
      completedItems[lecture.id]
    );

    const saving =
      Boolean(savingProgress[lecture.id]);

    return (
      <div
        key={lecture.id}
        dir="rtl"
        className={`group rounded-2xl border transition-all ${
          completed
            ? "border-[#f28c28] bg-[#fff5e8]"
            : "border-[#e8dfd4] bg-white"
        }`}
      >
        <div className="flex items-center gap-4 p-4">

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              toggleCompleted(
                lecture.id
              )
            }
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
              completed
                ? "border-[#f28c28] bg-[#f28c28] text-white"
                : "border-[#d9d0c5] bg-white text-transparent hover:border-[#f28c28]"
            } ${
              saving
                ? "cursor-wait opacity-60"
                : ""
            }`}
            aria-label="تحديد كمكتملة"
          >
            {saving ? "..." : "✓"}
          </button>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[#172033]">
              {lecture.title}
            </h3>

            {lecture.description && (
              <p className="mt-1 text-sm leading-6 text-gray-500">
                {lecture.description}
              </p>
            )}
          </div>

          <span
            className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:block ${
              completed
                ? "bg-[#f28c28]/15 text-[#c66d0c]"
                : "bg-[#faf7f2] text-gray-500"
            }`}
          >
            {completed
              ? "مكتملة"
              : "غير مكتملة"}
          </span>
        </div>
      </div>
    );
  };

  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-6 text-right"
      >
        <div className="rounded-3xl border border-[#e8dfd4] bg-white px-10 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#f28c28]/20 border-t-[#f28c28]" />

          <p className="font-bold text-[#172033]">
            جاري تحميل المادة...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // المادة غير موجودة
  // =========================================================

  if (!course) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-6 text-right"
      >
        <div className="max-w-md rounded-3xl border border-[#e8dfd4] bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1d6] text-3xl">
            📚
          </div>

          <h1 className="text-2xl font-black text-[#172033]">
            المادة غير موجودة
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            لم يتم العثور على المادة المطلوبة.
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-6 rounded-xl bg-[#172033] px-6 py-3 font-bold text-white transition hover:opacity-90"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // Main
  // =========================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#faf7f2] px-4 py-8 text-right md:px-8"
    >
      <div className="mx-auto max-w-6xl">

        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}

        <div className="mb-8">

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

        {/* ================================================= */}
        {/* Error */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* Content */}
        {/* ================================================= */}

        <section className="mb-8">

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-black text-[#172033]">
                محتوى المادة
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                الفصول والمحاضرات الخاصة بالمادة
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                openAddContent(
                  null,
                  "chapter"
                )
              }
              className="rounded-xl bg-[#f28c28] px-5 py-3 font-bold text-white transition hover:opacity-90"
            >
              + إضافة فصل
            </button>
          </div>

          {contentTree.length === 0 ? (
            <div className="rounded-3xl border border-[#e8dfd4] bg-white p-10 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1d6] text-3xl">
                📖
              </div>

              <h3 className="text-lg font-black text-[#172033]">
                لا يوجد محتوى حتى الآن
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                أضف أول فصل للمادة للبدء.
              </p>

              <button
                type="button"
                onClick={() =>
                  openAddContent(
                    null,
                    "chapter"
                  )
                }
                className="mt-5 rounded-xl bg-[#172033] px-5 py-3 font-bold text-white"
              >
                إضافة فصل
              </button>
            </div>
          ) : (
            <div
              dir="rtl"
              className="space-y-4"
            >
              {contentTree.map(
                (chapter, chapterIndex) => {

                  const isExpanded =
                    expandedChapters[
                      chapter.id
                    ] ?? true;

                  const chapterLectures =
                    chapter.children || [];

                  const chapterCompleted =
                    chapterLectures.filter(
                      (lecture) =>
                        completedItems[
                          lecture.id
                        ]
                    ).length;

                  return (
                    <div
                      key={chapter.id}
                      className="overflow-hidden rounded-3xl border border-[#e8dfd4] bg-white shadow-sm"
                    >

                      {/* Chapter header */}

                      <div
                        dir="rtl"
                        className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            toggleChapter(
                              chapter.id
                            )
                          }
                          className="flex min-w-0 items-center gap-4 text-right"
                        >

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1d6] font-black text-[#f28c28]">
                            {chapterIndex + 1}
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-lg font-black text-[#172033]">
                              {chapter.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {chapterCompleted} من{" "}
                              {
                                chapterLectures.length
                              }{" "}
                              مكتملة
                            </p>
                          </div>
                        </button>

                        <div className="flex flex-wrap items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openAddContent(
                                chapter.id,
                                "lecture"
                              )
                            }
                            className="rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-2 text-sm font-bold text-[#172033] transition hover:border-[#f28c28]"
                          >
                            + إضافة محاضرة
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleChapter(
                                chapter.id
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f2] text-[#172033]"
                          >
                            {isExpanded
                              ? "⌃"
                              : "⌄"}
                          </button>
                        </div>
                      </div>

                      {/* Description */}

                      {chapter.description && (
                        <div className="border-t border-[#e8dfd4] px-5 py-4 text-sm leading-7 text-gray-500">
                          {chapter.description}
                        </div>
                      )}

                      {/* Lectures */}

                      {isExpanded && (
                        <div className="border-t border-[#e8dfd4] bg-[#faf7f2] p-4">

                          {chapterLectures.length ===
                          0 ? (
                            <div className="rounded-2xl border border-dashed border-[#d9d0c5] bg-white p-6 text-center">

                              <p className="text-sm text-gray-500">
                                لا توجد محاضرات في هذا
                                الفصل.
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  openAddContent(
                                    chapter.id,
                                    "lecture"
                                  )
                                }
                                className="mt-3 text-sm font-bold text-[#f28c28]"
                              >
                                + إضافة محاضرة
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {chapterLectures.map(
                                renderLecture
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* Exams */}
        {/* ================================================= */}

        <section>

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-black text-[#172033]">
                الاختبارات
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                الاختبارات المرتبطة بأجزاء المادة
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowExamModal(true)
              }
              className="rounded-xl bg-[#f28c28] px-5 py-3 font-bold text-white transition hover:opacity-90"
            >
              + إضافة اختبار
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="rounded-3xl border border-[#e8dfd4] bg-white p-10 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1d6] text-3xl">
                📝
              </div>

              <h3 className="text-lg font-black text-[#172033]">
                لا توجد اختبارات
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                أضف اختبارًا وحدد الأجزاء الداخلة
                فيه.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowExamModal(true)
                }
                className="mt-5 rounded-xl bg-[#172033] px-5 py-3 font-bold text-white"
              >
                إضافة اختبار
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {exams.map((exam) => {

                const examProgress =
                  getExamProgress(exam);

                const examParts =
                  (exam.content_ids || [])
                    .map((id) =>
                      content.find(
                        (item) =>
                          String(item.id) ===
                          String(id)
                      )
                    )
                    .filter(Boolean);

                return (
                  <div
                    key={exam.id}
                    className="rounded-3xl border border-[#e8dfd4] bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff1d6] text-xl">
                          📝
                        </div>

                        <div className="min-w-0">

                          <h3 className="font-black text-[#172033]">
                            {exam.name}
                          </h3>

                          <p
                            dir="rtl"
                            className="mt-1 text-sm text-gray-500"
                          >
                            {formatDate(
                              exam.exam_date
                            )}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-[#faf7f2] px-3 py-1 text-xs font-bold text-[#172033]">
                        {examProgress}%
                      </span>
                    </div>

                    <div className="mt-5">
                      <div
                        dir="ltr"
                        className="h-2 overflow-hidden rounded-full bg-[#e8dfd4]"
                      >
                        <div
                          className="h-full rounded-full bg-[#f28c28] transition-all"
                          style={{
                            width: `${examProgress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-5">

                      <p className="mb-2 text-sm font-bold text-[#172033]">
                        الأجزاء الداخلة:
                      </p>

                      {examParts.length > 0 ? (
                        <div className="flex flex-wrap gap-2">

                          {examParts.map(
                            (part) => (
                              <span
                                key={part.id}
                                className="rounded-lg bg-[#faf7f2] px-3 py-2 text-xs font-bold text-gray-600"
                              >
                                {part.title}
                              </span>
                            )
                          )}

                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">
                          لم يتم العثور على الأجزاء
                          المرتبطة.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ===================================================== */}
      {/* Add Content Modal */}
      {/* ===================================================== */}

      {showAddContent && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 p-4 text-right backdrop-blur-sm"
        >
          <div className="w-full max-w-xl rounded-3xl border border-[#e8dfd4] bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#e8dfd4] p-5">

              <div>
                <h2 className="text-xl font-black text-[#172033]">
                  إضافة{" "}
                  {newContent.type ===
                  "lecture"
                    ? "محاضرة"
                    : "فصل"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  أضف محتوى جديدًا للمادة
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddContent(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f2] text-gray-500 transition hover:bg-[#fff1d6]"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5">

              {/* Type */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  نوع المحتوى
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setNewContent(
                        (prev) => ({
                          ...prev,
                          type: "chapter",
                          parent_id:
                            null,
                        })
                      )
                    }
                    className={`rounded-xl border p-3 font-bold ${
                      newContent.type ===
                      "chapter"
                        ? "border-[#f28c28] bg-[#fff1d6] text-[#172033]"
                        : "border-[#e8dfd4] bg-white text-gray-500"
                    }`}
                  >
                    📚 فصل
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNewContent(
                        (prev) => ({
                          ...prev,
                          type: "lecture",
                        })
                      )
                    }
                    className={`rounded-xl border p-3 font-bold ${
                      newContent.type ===
                      "lecture"
                        ? "border-[#f28c28] bg-[#fff1d6] text-[#172033]"
                        : "border-[#e8dfd4] bg-white text-gray-500"
                    }`}
                  >
                    📖 محاضرة
                  </button>

                </div>
              </div>

              {/* Title */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  عنوان{" "}
                  {newContent.type ===
                  "lecture"
                    ? "المحاضرة"
                    : "الفصل"}
                </label>

                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) =>
                    setNewContent(
                      (prev) => ({
                        ...prev,
                        title:
                          e.target.value,
                      })
                    )
                  }
                  placeholder={
                    newContent.type ===
                    "lecture"
                      ? "مثال: المحاضرة الأولى"
                      : "مثال: الفصل الأول"
                  }
                  className="w-full rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-3 text-right outline-none transition focus:border-[#f28c28]"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  الوصف
                </label>

                <textarea
                  value={
                    newContent.description
                  }
                  onChange={(e) =>
                    setNewContent(
                      (prev) => ({
                        ...prev,
                        description:
                          e.target.value,
                      })
                    )
                  }
                  rows={4}
                  placeholder="اكتب وصفًا مختصرًا للمحتوى..."
                  className="w-full resize-none rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-3 text-right outline-none transition focus:border-[#f28c28]"
                />
              </div>

              {/* Parent */}

              {newContent.type ===
                "lecture" && (
                <div>

                  <label className="mb-2 block text-sm font-bold text-[#172033]">
                    الفصل
                  </label>

                  <select
                    value={
                      newContent.parent_id ||
                      ""
                    }
                    onChange={(e) =>
                      setNewContent(
                        (prev) => ({
                          ...prev,
                          parent_id:
                            e.target.value
                              ? Number(
                                  e.target
                                    .value
                                )
                              : null,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-3 text-right outline-none focus:border-[#f28c28]"
                  >
                    <option value="">
                      اختر الفصل
                    </option>

                    {content
                      .filter(
                        (item) =>
                          item.type ===
                          "chapter"
                      )
                      .map((chapter) => (
                        <option
                          key={chapter.id}
                          value={chapter.id}
                        >
                          {chapter.title}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddContent(false)
                  }
                  className="flex-1 rounded-xl bg-[#f3eee8] px-5 py-3 font-bold text-[#172033]"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  disabled={
                    savingContent ||
                    !newContent.title.trim()
                  }
                  onClick={addContent}
                  className="flex-1 rounded-xl bg-[#f28c28] px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingContent
                    ? "جاري الحفظ..."
                    : "إضافة المحتوى"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* Add Exam Modal */}
      {/* ===================================================== */}

      {showExamModal && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 p-4 text-right backdrop-blur-sm"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e8dfd4] bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-[#e8dfd4] p-5">

              <div>

                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1d6]">
                  📝
                </div>

                <h2 className="text-xl font-black text-[#172033]">
                  إضافة اختبار
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  حدد اسم الاختبار وتاريخه والأجزاء
                  الداخلة فيه.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowExamModal(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f2] text-gray-500 transition hover:bg-[#fff1d6]"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-5">

              {/* Exam name */}

              <div>

                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  اسم الاختبار
                </label>

                <input
                  type="text"
                  value={examForm.name}
                  onChange={(e) =>
                    setExamForm(
                      (prev) => ({
                        ...prev,
                        name:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="مثال: الاختبار النصفي"
                  className="w-full rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-4 text-right outline-none transition focus:border-[#f28c28]"
                />
              </div>

              {/* Exam date */}

              <div>

                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  تاريخ الاختبار
                </label>

                <input
                  type="date"
                  value={examForm.date}
                  onChange={(e) =>
                    setExamForm(
                      (prev) => ({
                        ...prev,
                        date: e.target.value,
                      })
                    )
                  }
                  dir="ltr"
                  className="w-full rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-4 text-right outline-none transition focus:border-[#f28c28]"
                />

              </div>

              {/* Content selection */}

              <div>

                <div className="mb-3 flex items-center justify-between gap-4">

                  <label className="block text-sm font-bold text-[#172033]">
                    الأجزاء الداخلة في الاختبار
                  </label>

                  <span className="text-xs font-bold text-gray-400">
                    تم اختيار{" "}
                    {
                      examForm
                        .selectedParts
                        .length
                    }
                  </span>
                </div>

                {allLectures.length ===
                0 ? (
                  <div className="rounded-2xl border border-[#e8dfd4] bg-[#faf7f2] p-6 text-center text-sm text-gray-500">
                    أضف محتوى المادة أولًا حتى
                    تتمكن من ربطه بالاختبار.
                  </div>
                ) : (
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-[#e8dfd4] bg-[#faf7f2] p-3">

                    {contentTree.map(
                      (chapter) => (
                        <div
                          key={chapter.id}
                        >

                          <div className="mb-2 rounded-xl bg-white px-3 py-2 font-black text-[#172033]">
                            {chapter.title}
                          </div>

                          <div className="space-y-2 pr-3">

                            {(
                              chapter.children ||
                              []
                            ).map(
                              (lecture) => {

                                const selected =
                                  examForm.selectedParts.some(
                                    (id) =>
                                      String(
                                        id
                                      ) ===
                                      String(
                                        lecture.id
                                      )
                                  );

                                return (
                                  <button
                                    key={
                                      lecture.id
                                    }
                                    type="button"
                                    onClick={() =>
                                      toggleExamPart(
                                        lecture.id
                                      )
                                    }
                                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-right transition ${
                                      selected
                                        ? "border-[#f28c28] bg-[#fff1d6]"
                                        : "border-[#e8dfd4] bg-white hover:border-[#f28c28]"
                                    }`}
                                  >

                                    <span
                                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                                        selected
                                          ? "border-[#f28c28] bg-[#f28c28] text-white"
                                          : "border-[#d9d0c5] bg-white text-transparent"
                                      }`}
                                    >
                                      ✓
                                    </span>

                                    <span className="text-sm font-bold text-[#172033]">
                                      {
                                        lecture.title
                                      }
                                    </span>

                                  </button>
                                );
                              }
                            )}

                          </div>
                        </div>
                      )
                    )}

                  </div>
                )}
              </div>

              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowExamModal(false)
                  }
                  className="flex-1 rounded-xl bg-[#f3eee8] px-5 py-4 font-bold text-[#172033]"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  disabled={
                    savingExam ||
                    !examForm.name.trim() ||
                    !examForm.date ||
                    examForm.selectedParts
                      .length === 0
                  }
                  onClick={addExam}
                  className="flex-1 rounded-xl bg-[#f28c28] px-5 py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingExam
                    ? "جاري الحفظ..."
                    : "إضافة الاختبار"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}