import React, { useState, useEffect, useRef } from "react";

import { 
  Search, Star, User, BookOpen, MessageSquare, AlertCircle, 
  Loader2, Plus, X, ArrowRight, Eye, Users, CheckCircle2, ThumbsUp 
} from "lucide-react";

// خيارات الوسوم الجاهزة حسب الفئات
const AVAILABLE_TAGS = [
  { category: "الدرجات والاختبارات", items: ["اختبارات سهلة", "يعطي بونس", "تكاليف قليلة ومفيدة", "يده خفيفة بالتصحيح", "يعطيك حقك", "تصحيح دقيق بزيادة", "تكاليف صعبة", "أسئلة بين السطور"] },
  { category: "الشرح والمحاضرة", items: ["أكثر كلاس ممتع", "شرح بالأمثلة", "يبسط لك المادة", "محاضرة ممتعة", "منظم في شرحه", "يحتاج مصدر ثاني", "شرح غير واضح", "يقرأ السلايدات"] },
  { category: "الحضور والتعامل", items: ["يتغاضى عن التأخير", "يخلص بدري دائماً", "مرن في التعامل", "أخلاقه عالية", "سهل التواصل", "شديد بالتحضير", "صعب بالتواصل"] }
];

const GRADES = ["أ+", "أ", "ب+", "ب", "ج+", "ج", "د+", "د", "هـ", "حذفت المادة"];

const API_BASE = "https://swe-78u0.onrender.com/api/evaluations"; // ضع رابط الباك إند هنا

