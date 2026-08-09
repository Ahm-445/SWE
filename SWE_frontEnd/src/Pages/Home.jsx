import { useNavigate } from 'react-router-dom';

export default function Home(){

    const navigate = useNavigate();

    return(
        <div className="text-center font-custom flex flex-col items-center justify-center bg-[#faf5ef] relative h-screen" >
            <div className=" mb-40">
                <div className=" align-middle flex flex-col mb-10">
                    <p className="duration-300 text-[#e1d0c3] mb-10 lg:text-4xl text-2xl" >مجتمع جامعة الملك سعود</p>
                    <p className="duration-300 lg:text-6xl text-4xl">هــندسة البرمــــــــــجيات</p>
                </div>

                <div className="text-shadow-xs duration-300 opacity-40 align-middle justify-around flex m-10 gap-10 w-100 text-[0.8em] lg:w-120 lg:text-[1em] ">
                    <p dir='rtl' >نهدف من خلال هذا الموقع إلى بناء بيئة أكاديمية ومجتمعية متكاملة لتسهيل رحلة طالب هندسة البرمجيات. نجمع لك كل ما تحتاجه في مكان واحد للتخطيط لدراستك وتطوير مهاراتك.</p>
                
                </div>
            </div>
            <div className=" absolute bottom-[80px] left-[50px] w-[90px] h-[180px] lg:w-[125px] lg:h-[250px] lg:left-[80px] bg-[url('/tech.png')] bg-contain bg-no-repeat opacity-70 z-10"></div>      

            <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#E6DFD5] z-10"></footer>
            
        </div>
    );
} 