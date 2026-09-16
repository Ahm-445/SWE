import { useEffect, useState } from "react";
import {
  Check,
  Clock,
  GraduationCap,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Users,
  XCircle,
  BookOpen,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [allStudentsCount, setAllStudentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [chapters, setChapters] = useState([]);
  const [courseExams, setCourseExams] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [contentForm, setContentForm] = useState({
    type: "chapter",
    title: "",
    description: "",
    parent_id: "",
    order_index: 0,
  });
  const [examForm, setExamForm] = useState({
    name: "",
    exam_date: "",
    content_ids: [],
  });
  const [savingContent, setSavingContent] = useState(false);
  const [savingExam, setSavingExam] = useState(false);

  const API_BASE = "https://swe-78u0.onrender.com/api/admin";

  // Get token and user information
  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    currentUser = null;
  }

  // Fetch pending students
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!token) {
        navigate("/student", { replace: true });
        return;
      }

      const response = await fetch(
        `${API_BASE}/students/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "فشل في جلب الطلاب"
        );
      }

      setStudents(data);

      const allResponse = await fetch(`${API_BASE}/students`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const allData = await allResponse.json();

      if (allResponse.ok && Array.isArray(allData)) {
        setAllStudentsCount(allData.length);
      }
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Authentication") ||
        err.message.includes("Invalid") ||
        err.message.includes("Admin")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/student", { replace: true });
        return;
      }

      setError(err.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  // Approve student
  const handleApprove = async (studentId) => {
    try {
      setApprovingId(studentId);
      setError("");

      const response = await fetch(
        `${API_BASE}/students/${studentId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "فشل في قبول الطالب"
        );
      }

      // Remove approved student from pending list
      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) => student.id !== studentId
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء قبول الطالب");
    } finally {
      setApprovingId(null);
    }
  };

  const COURSES = [
    { id: "فيز ١٠٣", name: "فيزياء عامة (١)" },
    { id: "ريض ١٠٦", name: "حساب التكامل" },
    { id: "عال ١١١", name: "برمجة حاسبات (١)" },
    { id: "ريض ١٥١", name: "الرياضيات المحددة" },
    { id: "فيز ١٠٤", name: "فيزياء عامة (٢)" },
    { id: "عال ١١٣", name: "برمجة حاسبات (٢)" },
    { id: "هاب ٢١١", name: "مدخل إلى هندسة البرمجيات" },
    { id: "ريض ٢٤٤", name: "الجبر الخطي" },
    { id: "هال ٣٠٣", name: "اتصالات وشبكات الحاسب" },
    { id: "عال ٢١٢", name: "تراكيب البيانات" },
    { id: "عال ٢٢٠", name: "تنظيم الحاسبات" },
    { id: "هاب ٣١٢", name: "هندسة متطلبات البرمجيات" },
    { id: "هاب ٣١٤", name: "هندسة أمن البرمجيات" },
    { id: "عال ٢٢٧", name: "نظم التشغيل" },
    { id: "نال ٢٣٠", name: "أسس قواعد البيانات" },
    { id: "هاب ٣٢١", name: "تصميم وعمارة البرمجيات" },
    { id: "هاب ٣٣٣", name: "ضمان جودة البرمجيات" },
    { id: "هاب ٣٨١", name: "تطوير تطبيقات الشبكة العنكبوتية" },
    { id: "سلم ١٠٧", name: "أخلاقيات المهنة" },
    { id: "هاب ٤٣٤", name: "الاختبار والتحقق من البرمجيات" },
    { id: "هاب ٤٨٢", name: "التفاعلية بين الإنسان والحاسب" },
    { id: "هاب ٤٤٤", name: "معمل بناء البرمجيات" },
    { id: "هاب ٤٧٧", name: "الأخلاقيات والممارسة المهنية في هندسة البرمجيات" },
    { id: "هاب ٤٧٩", name: "التدريب الميداني" },
    { id: "هاب ٤٩٦", name: "مشروع تخرج (١)" },
    { id: "سلم ١٠٨", name: "قضايا معاصرة" },
    { id: "هاب ٤٥٥", name: "صيانة وتطوير البرمجيات" },
    { id: "هاب ٤٦٦", name: "إدارة مشاريع البرمجيات" },
    { id: "هاب ٤٩٧", name: "مشروع تخرج (٢)" },
    { id: "سلم ١٠٠", name: "دراسات في السيرة النبوية" },
    { id: "قرأ ١٠٠", name: "القرآن الكريم" },
    { id: "سلم ١٠٢", name: "الأسرة في الإسلام" },
    { id: "سلم ١٠٣", name: "النظام الإقتصادي الإسلامي" },
    { id: "سلم ١٠٥", name: "حقوق الإنسان" },
    { id: "سلم ١٠٦", name: "الفقه الطبي" },
    { id: "بحث ١٢٢", name: "مقدمة في بحوث العمليات" },
    { id: "ريض ٢٠٣", name: "حساب التفاضل والتكامل" },
    { id: "ريض ٢٥٤", name: "الطرائق العددية" },
    { id: "كيح ١٠١", name: "كيمياء حيوية عامة" },
    { id: "حدق ١٤٠", name: "علم الأحياء الدقيقة" },
    { id: "حين ١٤٥", name: "علم الأحياء" },
    { id: "جاف ٢٠١", name: "أسس الجيوفيزياء" },
    { id: "فيز ٢٠١", name: "فيزياء رياضية (١)" },
    { id: "عال ٢١٥", name: 'البرمجة الإجرائية بلغة "C"' },
    { id: "عال ٣١١", name: "تصميم وتحليل الخوارزميات" },
    { id: "هال ٣١٦", name: "عمارة الحاسبات ولغات التجميع" },
    { id: "هال ٣١٨", name: "النظم المضمنة" },
    { id: "عال ٣٦١", name: "الذكاء الاصطناعي" },
    { id: "نال ٣٨٥", name: "نظم تخطيط موارد المؤسسات" },
    { id: "هال ٤٤٥", name: "بروتوكولات وخوارزميات الشبكات" },
    { id: "هاب ٤٨١", name: "هندسة تطبيقات الشبكة العنكبوتية المتطورة" },
    { id: "هاب ٤٨٣", name: "تطوير تطبيقات الجوال" },
    { id: "هاب ٤٨٥", name: "موضوعات مختارة في هندسة البرمجيات" },
    { id: "نال ٤٨٥", name: "معمل نظم تخطيط موارد المؤسسات" },
    { id: "هاب ٤٨٦", name: "الحوسبة السحابية والبيانات الضخمة" },
    { id: "هاب ٤٨٨", name: "هندسة النظم المعقدة" },
  ];

  const fetchCourseData = async (courseId) => {
    if (!courseId) {
      setChapters([]);
      setCourseExams([]);
      return;
    }

    try {
      setCourseLoading(true);
      setCourseError("");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [contentResponse, examsResponse] = await Promise.all([
        fetch(
          `https://swe-78u0.onrender.com/api/courses/${encodeURIComponent(courseId)}/content`,
          { headers }
        ),
        fetch(
          `https://swe-78u0.onrender.com/api/courses/${encodeURIComponent(courseId)}/exams`,
          { headers }
        ),
      ]);

      const contentData = await contentResponse.json();
      const examsData = await examsResponse.json();

      if (!contentResponse.ok) {
        throw new Error(contentData.error || "فشل في تحميل محتوى المادة");
      }

      if (!examsResponse.ok) {
        throw new Error(examsData.error || "فشل في تحميل اختبارات المادة");
      }

      setChapters(contentData.defaultContent || []);
      setCourseExams(examsData.defaultExams || []);
    } catch (err) {
      console.error(err);
      setCourseError(err.message || "حدث خطأ أثناء تحميل المادة");
    } finally {
      setCourseLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData(selectedCourse);
  }, [selectedCourse]);

  const handleContentSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCourse || !contentForm.title.trim()) return;

    try {
      setSavingContent(true);
      setCourseError("");

      const response = await fetch(
        `https://swe-78u0.onrender.com/api/courses/${encodeURIComponent(selectedCourse)}/admin/content`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: contentForm.type,
            title: contentForm.title.trim(),
            description: contentForm.description.trim() || null,
            parent_id:
              contentForm.type === "lecture"
                ? Number(contentForm.parent_id)
                : null,
            order_index: Number(contentForm.order_index) || 0,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل في إضافة المحتوى");
      }

      setContentForm({
        type: "chapter",
        title: "",
        description: "",
        parent_id: "",
        order_index: 0,
      });

      await fetchCourseData(selectedCourse);
    } catch (err) {
      console.error(err);
      setCourseError(err.message || "حدث خطأ أثناء إضافة المحتوى");
    } finally {
      setSavingContent(false);
    }
  };

  const handleExamSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCourse || !examForm.name.trim() || !examForm.exam_date) {
      return;
    }

    try {
      setSavingExam(true);
      setCourseError("");

      const response = await fetch(
        `https://swe-78u0.onrender.com/api/courses/${encodeURIComponent(selectedCourse)}/admin/exams`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: examForm.name.trim(),
            exam_date: examForm.exam_date,
            content_ids: examForm.content_ids.map(Number),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل في إضافة الاختبار");
      }

      setExamForm({
        name: "",
        exam_date: "",
        content_ids: [],
      });

      await fetchCourseData(selectedCourse);
    } catch (err) {
      console.error(err);
      setCourseError(err.message || "حدث خطأ أثناء إضافة الاختبار");
    } finally {
      setSavingExam(false);
    }
  };

  const toggleExamContent = (id) => {
    setExamForm((current) => ({
      ...current,
      content_ids: current.content_ids.includes(id)
        ? current.content_ids.filter((item) => item !== id)
        : [...current.content_ids, id],
    }));
  };

  const defaultChapters = chapters.filter((item) => item.type === "chapter");
  const defaultLectures = chapters.filter((item) => item.type === "lecture");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/student", { replace: true });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm p-5 md:p-7 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-amber-600" />
              </div>

              <div>
                <p className="text-sm font-bold text-amber-800/60 mb-1">
                  مجتمع هندسة البرمجيات — KSU
                </p>

                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                  لوحة تحكم الأدمن
                </h1>

                {currentUser?.name && (
                  <p className="text-sm text-gray-500 mt-1">
                    مرحبًا، {currentUser.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">

              <button
                onClick={fetchStudents}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />

                تحديث
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>

            </div>
          </div>
        </header>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Pending */}
          <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 font-bold">
                  طلبات الانتظار
                </p>

                <p className="text-3xl font-extrabold text-gray-800 mt-2">
                  {students.length}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>

            </div>
          </div>

          {/* Students */}
          <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 font-bold">
                  الطلاب
                </p>

                <p className="text-3xl font-extrabold text-gray-800 mt-2">
                  {allStudentsCount}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>

            </div>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 font-bold">
                  صلاحية الحساب
                </p>

                <p className="text-lg font-extrabold text-green-600 mt-2">
                  Admin
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>

            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <XCircle className="w-5 h-5 shrink-0" />

            <p className="font-bold text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Course Management */}
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
                {COURSES.map((course) => (
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
                    onSubmit={handleContentSubmit}
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
                    onSubmit={handleExamSubmit}
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

        {/* Students Section */}
        <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm overflow-hidden">

          {/* Section Header */}
          <div className="p-5 md:p-6 border-b border-[#e6dfd5]">
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-amber-600" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-gray-800">
                  طلبات تسجيل الطلاب
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  الطلاب الذين ينتظرون موافقة الأدمن
                </p>
              </div>

            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center">

              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-4" />

              <p className="text-gray-500 font-bold">
                جاري تحميل الطلبات...
              </p>

            </div>
          ) : students.length === 0 ? (

            /* Empty */
            <div className="p-12 flex flex-col items-center justify-center text-center">

              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-lg font-extrabold text-gray-800">
                لا توجد طلبات معلقة
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                جميع طلبات الطلاب تمت معالجتها.
              </p>

            </div>
          ) : (

            /* Students Table */
            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px]">

                <thead className="bg-[#fbf8f3]">
                  <tr>

                    <th className="text-right px-6 py-4 text-sm font-extrabold text-gray-600">
                      الطالب
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-extrabold text-gray-600">
                      البريد الإلكتروني
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-extrabold text-gray-600">
                      المستوى
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-extrabold text-gray-600">
                      الحالة
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-extrabold text-gray-600">
                      الإجراء
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {students.map((student) => (

                    <tr
                      key={student.id}
                      className="border-t border-[#eee7de] hover:bg-[#fffdf9] transition"
                    >

                      {/* Student */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-gray-600" />
                          </div>

                          <div>
                            <p className="font-extrabold text-gray-800">
                              {student.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              ID: {student.id}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-6 py-5">
                        <span className="text-sm text-gray-600">
                          {student.email}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="px-6 py-5">

                        <span className="inline-flex px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">
                          {student.term_level}
                        </span>

                      </td>

                      {/* State */}
                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          بانتظار الموافقة
                        </span>

                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-center">

                        <button
                          onClick={() =>
                            handleApprove(student.id)
                          }
                          disabled={approvingId === student.id}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                          {approvingId === student.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              جاري القبول...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              قبول الطالب
                            </>
                          )}

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
