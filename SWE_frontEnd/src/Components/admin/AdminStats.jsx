import {
  Clock,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function AdminStats({
  pendingCount,
  allStudentsCount,
}) {
  return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Pending */}
          <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 font-bold">
                  طلبات الانتظار
                </p>

                <p className="text-3xl font-extrabold text-gray-800 mt-2">
                  {pendingCount}
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
  );
}
