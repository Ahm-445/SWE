import { LogIn, UserRoundArrowLeft,} from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Student() {
    const [tab, setTab] = useState("Login");
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE = "https://swe-78u0.onrender.com/api/auth";


    // بيانات تسجيل الدخول
    const [loginData, setLoginData] = useState({
      email: "",
      password: "",
    });

    // بيانات إنشاء الحساب
    const [signupData, setSignupData] = useState({
      name: "",
      email: "",
      term_level: "",
      password: "",
      confirmPassword: "",
    });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await res.json();  

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("البريد الإلكتروني غير مسجل");
        }

        if (res.status === 401) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        if (res.status === 403) {
          throw new Error(data.error || "الحساب بانتظار موافقة الأدمن");
        }

        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      setIsLoading(false);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
        alert(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (signupData.password !== signupData.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      setIsLoading(false);
      return;
    }

    try {
      
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          role: "student",
          term_level: signupData.term_level,
          password: signupData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("هذا البريد الإلكتروني مسجل مسبقًا");
        }

        throw new Error(data.error || "فشل إنشاء الحساب");
      }

      setIsLoading(false);
      setTab("Login");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8 pb-36 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 mb-16">
        
        {/* الترويسة */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-amber-800/60 mb-2">مجتمع هندسة البرمجيات — KSU</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
         استكشف تجربتك كطالب ! 
          </h1>
          <p className="text-sm text-gray-500 mt-2">
           استفد من مجموعة رائعة من الخدمات المصممة خصيصًا لتعزيز تجربتك الأكاديمية.
          </p>
        </div>

        {/* صندوق البحث */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6dfd5] p-5 md:p-7 mb-8">
          <div className="flex bg-[#fbf8f3] p-1.5 rounded-2xl border border-[#e6dfd5] max-w-sm mx-auto mb-6">
            <button
              onClick={() => { setTab("Login");}}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === "Login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <LogIn className="w-4 h-4" /> تسجيل الدخول
            </button>
            <button
              onClick={() => { setTab("Signup"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === "Signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <UserRoundArrowLeft className="w-4 h-4" /> تسجيل جديد
            </button>
          </div>

          {tab === "Login" && (
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="400000000@student.ksu.edu.sa"
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm"
              />
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="كلمة المرور"
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm mt-4"
              />
              <button
                type="submit"
                className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-2xl hover:bg-amber-600 transition-colors mt-4"
              >
                {isLoading ? "جاري تسجيل الدخول..." : " تسجيل الدخول"}
              </button>
            </form>
          )}

          {tab === "Signup" && (
            <form onSubmit={handleSignupSubmit}>
              <input
                type="text"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                placeholder="الاسم الكامل"
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm"
              />
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder="400000000@student.ksu.edu.sa"
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm mt-4"
              />

              <select
                value={signupData.term_level}
                onChange={(e) => setSignupData({ ...signupData, term_level: e.target.value })}
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm mt-4"
              >
                <option value="third">المستوى الثالث</option>
                <option value="fourth">المستوى الرابع</option>
                <option value="fifth">المستوى الخامس</option>
                <option value="sixth">المستوى السادس</option>
                <option value="seventh">المستوى السابع</option>
                <option value="eighth">المستوى الثامن</option>
              </select>

              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                placeholder="كلمة المرور"
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm mt-4"
              />

              <input
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                placeholder="تأكيد كلمة المرور"
                className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fdfaf7] text-gray-800 text-sm mt-4"
              />

              <button
                type="submit"
                className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-2xl hover:bg-amber-600 transition-colors mt-4"
              >
                {isLoading ? "جاري إنشاء الحساب..." : "تسجيل جديد"}
              </button>
            </form>
          )}
        </div>
                

      </div>
    </div>
  );
}
        