import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="text-center font-custom flex flex-col items-center justify-center bg-[#faf5ef] relative min-h-[calc(100vh-75px)] w-full overflow-x-hidden px-4">
            <div className="mb-28 md:mb-36 max-w-2xl mx-auto flex flex-col items-center">
                <div className="flex flex-col mb-6 md:mb-8">
                    <p className="duration-300 text-[#e1d0c3] mb-4 md:mb-6 text-xl sm:text-2xl lg:text-4xl font-medium">
                        مجتمع جامعة الملك سعود
                    </p>
                    <p className="duration-300 text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 tracking-tight">
                        هــندسة البرمــــــــــجيات
                    </p>
                </div>

                <div className="text-shadow-xs duration-300 opacity-60 text-center px-4 max-w-lg text-sm sm:text-base leading-relaxed">
                    <p dir='rtl'>
                        نهدف من خلال هذا الموقع إلى بناء بيئة أكاديمية ومجتمعية متكاملة لتسهيل رحلة طالب هندسة البرمجيات. نجمع لك كل ما تحتاجه في مكان واحد للتخطيط لدراستك وتطوير مهاراتك.
                    </p>
                </div>
            </div>

            {/* الصورة الجانبية متجاوبة وتختفي في الشاشات الصغيرة جداً لمنع التداخل */}
            <div className="absolute bottom-[80px] left-3 sm:left-8 lg:left-[80px] w-[70px] h-[140px] sm:w-[90px] sm:h-[180px] lg:w-[125px] lg:h-[250px] bg-[url('/tech.png')] bg-contain bg-no-repeat opacity-60 pointer-events-none z-0"></div>      

            <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#E6DFD5] z-10"></footer>
        </div>
    );
}