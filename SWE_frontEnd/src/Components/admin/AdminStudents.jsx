import { Check, Clock, GraduationCap, RefreshCw, Search, Filter } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminStudents({ isLoading, students, approvingId, onApprove }) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const levels = [...new Set(students.map((student) => student.term_level))];

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const value = search.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(value) ||
        student.email.toLowerCase().includes(value);

      const matchesLevel =
        levelFilter === "all" ||
        student.term_level === levelFilter;

      return matchesSearch && matchesLevel;
    });
  }, [students, search, levelFilter]);

  return (
    <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm overflow-hidden">

      <div className="p-5 md:p-6 border-b border-[#e6dfd5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-amber-600" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-800">
              إدارة الطلاب
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              البحث وإدارة حالات الطلاب
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="relative">
            <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم الطالب أو البريد"
              className="w-full rounded-xl border border-[#e6dfd5] bg-[#fffdf9] py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div className="relative">
            <Filter className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd5] bg-[#fffdf9] py-3 pr-12 pl-4 outline-none"
            >
              <option value="all">كل المستويات</option>

              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {isLoading ? (
        <div className="p-12 flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">
            جاري تحميل الطلاب...
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 font-bold">
            لا يوجد طلاب مطابقين
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-[#fbf8f3]">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-extrabول text-gray-600">
                  الطالب
                </th>

                <th className="px-6 py-4 text-right text-sm font-extrabold text-gray-600">
                  البريد
                </th>

                <th className="px-6 py-4 text-right text-sm font-extrabold text-gray-600">
                  المستوى
                </th>

                <th className="px-6 py-4 text-right text-sm font-extrabold text-gray-600">
                  الحالة
                </th>

                <th className="px-6 py-4 text-center text-sm font-extrabول text-gray-600">
                  الإجراء
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t border-[#eee7de] hover:bg-[#fffdf9] transition">

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-gray-600" />
                      </div>

                      <div>
                        <p className="font-extrabول text-gray-800">
                          {student.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          ID: {student.id}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {student.email}
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">
                      {student.term_level}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {student.state === "active" ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-bold">
                        <Check size={14} />
                        مقبول
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
                        <Clock size={14} />
                        انتظار
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-center">
                    {student.state === "pending" && (
                      <button
                        onClick={() => onApprove(student.id)}
                        disabled={approvingId === student.id}
                        className="px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {approvingId === student.id ? "جاري القبول..." : "قبول الطالب"}
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}