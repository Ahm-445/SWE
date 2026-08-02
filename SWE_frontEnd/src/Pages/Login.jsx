import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){

    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.");
            }

            const data = await response.json();
            console.log(data);
            navigate("/dashboard");

            localStorage.setItem("token", data.token);
            localStorage.setItem("loggedIn", JSON.stringify({
                email: data.user.email,
                name: data.user.name,
                level: data.user.level
            }));

            alert("تم تسجيل الدخول بنجاح!");
            navigate("/dashboard");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return(
        <div dir="rtl" className="text-center font-custom flex flex-col items-center justify-center bg-[#faf5ef] relative h-screen" >
            <form onSubmit={handleSubmit} className="mb-40 flex flex-col items-center">
                <div className="align-middle flex flex-row bg-white w-90 h-50 rounded-xl shadow-lg justify-center gap-10 " >
                    <div className="flex flex-col gap-2 justify-center text-right">
                        <p>البريد الجامعي</p>
                        <p>كلمة المرور</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-center ">
                        <input onChange={(e) => setForm({...form, email: e.target.value})} className=" shadow-md rounded-b-md" type="email"></input>
                        <input onChange={(e) => setForm({...form, password: e.target.value})} className=" shadow-md rounded-b-md" type="password"></input>
                    </div>
                </div>

                <div className="align-middle justify-around flex m-10 gap-10 max-w-fit">
                    <button type="submit" disabled={loading} className="lg:text-3xl lg:w-55 lg:h-15 t w-60 h-10 align-middle font-medium bg-[#ab927f] text-white text-center border-none rounded-xl hover:shadow-lg ease-in duration-200" >{loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
            </form>


            <div className=" absolute bottom-[80px] left-[50px] w-[90px] h-[180px] lg:w-[125px] lg:h-[250px] lg:left-[80px] bg-[url('/tech.png')] bg-contain bg-no-repeat opacity-70 z-10"></div>      
            <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#E6DFD5] z-10"></footer>
            
        </div>
    );

    


}  