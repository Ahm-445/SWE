export default function Register(){

    return(
        <div dir="rtl" className="text-center font-custom flex flex-col items-center justify-center bg-[#faf5ef] relative h-screen" >
            <div className="mb-40 flex flex-col items-center">
                <div className="align-middle flex flex-row bg-white w-90 h-50 rounded-xl shadow-lg justify-center gap-10 " >
                    <div className="flex flex-col gap-2 justify-center text-right">
                        <p>الاسم</p>
                        <p>البريد الجامعي</p>
                        <p>المستوى الحالي</p>
                        <p>كلمة المرور</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-center ">
                        <input className=" shadow-md rounded-b-md pr-1" type="text"></input>
                        <input className=" shadow-md rounded-b-md pr-1" type="email"></input>
                        <select id="level" className=" shadow-md rounded-b-md pr-1" >
                            <option value={3}>الثالث</option>
                            <option value={4}>الرابع</option>
                            <option value={5}>الخامس</option>
                            <option value={6}>السادس</option>
                            <option value={7}>السابع</option>
                            <option value={8}>الثامن</option>
                        </select>
                        <input className=" shadow-md rounded-b-md pr-1" type="password"></input>
                    </div>
                </div>

                <div className="align-middle justify-around flex m-10 gap-10 max-w-fit">
                    <button className="lg:text-3xl lg:w-55 lg:h-15 t w-60 h-10 align-middle font-medium bg-[#ab927f] text-white text-center border-none rounded-xl hover:shadow-lg ease-in duration-200" >تسجيل جديد</button>
                </div>
                
            </div>


            <div className=" absolute bottom-[80px] left-[50px] w-[90px] h-[180px] lg:w-[125px] lg:h-[250px] lg:left-[80px] bg-[url('/tech.png')] bg-contain bg-no-repeat opacity-70 z-10"></div>      
            <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#E6DFD5] z-10"></footer>
            
        </div>
    );

    


}  