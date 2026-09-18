import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseHeader } from "../Components/course/Header";
import Content from "../Components/course/Content";
import {Exams} from "../Components/course/Exams";
import AddContentModel from "../Components/course/AddContentModel";
import AddExamModel from "../Components/course/AddExamModel";
import {getCurrentUser, normalizeContent, buildTree, formatDate, getCourseFromCatalog} from "../Components/course/course";


const API_BASE = "https://swe-78u0.onrender.com/api";


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

  // تحميل بيانات المادة

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

  // شجرة المحتوى

  const contentTree = useMemo(
    () => buildTree(content),
    [content]
  );

  const allLectures = useMemo(() => {
    return content.filter(
      (item) => item.type === "lecture"
    );
  }, [content]);

  // التقدم

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

  // فتح وإغلاق الفصل
  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // تغيير حالة المحاضرة
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

  // إضافة محتوى

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

  // الاختبارات
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

  // نسبة إنجاز الاختبار

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

  // عرض المحاضرة
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

  // Loading
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

  // المادة غير موجودة
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

  // Main
  return (
    <div dir="rtl" className=" min-h-screen bg-[#faf7f2] px-4 py-8 text-right md:px-8">
      <div className="font-custom mx-auto max-w-6xl">

        {/* Header */}
        <CourseHeader
          course={course}
          progress={progress}
          completedCount={completedCount}
          allLectures={allLectures}
          setShowExamModal={setShowExamModal}
        />
        
        {/* ================================================= */}
        {/* Error */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        <Content
          contentTree={contentTree}
          completedItems={completedItems}
          expandedChapters={expandedChapters}
          toggleChapter={toggleChapter}
          openAddContent={openAddContent}
          renderLecture={renderLecture}
        />

        {/* Exams */}
        <Exams
          exams={exams}
          content={content}
          getExamProgress={getExamProgress}
          formatDate={formatDate}
          setShowExamModal={setShowExamModal}
        />
     
      </div>

      {/* Add Content Modal */}

      <AddContentModel
        showAddContent={showAddContent}
        setShowAddContent={setShowAddContent}
        newContent={newContent}
        setNewContent={setNewContent}
        content={content}
        addContent={addContent}
        savingContent={savingContent}
      />

      

      {/* Add Exam Modal */}
      <AddExamModel
        showExamModal={showExamModal}
        setShowExamModal={setShowExamModal}
        examForm={examForm}
        setExamForm={setExamForm}
        allLectures={allLectures}
        contentTree={contentTree}
        toggleExamPart={toggleExamPart}
        addExam={addExam}
        savingExam={savingExam}
      />
    </div>
  );
}


