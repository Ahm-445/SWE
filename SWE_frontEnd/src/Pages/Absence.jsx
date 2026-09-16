import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Clock, BookOpen, RotateCcw 
} from "lucide-react";
import AbsenceCard from "../components/absence/AbsenceCard";


const COURSES_DATA = [ { code: "فيز ١٠٣", lecture: 3, lab: 2, tutorial: 0 }, { code: "ريض ١٠٦", lecture: 3, lab: 0, tutorial: 2 }, { code: "عال ١١١", lecture: 3, lab: 2, tutorial: 1 }, { code: "ريض ١٥١", lecture: 3, lab: 0, tutorial: 2 }, { code: "فيز ١٠٤", lecture: 3, lab: 2, tutorial: 0 }, { code: "عال ١١٣", lecture: 3, lab: 2, tutorial: 1 }, { code: "هاب ٢١١", lecture: 3, lab: 0, tutorial: 1 }, { code: "ريض ٢٤٤", lecture: 3, lab: 0, tutorial: 2 }, { code: "هال ٣٠٣", lecture: 3, lab: 0, tutorial: 1 }, { code: "عال ٢١٢", lecture: 3, lab: 0, tutorial: 1 }, { code: "عال ٢٢٠", lecture: 2, lab: 2, tutorial: 1 }, { code: "هاب ٣١٢", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٣١٤", lecture: 3, lab: 0, tutorial: 1 }, { code: "عال ٢٢٧", lecture: 3, lab: 0, tutorial: 1 }, { code: "نال ٢٣٠", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٣٢١", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٣٣٣", lecture: 2, lab: 0, tutorial: 1 }, { code: "هاب ٣٨١", lecture: 3, lab: 0, tutorial: 1 }, { code: "سلم ١٠٧", lecture: 2, lab: 0, tutorial: 0 }, { code: "هاب ٤٣٤", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٤٨٢", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٤٤٤", lecture: 0, lab: 4, tutorial: 0 }, { code: "هاب ٤٧٧", lecture: 2, lab: 0, tutorial: 0 }, { code: "سلم ١٠٨", lecture: 2, lab: 0, tutorial: 0 }, { code: "هاب ٤٥٥", lecture: 2, lab: 0, tutorial: 1 }, { code: "هاب ٤٦٦", lecture: 3, lab: 0, tutorial: 1 }, { code: "قرأ ١٠٠", lecture: 2, lab: 0, tutorial: 0 }, { code: "سلم ١٠٢", lecture: 2, lab: 0, tutorial: 0 }, { code: "سلم ١٠٣", lecture: 2, lab: 0, tutorial: 0 }, { code: "سلم ١٠٥", lecture: 2, lab: 0, tutorial: 0 }, { code: "سلم ١٠٦", lecture: 2, lab: 0, tutorial: 0 }, { code: "بحث ١٢٢", lecture: 2, lab: 0, tutorial: 2 }, { code: "ريض ٢٠٣", lecture: 3, lab: 0, tutorial: 2 }, { code: "ريض ٢٥٤", lecture: 3, lab: 0, tutorial: 2 }, { code: "كيح ١٠١", lecture: 3, lab: 2, tutorial: 0 }, { code: "حدق ١٤٠", lecture: 2, lab: 2, tutorial: 0 }, { code: "جاف ٢٠١", lecture: 2, lab: 2, tutorial: 0 }, { code: "فيز ٢٠١", lecture: 2, lab: 0, tutorial: 2 }, { code: "عال ٢١٥", lecture: 2, lab: 2, tutorial: 0 }, { code: "عال ٣١١", lecture: 3, lab: 0, tutorial: 1 }, { code: "هال ٣١٦", lecture: 3, lab: 0, tutorial: 1 }, { code: "هال ٣١٨", lecture: 3, lab: 2, tutorial: 1 }, { code: "عال ٣٦١", lecture: 3, lab: 0, tutorial: 1 }, { code: "نال ٣٨٥", lecture: 2, lab: 0, tutorial: 2 }, { code: "هال ٤٤٥", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٤٨١", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٤٨٣", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٤٨٥", lecture: 3, lab: 0, tutorial: 1 }, { code: "نال ٤٨٥", lecture: 2, lab: 2, tutorial: 0 }, { code: "هاب ٤٨٦", lecture: 3, lab: 0, tutorial: 1 }, { code: "هاب ٤٨٨", lecture: 3, lab: 0, tutorial: 1 }, ];

