import { useNavigate } from "react-router-dom";

export default function Navbar(){
    const navigate = useNavigate();
    return(
        <div dir="rtl" className="font-custom flex bg-[#faf5ef] h-fit items-center">
            <div className="items-center flex w-[70%] mr-2" >
                <img className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px] ml-0.5" src="/Logo.png"/>
                <p className="text-shadow-xs duration-300 lg:text-2xl">هندسة البرمجيات</p>
            </div>
            <div className="duration-300 w-[30%] flex justify-around ml-[60px] gap-1.5 text-[0.8em] lg:text-[1em]">
                <p className="hover:lg:text-xl hover:text-sm duration-300 ease-in hover:text-shadow-lg">الجدول</p>
                <p className="hover:lg:text-xl hover:text-sm duration-300 ease-in hover:text-shadow-lg">المعدل</p>
                <p className="hover:lg:text-xl hover:text-sm duration-300 ease-in hover:text-shadow-lg">الغياب</p>
                <p className="hover:lg:text-xl hover:text-sm duration-300 ease-in hover:text-shadow-lg">التقييم</p>
                <p onClick={() => navigate('/news')} className="hover:lg:text-xl hover:text-sm duration-300 ease-in hover:text-shadow-lg">أخبار</p>
            </div>
        </div>
        
    );
};