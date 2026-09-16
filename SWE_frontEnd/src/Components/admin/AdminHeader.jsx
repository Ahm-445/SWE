import {
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export default function AdminHeader({
  currentUser,
  isLoading,
  onRefresh,
  onLogout,
}) {
  return (
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
                onClick={onRefresh}
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
                onClick={onLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>

            </div>
          </div>
        </header>
  );
}
