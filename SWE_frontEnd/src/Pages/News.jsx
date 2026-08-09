import React, { useEffect, useState } from "react";


export default function News(){
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/tel/cards");
        const data = await response.json();
        if (data.success) {
          setCards(data.cards);
        }
      } catch (error) {
        console.error("Failed to fetch news cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);


    return(
        <div dir="rtl" className="text-center font-custom flex flex-col items-center justify-center bg-[#faf5ef] relative h-screen" >
            <div className="mb-20 w-full flex flex-col items-center">
                <div className="p-1 gap-5 align-middle flex flex-col max-h-150 overflow-y-auto">
                    {loading ? (
                        <p className="text-gray-500">جاري تحميل الأخبار...</p>
                    ) : cards.length === 0 ? (
                        <p className="text-gray-500">لا توجد أخبار حالية متوفرة.</p>
                    ) : (
                        cards.map((item) => (
                        <Card
                            key={item.telId || item._id}
                            title={item.title}
                            text={item.content}
                            img={item.imageUrl}
                            date={item.postedAt}
                        />
                        ))
                    )}
                </div>
            </div>

            <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#E6DFD5] z-10"></footer>
            
        </div>
    );
} 

function Card({title, text, img, date}){

    const formattedDate = date
    ? new Date(date).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

    return (
    <div className="group relative p-4 lg:w-xl w-90 min-h-32 bg-white rounded-xl shadow-lg border border-[#E6DFD5] text-right flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-blue-300 hover:scale-[1.01] overflow-hidden">
      
      {/* Upper Content Area */}
      <div className="flex gap-4 items-start">
        {/* Text Details */}
        <div className="flex flex-col justify-between flex-1">
          <div className="flex justify-between items-center mb-2 gap-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:line-clamp-none line-clamp-1 transition-all">
              {title}
            </h3>
            {formattedDate && (
              <span className="text-xs text-gray-400 shrink-0 ">
                {formattedDate}
              </span>
            )}
          </div>

          {/* Full Text revealed on hover */}
          <p className=" text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all whitespace-pre-line group:hover:duration-300">
            {text}
          </p>
        </div>

        {/* Thumbnail / Image (Expands slightly on hover if present) */}
        {img && (
          <div className="w-24 h-24 group-hover:w-32 group-hover:h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100 transition-all duration-300">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Subtle indicator hint */}
      <div className="mt-2 text-[10px] text-gray-300 text-left group-hover:text-gray-400 transition-colors">
        مرر للمزيد ──
      </div>
    </div>
  );
}