export default function Absence() {
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const storageKey = user?.id
    ? `swe_absence_courses_${user.id}`
    : "swe_absence_courses_guest";

  const [selectedCourses, setSelectedCourses] = useState(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }

    return [{ id: "default-1", code: "هاب ٣٢١", lecture: 3, lab: 0, tutorial: 1, absentHours: 0}];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(selectedCourses));
  }, [selectedCourses, storageKey]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const filtered = COURSES_DATA.filter((c) =>
      c.code.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    setSuggestions(filtered);
    setShowDropdown(true);
  }, [searchQuery]);

  const addCourse = (course) => {
    const isAlreadyAdded = selectedCourses.some((c) => c.code === course.code);
    if (isAlreadyAdded) {
      alert("المادة مضافة مسبقاً في قائمتك");
      setShowDropdown(false);
      setSearchQuery("");
      return;
    }

    setSelectedCourses([
      ...selectedCourses,
      { id: Date.now().toString(), ...course, absentHours: 0}]);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== id));
  };

  const updateAbsentHours = (id, delta) => {
    setSelectedCourses(
      selectedCourses.map((c) => {
        if (c.id === id) {
          const newHours = Math.max(0, (c.absentHours || 0) + delta);
          return { ...c, absentHours: newHours };
        }
        return c;
      })
    );
  };

  const setExactAbsentHours = (id, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setSelectedCourses(
      selectedCourses.map((c) => (c.id === id ? { ...c, absentHours: val } : c)));
  };

  const handleResetAll = () => {
    if (window.confirm("هل أنت متأكد من رغبتك بإعادة ضبط جميع الغيابات؟")) {
      setSelectedCourses(selectedCourses.map((c) => ({ ...c, absentHours: 0 })));}
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8 pb-48">
      <div className="max-w-3xl mx-auto">
        
        {/* الترويسة */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-amber-800/60 mb-2">جامعة الملك سعود — كلية علوم الحاسب والمعلومات</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            حاسبة الغياب الأكاديمية
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            مبنية على احتساب الفصل الدراسي (14 أسبوعاً) والحد الأقصى للغياب المسموح (25%).
          </p>
        </div>

        {/* حقل البحث وإضافة المقررات */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6dfd5] p-4 md:p-6 mb-8">
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => suggestions.length > 0 && setShowDropdown(true)} placeholder="ابحث برمز المقرر لإضافته (مثال: هاب ٣٢١ أو عال ١١١)..." className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm font-medium"/>
              <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* القائمة المنسدلة */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#e6dfd5] shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                {suggestions.map((item, idx) => {
                  const weekly = item.lecture + item.lab + item.tutorial;
                  return (
                    <div key={idx} onClick={() => addCourse(item)} className="p-3.5 hover:bg-amber-50/70 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-none transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#faf5ef] rounded-xl text-amber-800 border border-[#e6dfd5]">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{item.code}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.lecture} محاضرة {item.tutorial > 0 ? `+ ${item.tutorial} تمارين` : ""} {item.lab > 0 ? `+ ${item.lab} عملي` : ""} ({weekly} س/أسبوع)
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                        + إضافة
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* شريط الإجراءات */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-lg font-extrabold text-gray-800">
            المقررات المتابعة ({selectedCourses.length})
          </h2>
          {selectedCourses.length > 0 && (
            <button onClick={handleResetAll} className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors font-bold">
              <RotateCcw className="w-3.5 h-3.5" /> تصفير الغيابات
            </button>
          )}
        </div>

        {/* قائمة بطاقات المقررات */}
        <div className="space-y-5">
          {selectedCourses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#e6dfd5] text-gray-400">
              <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              لم تقم بإضافة أي مقرر بعد. ابحث عن مقرراتك في الأعلى لمتابعة غيابك.
            </div>
          ) : (
            selectedCourses.map((c) => (
              <AbsenceCard key={c.id} course={c} onUpdateHours={(delta) => updateAbsentHours(c.id, delta)} onSetExactHours={(val) => setExactAbsentHours(c.id, val)} onRemove={() => removeCourse(c.id)}/>
            ))
          )}
        </div>
        <div className="h-28 w-full pointer-events-none" />
      </div>
    </div>
  );
}
