import { Mosque } from "lucide-react";
import azkar from "../../data/azkar.json";

const categories = Object.keys(azkar);
const randomCategory = categories[Math.floor(Math.random() * categories.length)];
const categoryAzkar = azkar[randomCategory];
const randomZkr = categoryAzkar[Math.floor(Math.random() * categoryAzkar.length)];

export default function Zkr() {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm p-6 text-gray-800 relative overflow-hidden border border-[#e6dfd5]">
      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-amber-100/50 blur-3xl"></div>
      <div className="relative">

        <div className="flex flex-row items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Mosque className="w-5 h-5 text-amber-400" />  
          </div>

          <h3 dir="rtl" className="text-xl font-extrabold text-gray-900">
            {randomZkr.category}
          </h3>
        </div>
        


        <p dir="rtl" className="text-sm text-gray-500 mt-2 leading-6">
         {randomZkr.content}
        </p>

        <p dir="rtl" className="text-sm text-gray-500 mt-2 leading-6">
         {randomZkr.description}
        </p>

        <p dir="rtl" className="text-sm text-gray-500 mt-2 leading-6">
         {randomZkr.reference}
        </p>

      </div>

    </div>
  );
}