export default function Evaluation() {
  const [tab, setTab] = useState("doctor");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // حالة نافذة إضافة تقييم
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  // إغلاق الدروب داون عند النقر في الخارج
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // بحث لحظي مع كل حرف (Auto-complete)
  useEffect(() => {
  // منع إرسال الطلب نهائياً إذا كان الإدخال فارغاً أو أقل من حرفين
  if (!query || query.trim().length < 2) {
    setSuggestions([]);
    setShowDropdown(false);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}&type=${tab}`);
      
      if (!res.ok) {
        setSuggestions([]);
        return;
      }
      
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setShowDropdown(true);
    } catch (err) {
      console.error("فشل جلب الاقتراحات:", err);
      setSuggestions([]);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [query, tab]);


  // جلب التفاصيل والإحصائيات
  const loadTargetDetails = async (targetId) => {
    setLoading(true);
    setError(null);
    setShowDropdown(false);

    try {
      const res = await fetch(`${API_BASE}/target/${targetId}`);
      if (!res.ok) throw new Error("تعذر جلب التقييمات");
      const data = await res.json();
      setDetails(data);
      setSelectedTarget(data.target);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8 pb-48">      
    <div className="max-w-4xl mx-auto">
        
        {/* الترويسة */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-amber-800/60 mb-2">مجتمع هندسة البرمجيات — KSU</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            تقييمات المحاضرين والمقررات
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            شارك تجربتك بحرية وشفافية وساعد زملاءك في التخطيط لفصولهم الدراسية.
          </p>
        </div>

        {/* صندوق البحث */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6dfd5] p-5 md:p-7 mb-8">
          <div className="flex bg-[#fbf8f3] p-1.5 rounded-2xl border border-[#e6dfd5] max-w-sm mx-auto mb-6">
            <button
              onClick={() => { setTab("doctor"); setQuery(""); setDetails(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === "doctor" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <User className="w-4 h-4" /> تقييم دكتور
            </button>
            <button
              onClick={() => { setTab("subject"); setQuery(""); setDetails(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === "subject" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <BookOpen className="w-4 h-4" /> تقييم مادة
            </button>
          </div>

          {/* حقل البحث مع القائمة المنسدلة */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tab === "doctor" ? "ابحث باسم الدكتور (مثال: محسن...)" : "ابحث برمز أو اسم المادة..."}
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* القائمة المنسدلة */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#e6dfd5] shadow-xl overflow-hidden z-50">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setQuery(item.name);
                      loadTargetDetails(item._id);
                    }}
                    className="p-3.5 hover:bg-amber-50/70 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-none transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#faf5ef] rounded-xl text-amber-800 border border-[#e6dfd5]">
                        {item.type === "doctor" ? <User className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.department}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* تحميل أو خطأ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="text-sm font-medium">جاري تحميل بيانات التقييم...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* نتائج التقييم */}
        {details && !loading && (
          <div className="space-y-6">
            
            {/* بطاقة الرأس والإحصائيات */}
            <div className="bg-white rounded-3xl border border-[#e6dfd5] p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="text-center sm:text-right">
                  <h2 className="text-2xl font-black text-gray-800">{details.target.name}</h2>
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 mt-2">
                    {details.target.department}
                  </span>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      {details.stats.totalRatings} تقييم
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      {details.target.viewsCount} مشاهدة
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-3xl shadow-sm text-center min-w-[140px]">
                  <div className="flex items-center justify-center gap-1 text-amber-200 mb-1">
                    <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span className="text-xs font-bold">التقييم العام</span>
                  </div>
                  <div className="text-3xl font-extrabold">{details.stats.averages.final}%</div>
                </div>
              </div>

              {/* أشرطة المعايير الأربعة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <RatingBar label="الشرح" value={details.stats.averages.explanation} color="bg-emerald-500" />
                <RatingBar label="التعامل" value={details.stats.averages.dealing} color="bg-blue-500" />
                <RatingBar label="الدرجات والتصحيح" value={details.stats.averages.grading} color="bg-amber-500" />
                <RatingBar label="التحضير والالتزام" value={details.stats.averages.attendance} color="bg-purple-500" />
              </div>

              {/* أكثر الإشارات تكراراً */}
              {details.stats.topTags?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 mb-3">الإشارات الأكثر تكراراً:</p>
                  <div className="flex flex-wrap gap-2">
                    {details.stats.topTags.map((tag, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 bg-[#fbf8f3] border border-[#e6dfd5] text-gray-700 font-semibold rounded-xl">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* زر إضافة تقييم */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" /> إضافة تقييمك لـ {details.target.name}
              </button>
            </div>

            {/* قائمة تعليقات الطلاب */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" /> تجارب الطلاب ({details.reviews.length})
              </h3>

              {details.reviews.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border border-[#e6dfd5] text-gray-400">
                  كن أول من يضيف تقييماً وتجربة!
                </div>
              ) : (
                details.reviews.map((rev) => (
                  <div key={rev._id} className="bg-white rounded-2xl p-5 border border-[#e6dfd5] shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        {rev.subjectName && (
                          <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                            {rev.subjectName}
                          </span>
                        )}
                        {rev.grade && (
                          <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
                            القريد: {rev.grade}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString("ar-SA")}
                      </span>
                    </div>

                    {/* الوسوم */}
                    {rev.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {rev.tags.map((t, i) => (
                          <span key={i} className="text-[11px] bg-[#fbf8f3] text-gray-600 px-2 py-0.5 rounded-lg border border-[#e6dfd5]">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* نص التعليق */}
                    {rev.comment && (
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pt-1">
                        {rev.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>

      {/* نافذة التقييم متدرجة الخطوات (Wizard Modal) */}
      {isModalOpen && (
        <ReviewWizardModal
          target={selectedTarget}
          targetName={query}
          tab={tab}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(targetId) => {
            setIsModalOpen(false);
            loadTargetDetails(targetId);
          }}
        />
      )}

    </div>
  );
}

// نافذة التقييم متعددة الخطوات
function ReviewWizardModal({ target, targetName, tab, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [ratings, setRatings] = useState({ explanation: 3, dealing: 3, grading: 3, attendance: 3 });
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [grade, setGrade] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: target?._id,
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
    } catch (err) {
      alert("حدث خطأ أثناء حفظ التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#e6dfd5] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* شريط رأس النافذة */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#fbf8f3]">
          <div>
            <h3 className="font-extrabold text-gray-800 text-base">إضافة تقييم لـ {target?.name || targetName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">خطوة {step} من 3</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* مؤشر الخطوات */}
        <div className="w-full bg-gray-100 h-1">
          <div
            className="bg-amber-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* محتوى الخطوات */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-right">
          
          {/* الخطوة 1: تقييم المعايير بالدرجات */}
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
                <div key={item.key} className="bg-[#faf5ef] p-3.5 rounded-2xl border border-[#e6dfd5]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                    <span className="text-xs font-black text-amber-800">{ratings[item.key]} / 5</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRatings({ ...ratings, [item.key]: val })}
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

          {/* الخطوة 2: اختيار الوسوم */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">اختر حتى 5 وسوم تلخص تجربتك:</p>
                <span className="text-xs font-bold text-amber-800">{selectedTags.length} / 5</span>
              </div>

              {AVAILABLE_TAGS.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-xs font-extrabold text-gray-700">{cat.category}</p>
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

          {/* الخطوة 3: تفاصيل اختيارية والتعليق */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">التعليق والتجربة (اختياري)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="اكتب تفاصيل تجربتك ونصيحتك للطلاب..."
                  className="w-full p-3 text-sm rounded-2xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-[#fdfaf7]"
                ></textarea>
                <span className="text-[10px] text-gray-400 block text-left">{comment.length} / 500</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">المادة (اختياري)</label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="مثال: SWE 312"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-[#fdfaf7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">القريد المحصل (اختياري)</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-[#fdfaf7]"
                  >
                    <option value="">اختر القريد</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* أزرار التنقل بين الخطوات */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-[#fbf8f3]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl"
            >
              السابق
            </button>
          ) : (
            <div></div>
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
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "إرسال التقييم"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

function RatingBar({ label, value, color }) {
  const percent = value ? Math.min(Math.max(Number(value), 0), 100).toFixed(1) : "0.0";
  return (
    <div className="bg-[#fcfaf7] p-3.5 rounded-2xl border border-[#e6dfd5]">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-gray-700">{label}</span>
        <span className="text-xs font-black text-gray-900">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200/70 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}