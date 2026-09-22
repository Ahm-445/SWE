import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import Countdown from "../common/Countdown";

const API_BASE = "https://swe-78u0.onrender.com/api";


function formatExamDate(date) {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


export default function UpcomingExams({ courses = [] }) {

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function fetchExams() {

      const token = localStorage.getItem("token");


      if (!token || !courses.length) {
        setLoading(false);
        return;
      }


      try {
        const responses = await Promise.all(
          courses.map(async(course)=>{
            const res = await fetch(
              `${API_BASE}/courses/${encodeURIComponent(course.id)}/exams`,
              {
                headers:{
                  Authorization:`Bearer ${token}`
                }
              }
            );

            if(!res.ok) return [];

            const data = await res.json();
            return [
              ...(data.defaultExams || []),
              ...(data.userExams || [])
            ]
            .map(exam=>({
              ...exam,
              courseId:course.id,
              courseName:
                course.name ||
                course.title ||
                course.id
            }));
          })
        );

        const all = responses
        .flat()
        .filter(exam=>exam.exam_date)
        .sort(
          (a,b)=>
          new Date(a.exam_date)
          -
          new Date(b.exam_date)
        )
        .slice(0,5);
        setExams(all);
      } catch(error){
        console.log(error);
      } finally{
        setLoading(false);
      }
    }
    fetchExams();
  },[courses]);
  
  return (
    <aside dir="rtl" className=" w-full xl:w-[330px] mb-10 shrink-0 ">
      <div className=" bg-white rounded-3xl border border-[#e6dfd5] shadow-sm overflow-hidden ">

        {/* Header */}

        <div className=" p-4 md:p-5 border-b border-[#eee7de] ">
          <div className=" flex items-center gap-3 ">
            <div className=" w-10 h-10 rounded-2xl bg-[#fff1d6] flex items-center justify-center ">

              <CalendarDays
                size={20}
                className="text-[#f28c28]"
              />
            </div>

            <div>
              <h2 className=" text-lg md:text-xl font-black text-[#172033] ">
                الاختبارات القادمة
              </h2>

              <p className=" text-xs  text-gray-500 ">
                أقرب الاختبارات
              </p>
            </div>
          </div>
        </div>

        {/* Exams */}
        <div className=" p-3 md:p-4 space-y-3 ">
        { loading ? (

            <p className=" text-center text-sm  text-gray-400 ">
              جاري التحميل...
            </p>
          ) : exams.length === 0 ? (
            <p className=" text-center text-sm  text-gray-400 " >
              لا توجد اختبارات
            </p>
          ) : exams.map((exam)=>(
            <div key={exam.id} className=" rounded-2xl border border-[#eee7de] p-3 md:p-4  hover:shadow-md transition ">
              <div className="flex items-center justify-between gap-3">

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#f28c28]">
                    {exam.courseId}
                  </p>

                  <h3 className="text-sm font-black text-[#172033] truncate">
                    {exam.courseName}
                  </h3>

                  <p className="text-sm font-bold text-gray-700">
                    {exam.name}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {formatExamDate(exam.exam_date)}
                  </p>

                </div>

                {/* Countdown */}
                <div className="shrink-0 scale-75 md:scale-100 origin-left">
                  <Countdown
                    date={exam.exam_date}
                  />
                </div>
              </div>
            </div>
          ))}
        
        </div>
      </div>
    </aside>
  );
}
