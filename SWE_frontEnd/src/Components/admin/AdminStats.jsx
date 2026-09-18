import {
  Users,
  Clock,
  BookOpen,
  FileText
} from "lucide-react";


export default function AdminStats({stats}){

  const cards=[
    {
      title:"عدد الطلاب",
      value:stats.students,
      icon:Users
    },
    {
      title:"طلبات الانتظار",
      value:stats.pending,
      icon:Clock
    },
    {
      title:"المواد",
      value:stats.courses,
      icon:BookOpen
    },
    {
      title:"الاختبارات",
      value:stats.exams,
      icon:FileText
    }
  ];


  return(
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      {
        cards.map((card,index)=>{

          const Icon=card.icon;

          return(
            <div
              key={index}
              className="bg-white rounded-3xl border border-[#e6dfd5] p-5 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500 font-bold">
                    {card.title}
                  </p>

                  <h3 className="text-3xl font-black text-[#172033] mt-2">
                    {card.value}
                  </h3>
                </div>


                <div className="w-12 h-12 rounded-2xl bg-[#fff1d6] flex items-center justify-center">

                  <Icon className="text-[#f28c28]"/>

                </div>


              </div>

            </div>
          );

        })
      }

    </div>
  );

}