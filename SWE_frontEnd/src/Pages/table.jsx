export default function Table() {
    return (
    <div className="font-custom p-1 gap-5 align-middle flex flex-col max-h-150 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">قريبًا</h1>
        {/* الصورة الجانبية متجاوبة وتختفي في الشاشات الصغيرة جداً لمنع التداخل */}
            <div className="absolute bottom-[80px] left-3 sm:left-8 lg:left-[80px] w-[70px] h-[140px] sm:w-[90px] sm:h-[180px] lg:w-[125px] lg:h-[250px] bg-[url('/tech.png')] bg-contain bg-no-repeat opacity-60 pointer-events-none z-0"></div>      

            <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#E6DFD5] z-10"></footer>
        
        </div>
    </div>
    )
}