import Register from "./Register";
import { useNavigate } from 'react-router-dom';

export default function Home(){

    const navigate = useNavigate();

    return(
        <div className="text-center font-custom flex flex-col items-center justify-center bg-[#faf5ef] relative h-screen" >
            <div className="mb-40">
                <div className="align-middle flex flex-col">
                    <p className="text-[#e1d0c3] mb-10 lg:text-4xl text-2xl" >مجتمع جامعة الملك سعود</p>
                    <p className="lg:text-6xl text-4xl">هــندسة البرمــــــــــجيات</p>
                </div>

                <div className="align-middle justify-around flex m-10 gap-10 max-w-fit">
                    <button onClick={() => navigate('/login')} className="lg:text-3xl lg:w-55 lg:h-15 t w-35 h-10 align-middle font-medium bg-[#ab927f] text-white text-center border-none rounded-xl hover:shadow-lg ease-in duration-200" >تسجيل دخول</button>
                    <button onClick={() => navigate('/register')} className="lg:text-3xl lg:w-55 lg:h-15 w-35 h-10 align-middle font-medium bg-[#ab927f] text-white text-center border-none rounded-xl hover:shadow-lg ease-in duration-200">تسجيل جديد</button>
                </div>
            </div>
            <div className=" absolute bottom-[80px] left-[50px] w-[90px] h-[180px] lg:w-[125px] lg:h-[250px] lg:left-[80px] bg-[url('/tech.png')] bg-contain bg-no-repeat opacity-70 z-10"></div>      

            <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#E6DFD5] z-10"></footer>
            
        </div>
    );
} 