/* eslint-disable react-hooks/set-state-in-effect -- data loading effects intentionally update request state. */
/* eslint-disable react-hooks/exhaustive-deps -- fetches are deliberately scoped to selection and first mount. */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/admin/AdminHeader";
import AdminStats from "../Components/admin/AdminStats";
import AdminError from "../Components/admin/AdminError";
import AdminCourseManagement from "../Components/admin/AdminCourseManagement";
import AdminStudents from "../Components/admin/AdminStudents";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [allStudents, setAllStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  const [stats,setStats] = useState({
    students:0,
    pending:0,
    courses:0,
    exams:0
  });


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

  const currentUser = (() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

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

      const allResponse = await fetch(`${API_BASE}/students`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const allData = await allResponse.json();

      if (allResponse.ok && Array.isArray(allData)) {
        setAllStudents(allData);
      }
    } catch (err) {
      console.error(err);

      if ( err.message.includes("Authentication") || err.message.includes("Invalid") || err.message.includes("Admin")
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
      setAllStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === studentId
            ? { ...student, state: "active" }
            : student
        )
      );

    } catch (err) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء قبول الطالب");
    } finally {
      setApprovingId(null);
    }
  };

  const COURSES = [ { id: "فيز ١٠٣", name: "فيزياء عامة (١)" }, { id: "ريض ١٠٦", name: "حساب التكامل" }, { id: "عال ١١١", name: "برمجة حاسبات (١)" }, { id: "ريض ١٥١", name: "الرياضيات المحددة" }, { id: "فيز ١٠٤", name: "فيزياء عامة (٢)" }, { id: "عال ١١٣", name: "برمجة حاسبات (٢)" }, { id: "هاب ٢١١", name: "مدخل إلى هندسة البرمجيات" }, { id: "ريض ٢٤٤", name: "الجبر الخطي" }, { id: "هال ٣٠٣", name: "اتصالات وشبكات الحاسب" }, { id: "عال ٢١٢", name: "تراكيب البيانات" }, { id: "عال ٢٢٠", name: "تنظيم الحاسبات" }, { id: "هاب ٣١٢", name: "هندسة متطلبات البرمجيات" }, { id: "هاب ٣١٤", name: "هندسة أمن البرمجيات" }, { id: "عال ٢٢٧", name: "نظم التشغيل" }, { id: "نال ٢٣٠", name: "أسس قواعد البيانات" }, { id: "هاب ٣٢١", name: "تصميم وعمارة البرمجيات" }, { id: "هاب ٣٣٣", name: "ضمان جودة البرمجيات" }, { id: "هاب ٣٨١", name: "تطوير تطبيقات الشبكة العنكبوتية" }, { id: "سلم ١٠٧", name: "أخلاقيات المهنة" }, { id: "هاب ٤٣٤", name: "الاختبار والتحقق من البرمجيات" }, { id: "هاب ٤٨٢", name: "التفاعلية بين الإنسان والحاسب" }, { id: "هاب ٤٤٤", name: "معمل بناء البرمجيات" }, { id: "هاب ٤٧٧", name: "الأخلاقيات والممارسة المهنية في هندسة البرمجيات" }, { id: "هاب ٤٧٩", name: "التدريب الميداني" }, { id: "هاب ٤٩٦", name: "مشروع تخرج (١)" }, { id: "سلم ١٠٨", name: "قضايا معاصرة" }, { id: "هاب ٤٥٥", name: "صيانة وتطوير البرمجيات" }, { id: "هاب ٤٦٦", name: "إدارة مشاريع البرمجيات" }, { id: "هاب ٤٩٧", name: "مشروع تخرج (٢)" }, { id: "سلم ١٠٠", name: "دراسات في السيرة النبوية" }, { id: "قرأ ١٠٠", name: "القرآن الكريم" }, { id: "سلم ١٠٢", name: "الأسرة في الإسلام" }, { id: "سلم ١٠٣", name: "النظام الإقتصادي الإسلامي" }, { id: "سلم ١٠٥", name: "حقوق الإنسان" }, { id: "سلم ١٠٦", name: "الفقه الطبي" }, { id: "بحث ١٢٢", name: "مقدمة في بحوث العمليات" }, { id: "ريض ٢٠٣", name: "حساب التفاضل والتكامل" }, { id: "ريض ٢٥٤", name: "الطرائق العددية" }, { id: "كيح ١٠١", name: "كيمياء حيوية عامة" }, { id: "حدق ١٤٠", name: "علم الأحياء الدقيقة" }, { id: "حين ١٤٥", name: "علم الأحياء" }, { id: "جاف ٢٠١", name: "أسس الجيوفيزياء" }, { id: "فيز ٢٠١", name: "فيزياء رياضية (١)" }, { id: "عال ٢١٥", name: 'البرمجة الإجرائية بلغة "C"' }, { id: "عال ٣١١", name: "تصميم وتحليل الخوارزميات" }, { id: "هال ٣١٦", name: "عمارة الحاسبات ولغات التجميع" }, { id: "هال ٣١٨", name: "النظم المضمنة" }, { id: "عال ٣٦١", name: "الذكاء الاصطناعي" }, { id: "نال ٣٨٥", name: "نظم تخطيط موارد المؤسسات" }, { id: "هال ٤٤٥", name: "بروتوكولات وخوارزميات الشبكات" }, { id: "هاب ٤٨١", name: "هندسة تطبيقات الشبكة العنكبوتية المتطورة" }, { id: "هاب ٤٨٣", name: "تطوير تطبيقات الجوال" }, { id: "هاب ٤٨٥", name: "موضوعات مختارة في هندسة البرمجيات" }, { id: "نال ٤٨٥", name: "معمل نظم تخطيط موارد المؤسسات" }, { id: "هاب ٤٨٦", name: "الحوسبة السحابية والبيانات الضخمة" }, { id: "هاب ٤٨٨", name: "هندسة النظم المعقدة" },];

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

  const fetchStats = async()=>{
    try{
      const response = await fetch(
        `${API_BASE}/stats`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      const data = await response.json();

      if(response.ok){
        setStats(data);
      }
    }catch(error){
      console.log(error);
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

  const handleDeleteContent = async(id)=>{
    if(!window.confirm("هل تريد حذف هذا المحتوى؟")) return;

    const response = await fetch(
      `https://swe-78u0.onrender.com/api/courses/${encodeURIComponent(selectedCourse)}/admin/content/${id}`,
      {
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if(!response.ok){
      alert(data.error || "Failed");
      return;
    }

    fetchCourseData(selectedCourse);
  };

  const handleDeleteExam = async(id)=>{
    if(!window.confirm("هل تريد حذف هذا الاختبار؟")) return;

    const response = await fetch(
      `https://swe-78u0.onrender.com/api/courses/${encodeURIComponent(selectedCourse)}/admin/exams/${id}`,
      {
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if(!response.ok){
      alert(data.error || "Failed");
      return;
    }
    fetchCourseData(selectedCourse);
};

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/student", { replace: true });
  };

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">

        <AdminHeader currentUser={currentUser} isLoading={isLoading} onRefresh={fetchStudents} onLogout={handleLogout}
        />

        <AdminStats stats={stats}        />

        <AdminError error={error} />

        <AdminCourseManagement selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} courses={COURSES} courseError={courseError} courseLoading={courseLoading} contentForm={contentForm} setContentForm={setContentForm} savingContent={savingContent}
          onContentSubmit={handleContentSubmit}
          examForm={examForm}
          setExamForm={setExamForm}
          savingExam={savingExam}
          onExamSubmit={handleExamSubmit}
          defaultChapters={defaultChapters}
          defaultLectures={defaultLectures}
          toggleExamContent={toggleExamContent}
          chapters={chapters}
          courseExams={courseExams}
          onDeleteContent={handleDeleteContent}
          onDeleteExam={handleDeleteExam}
        />

        <AdminStudents isLoading={isLoading} students={allStudents} approvingId={approvingId} onApprove={handleApprove}
        />
      </div>
    </div>
  );
}
