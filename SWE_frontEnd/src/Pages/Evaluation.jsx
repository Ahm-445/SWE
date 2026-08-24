import React, { useState, useEffect, useRef } from "react";
import { Search, Star, User, BookOpen, Users, Eye, Loader2, AlertCircle } from "lucide-react";

export default function Evaluation() {
  const [tab, setTab] = useState("doctor");
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    const endpoint =
      tab === "doctor"
        ? `https://api.unimake.xyz/api/swe/ratings/doctor?q=${encodeURIComponent(query.trim())}`
        : `https://api.unimake.xyz/api/swe/ratings/subject?q=${encodeURIComponent(query.trim())}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("تعذر جلب البيانات");
      const result = await res.json();
      
      // إذا كانت النتيجة مصفوفة، نأخذ أول عنصر أو الكائن نفسه
      setData(Array.isArray(result) ? result[0] : result);
    } catch (err) {
      setError("لم يتم العثور على تقييمات مطابقة للبحث.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8 pb-28 relative">
      <div className="max-w-3xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-amber-800/60 mb-2">مجتمع هندسة البرمجيات — KSU</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            تقييمات المحاضرين والمقررات
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            ابحث عن تقييمات الدكاترة والمواد بناءً على تجارب الطلاب وإحصائيات التقييم.
          </p>
        </div>

        {/* صندوق البحث */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6dfd5] p-5 md:p-7 mb-8">
          {/* التبديل بين دكتور ومادة */}
          <div className="flex bg-[#fbf8f3] p-1.5 rounded-2xl border border-[#e6dfd5] max-w-sm mx-auto mb-6">
            <button
              onClick={() => { setTab("doctor"); setData(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === "doctor" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <User className="w-4 h-4" /> تقييم دكتور
            </button>
            <button
              onClick={() => { setTab("subject"); setData(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === "subject" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <BookOpen className="w-4 h-4" /> تقييم مادة
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tab === "doctor" ? "أدخل اسم الدكتور..." : "أدخل رمز المادة (مثال: SWE 312)..."}
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold px-7 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "بحث"}
            </button>
          </form>
        </div>

        {/* حالة الخطأ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* عرض بطاقة النتائج التفصيلية */}
        {data && !loading && (
          <div className="bg-white rounded-3xl border border-[#e6dfd5] p-6 md:p-8 shadow-sm space-y-6">
            
            {/* بطاقة الرأس والتقييم الكلي */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
              <div className="text-center sm:text-right">
                <h2 className="text-2xl font-black text-gray-800">{data.name}</h2>
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 mt-2">
                  {data.college || "كلية علوم الحاسب والمعلومات"}
                </span>
                
                {/* إحصائيات المقيمين والمشاهدات */}
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    {data.ratings_count || 0} تقييم
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    {data.views_count || 0} مشاهدة
                  </span>
                </div>
              </div>

              {/* النسبة العامة */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-3xl shadow-sm text-center min-w-[140px]">
                <div className="flex items-center justify-center gap-1 text-amber-200 mb-1">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span className="text-xs font-bold">التقييم العام</span>
                </div>
                <div className="text-3xl font-extrabold">
                  {data.avg_final ? `${Number(data.avg_final).toFixed(1)}%` : "--"}
                </div>
              </div>
            </div>

            {/* تفصيل المعايير الأربعة مع أشرطة التقدم */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RatingBar label="الشرح" value={data.avg_1} color="bg-blue-500" />
              <RatingBar label="التعامل" value={data.avg_2} color="bg-emerald-500" />
              <RatingBar label="الدرجات والتصحيح" value={data.avg_3} color="bg-amber-500" />
              <RatingBar label="التحضير والالتزام" value={data.avg_4} color="bg-purple-500" />
            </div>

            {/* التعليقات (إن وجدت داخل كائن التعليقات) */}
            {data.comments && data.comments.length > 0 && (
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-800 text-sm">تجارب الطلاب:</h3>
                {data.comments.map((c, i) => (
                  <div key={i} className="p-4 bg-[#fbf8f3] rounded-2xl border border-[#e6dfd5] text-sm text-gray-700">
                    {c.text || c.comment || c}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#e6dfd5] z-10"></footer>
    </div>
  );
}

// مكون شريط التقدم لكل معيار
function RatingBar({ label, value, color }) {
  const percent = value ? Math.min(Math.max(Number(value), 0), 100).toFixed(1) : "0.0";

  return (
    <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#e6dfd5]/60">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-700">{label}</span>
        <span className="text-xs font-extrabold text-gray-900">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200/80 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}