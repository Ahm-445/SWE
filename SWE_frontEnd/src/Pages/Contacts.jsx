/* eslint-disable react-hooks/set-state-in-effect -- search state is intentionally synchronized with query changes. */
import { useState, useEffect, useRef } from "react";
import { Search, User, Mail, MapPin, Building2 } from "lucide-react";

const API_BASE = "https://swe-78u0.onrender.com/api/contacts"; 

export default function Contacts() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("فشل البحث:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">دليل التواصل الأكاديمي</h1>
          <p className="text-sm text-gray-500">ابحث عن اسم الدكتور للحصول على بريده الإلكتروني ورقم مكتبه.</p>
        </div>

        {/* صندوق البحث */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6dfd5] p-5 md:p-7 mb-8 relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث باسم الدكتور..."
              className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* القائمة المنسدلة */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#e6dfd5] shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
              {suggestions.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setSuggestions([]);
                    setQuery("");
                  }}
                  className="p-4 hover:bg-amber-50/70 cursor-pointer border-b border-gray-50 last:border-none flex items-center gap-3 transition-colors"
                >
                  <div className="p-2 bg-[#faf5ef] rounded-xl text-amber-800 border border-[#e6dfd5]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">{doc.name}</span>
                    {doc.department && <span className="text-xs text-gray-400">{doc.department}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* بطاقة عرض البيانات */}
        {selectedDoctor && (
          <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black text-gray-800">{selectedDoctor.name}</h2>
            </div>
            
            <div className="space-y-4">
              
              {/* القسم / الكلية */}
              <div className="flex items-center gap-4 bg-[#fbf8f3] p-4 rounded-2xl border border-[#e6dfd5]">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-gray-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1">القسم / الكلية</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedDoctor.department || "غير متوفر"}
                  </p>
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div className="flex items-center gap-4 bg-[#fbf8f3] p-4 rounded-2xl border border-[#e6dfd5]">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-gray-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1">البريد الإلكتروني</p>
                  <a href={`mailto:${selectedDoctor.email}`} className="text-sm font-semibold text-amber-600 hover:underline" dir="ltr">
                    {selectedDoctor.email || "غير متوفر"}
                  </a>
                </div>
              </div>

              {/* المكتب */}
              <div className="flex items-center gap-4 bg-[#fbf8f3] p-4 rounded-2xl border border-[#e6dfd5]">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-gray-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1">المكتب / الموقع</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedDoctor.office || "غير متوفر"}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
