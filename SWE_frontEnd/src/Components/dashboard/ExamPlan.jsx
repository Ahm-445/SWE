import { Target } from "lucide-react";

export default function ExamPlan() {
  return (
    <div className="bg-white rounded-[2rem] border border-[#e6dfd5] shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Target className="w-5 h-5 text-orange-600" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-gray-800">خطط الاختبارات</h2>
          <p className="text-sm text-gray-400 mt-1">
            تابع استعدادك للميد والفاينل
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#fbf8f3] border border-[#e6dfd5] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-extrabold text-gray-800">
              لا توجد خطط اختبارات بعد
            </p>
            <p className="text-xs text-gray-400 mt-1">
              أضف اختبارًا وحدد الأجزاء التي تريد مذاكرتها.
            </p>
          </div>

          <button className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition">
            + إضافة اختبار
          </button>
        </div>
      </div>
    </div>
  );
}
