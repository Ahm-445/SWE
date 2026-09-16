import { useState } from "react";
import { ArrowRight, Loader2, X } from "lucide-react";

const AVAILABLE_TAGS = [
  {
    category: "الدرجات والاختبارات",
    items: [
      "اختبارات سهلة", "يعطي بونس", "تكاليف قليلة ومفيدة",
      "يده خفيفة بالتصحيح", "يعطيك حقك", "تصحيح دقيق بزيادة",
      "تكاليف صعبة", "أسئلة بين السطور"
    ]
  },
  {
    category: "الشرح والمحاضرة",
    items: [
      "أكثر كلاس ممتع", "شرح بالأمثلة", "يبسط لك المادة",
      "محاضرة ممتعة", "منظم في شرحه", "يحتاج مصدر ثاني",
      "شرح غير واضح", "يقرأ السلايدات"
    ]
  },
  {
    category: "الحضور والتعامل",
    items: [
      "يتغاضى عن التأخير", "يخلص بدري دائماً", "مرن في التعامل",
      "أخلاقه عالية", "سهل التواصل", "شديد بالتحضير",
      "صعب بالتواصل"
    ]
  }
];

const GRADES = ["أ+", "أ", "ب+", "ب", "ج+", "ج", "د+", "د", "هـ", "حذفت المادة"];
const API_BASE = "https://swe-78u0.onrender.com/api/evaluations";

export default function ReviewWizardModal({
  target,
  targetName,
  tab,
  onClose,
  onSuccess,
}) {
  const [step, setStep] = useState(1);
  const [ratings, setRatings] = useState({
    explanation: 3,
    dealing: 3,
    grading: 3,
    attendance: 3,
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [grade, setGrade] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: target?.id,
          targetName: target?.name || targetName,
          type: tab,
          ratings,
          tags: selectedTags,
          comment,
          subjectName,
          grade,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.targetId);
      }
    } catch {
      alert("حدث خطأ أثناء حفظ التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#fbf8f3]">
          <div>
            <h3 className="font-extrabold text-gray-800 text-base">
              إضافة تقييم لـ {target?.name || targetName}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">خطوة {step} من 3</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full bg-gray-100 h-1">
          <div
            className="bg-amber-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-right">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                حدد تقييمك لكل معيار من 1 (ضعيف) إلى 5 (ممتاز):
              </p>

              {[
                { key: "explanation", label: "الشرح وتوصيل المعلومة" },
                { key: "dealing", label: "التعامل والأخلاق" },
                { key: "grading", label: "الدرجات والتصحيح" },
                { key: "attendance", label: "التحضير والالتزام بالوقت" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="bg-[#faf5ef] p-3.5 rounded-2xl border border-[#e6dfd5]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-xs font-black text-amber-800">
                      {ratings[item.key]} / 5
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          setRatings({ ...ratings, [item.key]: val })
                        }
                        className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                          ratings[item.key] === val
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-amber-50"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  اختر حتى 5 وسوم تلخص تجربتك:
                </p>
                <span className="text-xs font-bold text-amber-800">
                  {selectedTags.length} / 5
                </span>
              </div>

              {AVAILABLE_TAGS.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-xs font-extrabold text-gray-700">
                    {cat.category}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((t) => {
                      const isSelected = selectedTags.includes(t);

                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTag(t)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                            isSelected
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-[#fbf8f3] text-gray-700 border-[#e6dfd5] hover:border-amber-400"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  التعليق والتجربة (اختياري)
                </label>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="اكتب تفاصيل تجربتك ونصيحتك للطلاب..."
                  className="w-full p-3 text-sm rounded-2xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-[#fdfaf7]"
                />

                <span className="text-[10px] text-gray-400 block text-left">
                  {comment.length} / 500
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    المادة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="مثال: SWE 312"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-[#fdfaf7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    القريد المحصل (اختياري)
                  </label>

                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-[#fdfaf7]"
                  >
                    <option value="">اختر القريد</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-[#fbf8f3]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl"
            >
              السابق
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              التالي <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "إرسال التقييم"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
