
export default function News(){


    return(
        <div dir="rtl" className="text-center font-custom flex flex-col items-center justify-center bg-[#faf5ef] relative h-screen" >
            <div className="mb-20">
                <div className="p-1 gap-5 align-middle flex flex-col max-h-150 overflow-y-auto">
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>

                
            </div>

            <footer className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/back.png')] bg-repeat-x bg-[length:auto_100%] border-t border-[#E6DFD5] z-10"></footer>
            
        </div>
    );
} 

function Card({title, text, img, date}){
    return(
        <div className="p-1 lg:w-xl text-right flex flex-col bg-white w-90 h-30 rounded-xl justify-center shadow-lg  gap-1 ">
            <p className="text-2xl">Title</p>
            <p>Title</p>
            <p>Title</p>
            
        </div>
    )
}