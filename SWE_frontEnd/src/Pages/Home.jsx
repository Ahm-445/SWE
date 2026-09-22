import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpenCheck, CalendarDays, ChartNoAxesCombined, GraduationCap, HeartHandshake, Sparkles, UsersRound } from "lucide-react";

const features = [
  { icon: CalendarDays, title: "نظّم وقتك بذكاء", description: "تابع جدولك الدراسي ومواعيدك المهمة من مكان واحد." },
  { icon: ChartNoAxesCombined, title: "تابع تقدّمك", description: "احسب معدلك وراقب مسيرتك الأكاديمية بثقة." },
  { icon: BookOpenCheck, title: "كل ما يخص المقررات", description: "محتوى المقررات، الاختبارات والمواد التي تحتاجها." },
];

const stats = [
  { value: "+15,000", label: "زائر للموقع", icon: UsersRound },
  { value: "+2,400", label: "طالب وطالبة", icon: GraduationCap },
  { value: "24/7", label: "خدمات متاحة", icon: Sparkles },
  { value: "+35", label: "مورد أكاديمي", icon: HeartHandshake },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <main dir="rtl" className="font-custom relative overflow-hidden bg-[#faf5ef] text-slate-800">
      <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-[#e8d8c7]/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 top-96 h-80 w-80 rounded-full bg-[#dce9e5]/55 blur-3xl" />

      <section className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-6 px-5 py-16 sm:gap-10 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:py-20">
        <div className="order-2 text-center lg:order-1 lg:text-right">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e7d9cc] bg-white/70 px-4 py-2 text-sm font-bold text-[#9a715a] shadow-sm"><Sparkles className="h-4 w-4" />مجتمع طلاب هندسة البرمجيات · جامعة الملك سعود</div>
          <h1 className="text-4xl font-black leading-[1.25] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">مساحتك لكل ما<span className="block text-[#a26d4e]">يهم طالب هندسة البرمجيات</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0">منصة تجمع الأدوات والخدمات التي تجعل رحلتك الجامعية أوضح وأسهل؛ من تنظيم المقررات وحساب المعدل إلى متابعة الأخبار والتواصل مع مجتمعك.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <button onClick={() => navigate("/student")} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800">استكشف خدماتنا<ArrowLeft className="h-4 w-4" /></button>
            <button onClick={() => navigate("/news")} className="rounded-2xl border border-[#dfd1c5] bg-white/70 px-6 py-3.5 font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white">أحدث الأخبار</button>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <div className="relative rounded-[2rem] border border-white/80 bg-white/65 p-5 shadow-2xl shadow-[#6d5544]/10 backdrop-blur-sm sm:p-7">
            <div className="absolute -left-4 -top-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#a26d4e] text-white shadow-lg shadow-[#a26d4e]/25"><GraduationCap className="h-7 w-7" /></div>
            <div className="rounded-2xl bg-slate-900 p-6 text-right text-white sm:p-7"><p className="text-sm text-slate-300">رحلتك الأكاديمية، في لوحة واحدة</p><p className="mt-2 text-2xl font-black">ابدأ يومك بخطوة منظمة</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/10 p-3"><p className="text-xs text-slate-300">المهام القادمة</p><p className="mt-1 text-lg font-bold">06 مهام</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-xs text-slate-300">المعدل التراكمي</p><p className="mt-1 text-lg font-bold">تابعه بسهولة</p></div></div></div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f4ede6] p-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#a26d4e] shadow-sm"><BookOpenCheck className="h-5 w-5" /></div><div><p className="text-sm font-bold">كل ما تحتاجه قريب منك</p><p className="mt-0.5 text-xs text-slate-500">مقررات، أخبار، أدوات وخدمات طلابية.</p></div></div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-[#eadfd5] bg-white/55"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-x-reverse divide-[#eadfd5] px-4 sm:grid-cols-4 sm:px-8 lg:px-12">{stats.map(({ value, label, icon: Icon }) => <div key={label} className="flex flex-col items-center px-3 py-6 text-center sm:py-8"><Icon className="mb-2 h-5 w-5 text-[#a26d4e]" /><p className="text-2xl font-black text-slate-900 sm:text-3xl">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>)}</div></section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-10 text-center"><p className="text-sm font-bold text-[#a26d4e]">ماذا نقدم لك؟</p><h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">خدمات صُممت لرحلتك الجامعية</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">لأن وقت الطالب مهم، جمعنا أهم الأدوات التي تساعدك على التركيز على ما يصنع الفرق.</p></div>
        <div className="grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <article key={title} className="group rounded-3xl border border-[#eadfd5] bg-white/75 p-6 text-right shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6d5544]/10"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f3e9df] text-[#a26d4e] transition group-hover:bg-[#a26d4e] group-hover:text-white"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-black text-slate-900">{title}</h3><p className="mt-2 leading-7 text-slate-600">{description}</p></article>)}</div>
      </section>
      <div className="h-16 border-t border-[#e6dfd5] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%]" />
    </main>
  );
}
