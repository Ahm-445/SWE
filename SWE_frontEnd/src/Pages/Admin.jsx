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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  const API_BASE = "http://localhost:8000/api/admin";

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
                  {students.length}
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
