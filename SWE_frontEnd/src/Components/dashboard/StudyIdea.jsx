import { CheckCircle2, Trophy } from "lucide-react";

export default function StudyIdea() {
  return (
    <div className="bg-gray-900 rounded-[2rem] shadow-sm p-6 text-white relative overflow-hidden">
      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-amber-500/20 blur-2xl" />

      <div className="relative">
        <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
        </div>

        <h2 className="text-xl font-extrabold">خطوتك القادمة 🎯</h2>

        <p className="text-sm text-gray-300 mt-2 leading-6">
          قريبًا تقدر تقسم كل مادة إلى Chapters ومحاضرات
          وتحدد الأجزاء الداخلة في كل اختبار، ونحسب لك نسبة
          الإنجاز تلقائيًا.
        </p>

        <div className="flex items-center gap-2 mt-5 text-xs text-gray-400">
          <Trophy className="w-4 h-4 text-amber-400" />
          كل إنجاز يقربك من هدفك.
        </div>
      </div>
    </div>
  );
}
