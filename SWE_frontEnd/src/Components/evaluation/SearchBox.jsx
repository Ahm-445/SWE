import { BookOpen, Search, User } from "lucide-react";

export default function SearchBox({
  tab,
  query,
  suggestions,
  showDropdown,
  dropdownRef,
  onTabChange,
  onQueryChange,
  onSelect,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#e6dfd5] p-5 md:p-7 mb-8">
      <div className="flex bg-[#fbf8f3] p-1.5 rounded-2xl border border-[#e6dfd5] max-w-sm mx-auto mb-6">
        <button
          onClick={() => onTabChange("doctor")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
            tab === "doctor"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <User className="w-4 h-4" /> تقييم دكتور
        </button>

        <button
          onClick={() => onTabChange("subject")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
            tab === "subject"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <BookOpen className="w-4 h-4" /> تقييم مادة
        </button>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={
              tab === "doctor"
                ? "ابحث باسم الدكتور (مثال: محسن...)"
                : "ابحث برمز أو اسم المادة..."
            }
            className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#e6dfd5] shadow-xl overflow-hidden z-50">
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onQueryChange(item.name);
                  onSelect(item.id);
                }}
                className="p-3.5 hover:bg-amber-50/70 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-none transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#faf5ef] rounded-xl text-amber-800 border border-[#e6dfd5]">
                    {item.type === "doctor" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.department}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
