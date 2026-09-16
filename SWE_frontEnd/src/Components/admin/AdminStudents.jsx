import {
  Check,
  Clock,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

export default function AdminStudents({
  isLoading,
  students,
  approvingId,
  onApprove,
}) {
  return (
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
                            onApprove(student.id)
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

  );
}
