
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Calculator, 
  UserX, 
  Star, 
  Newspaper, 
  Menu, 
  X 
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path) => {
    if (path) navigate(path);
    setIsOpen(false);
  };

  const navItems = [
    { title: "الجدول", icon: Calendar, path: "/schedule" },
    { title: "المعدل", icon: Calculator, path: "/gpa" },
    { title: "الغياب", icon: UserX, path: "/absence" },
    { title: "التقييم", icon: Star, path: "/evaluation" },
    { title: "أخبار", icon: Newspaper, path: "/news" },
  ];

  return (
    <nav dir="rtl" className="font-custom bg-[#faf5ef] w-full sticky top-0 z-50 border-b border-[#e6dfd5]">
      <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        
        <div 
          onClick={() => handleNavigate('/')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img 
            className="lg:w-[90px] lg:h-[90px] w-[60px] h-[60px] object-contain transition-transform group-hover:scale-105" 
            src="/Logo.png" 
            alt="Logo"
          />
          <p className="text-shadow-xs lg:text-2xl font-bold text-gray-800">
            هندسة البرمجيات
          </p>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[0.9em] lg:text-[1em] text-gray-700 font-semibold">
          {navItems.map((item, index) => (
            <p 
              key={index}
              onClick={() => handleNavigate(item.path)}
              className="cursor-pointer hover:text-black hover:scale-105 duration-300 ease-in hover:text-shadow-lg"
            >
              {item.title}
            </p>
          ))}
        </div>


        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2.5 rounded-2xl bg-[#f2e9dc] text-gray-800 active:scale-90 transition-all shadow-sm border border-[#e6dfd5]"
          aria-label="القائمة"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>


      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[75px] bg-[#faf5ef]/95 backdrop-blur-md z-40 p-6 flex flex-col justify-between animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto">
          
          <div>
            <p className="text-xs font-bold text-gray-400 mb-4 text-right">القائمة السريعة</p>
            

            <div className="grid grid-cols-2 gap-4">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    onClick={() => handleNavigate(item.path)}
                    className={`flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-br  border border-[#e6dfd5] shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer group`}
                  >
                    <div className="p-3 rounded-2xl bg-white/80 shadow-inner mb-3 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-gray-800" />
                    </div>
                    <span className="font-bold text-gray-800 text-base">{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#e6dfd5] text-center">
            <p className="text-xs text-gray-500">مجتمع طلاب هندسة البرمجيات — KSU</p>
          </div>

        </div>
      )}
    </nav>
  );
}