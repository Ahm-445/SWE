import React, { useState, useEffect, useRef } from "react";
import { Search, Star, User, BookOpen, MessageSquare, AlertCircle, Loader2, ChevronDown } from "lucide-react";

export default function Evaluation() {
  const [tab, setTab] = useState("doctor"); // "doctor" | "subject"
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // جلب الاقتراحات لحظياً مع كل حرف (مع Debounce)
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSuggesting(true);
      const endpoint =
        tab === "doctor"
          ? `https://api.unimake.xyz/api/swe/ratings/doctor?q=${encodeURIComponent(query.trim())}`
          : `https://api.unimake.xyz/api/swe/ratings/subject?q=${encodeURIComponent(query.trim())}`;

      try {
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          // استخراج الأسماء أو العناصر سواء كانت مصفوفة أو داخل كائن
          if (Array.isArray(data)) {
            setSuggestions(data);
          } else if (data.results || data.doctors || data.subjects || data.reviews) {
            setSuggestions(data.results || data.doctors || data.subjects || data.reviews);
          } else {
            setSuggestions(data ? [data] : []);
          }
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("خطأ في جلب الاقتراحات", err);
      } finally {
        setIsSuggesting(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, tab]);

  // عند اختيار عنصر من القائمة المنسدلة
  const handleSelect = (item) => {
    const name = item.name || item.doctorName || item.subjectCode || item.code || query;
    setQuery(name);
    setShowDropdown(false);
    fetchFullDetails(name, item);
  };

  const fetchFullDetails = async (searchTerm, itemData = null) => {
    setLoading(true);
    setError(null);
    setShowDropdown(false);

    const endpoint =
      tab === "doctor"
        ? `https://api.unimake.xyz/api/swe/ratings/doctor?q=${encodeURIComponent(searchTerm.trim())}`
        : `https://api.unimake.xyz/api/swe/ratings/subject?q=${encodeURIComponent(searchTerm.trim())}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("تعذر جلب البيانات");
      const data = await res.json();
      setResults(data);
      setSelectedItem(searchTerm);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل التقييمات.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchFullDetails(query);
    }
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setQuery("");
    setSuggestions([]);
    setResults(null);
    setError(null);
    setShowDropdown(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8 pb-28 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-amber-800/60 mb-2">مجتمع هندسة البرمجيات — KSU</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            تقييمات المحاضرين والمقررات
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            ابحث مباشرة عن أي دكتور أو مادة وتصفح تجارب وتقييمات الطلاب.
          </p>
        </div>

        {/* بطاقة البحث والتبديل */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6dfd5] p-5 md:p-7 mb-8">
          
          {/* أزرار التبديل */}
          <div className="flex bg-[#fbf8f3] p-1.5 rounded-2xl border border-[#e6dfd5] max-w-sm mx-auto mb-6">
            <button
              onClick={() => switchTab("doctor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === "doctor"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <User className="w-4 h-4" />
              تقييم دكتور
            </button>
            <button
              onClick={() => switchTab("subject")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === "subject"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              تقييم مادة
            </button>
          </div>

          {/* حقل البحث مع القائمة المنسدلة */}
          <form onSubmit={handleSearchSubmit} className="relative" ref={dropdownRef}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  placeholder={
                    tab === "doctor"
                      ? "ابدا بكتابة اسم الدكتور..."
                      : "ابدا بكتابة رمز المادة (مثل: SWE 312)..."
                  }
                  className="w-full px-4 py-3.5 pr-11 pl-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm"
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                
                {isSuggesting && (
                  <Loader2 className="w-4 h-4 text-amber-600 animate-spin absolute left-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold px-7 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "عرض النتائج"}
              </button>
            </div>

            {/* القائمة المنسدلة للنتائج الفورية */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#e6dfd5] shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                <div className="p-2 border-b border-gray-100 bg-[#fbf8f3] text-[11px] font-bold text-gray-400">
                  {tab === "doctor" ? "الدكاترة المطابقين:" : "المواد المطابقة:"}
                </div>
                {suggestions.map((item, idx) => {
                  const title = item.name || item.doctorName || item.subjectCode || item.courseName || (typeof item === "string" ? item : `نتيجة #${idx + 1}`);
                  const subtitle = item.department || item.faculty || item.code || item.description;
                  const rating = item.rating || item.averageRating || item.score;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelect(item)}
                      className="p-3.5 hover:bg-amber-50/60 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-none transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#faf5ef] rounded-xl text-amber-800 border border-[#e6dfd5]">
                          {tab === "doctor" ? <User className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{title}</p>
                          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                        </div>
                      </div>

                      {rating && (
                        <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg text-xs font-bold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{rating}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </form>
        </div>

        {/* تحميل أو رسالة خطأ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="text-sm font-medium">جاري جلب تفاصيل التقييمات...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* النتائج والتفاصيل */}
        {results && !loading && (
          <div className="space-y-4">
            {results.averageRating !== undefined && (
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{results.name || selectedItem || query}</h2>
                  <p className="text-xs text-white/80 mt-1">
                    إجمالي التقييمات: {results.totalRatings || (Array.isArray(results) ? results.length : results.reviews?.length || 0)}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
                  <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
                  <span className="text-2xl font-black">{results.averageRating}</span>
                  <span className="text-xs text-white/80">/ 5</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {Array.isArray(results) ? (
                results.map((item, idx) => <RatingCard key={idx} data={item} />)
              ) : results.reviews && results.reviews.length > 0 ? (
                results.reviews.map((rev, idx) => <RatingCard key={idx} data={rev} />)
              ) : !results.averageRating ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-[#e6dfd5] text-gray-500">
                  <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  لا توجد تفاصيل أو تقييمات مسجلة
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#e6dfd5] z-10"></footer>
    </div>
  );
}

function RatingCard({ data }) {
  const comment = data.comment || data.text || data.review || data.notes;
  const rating = data.rating || data.stars || data.score;
  const title = data.doctorName || data.subjectCode || data.courseName || data.semester;
  const date = data.date || data.createdAt;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e6dfd5] shadow-sm hover:border-amber-400 transition-all text-right">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {title && <span className="font-bold text-gray-800 text-sm">{title}</span>}
          {data.grade && (
            <span className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-200">
              القريد: {data.grade}
            </span>
          )}
        </div>

        {rating && (
          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {rating}
          </div>
        )}
      </div>

      {comment && (
        <p className="text-sm text-gray-600 leading-relaxed mt-2 whitespace-pre-line">
          {comment}
        </p>
      )}

      {date && (
        <span className="block text-[11px] text-gray-400 mt-3">
          {new Date(date).toLocaleDateString("ar-SA")}
        </span>
      )}
    </div>
  );
}