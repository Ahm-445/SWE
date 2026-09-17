import { useEffect, useState } from "react";

export default function Countdown({ date }) {
  const calculateTime = () => {
    const now = new Date();
    const target = new Date(`${date}T00:00:00`);

    const difference = target - now;

    if (difference <= 0) {
      return null;
    }

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );


    return {
      days
    };
  };

  const [time, setTime] = useState(calculateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTime());
    }, 60000);

    return () => clearInterval(timer);
  }, [date]);

  if (!time) {
    return (
      <p className="text-sm font-bold text-gray-400">
        انتهى الاختبار
      </p>
    );
  }

  return (
    <div
      dir="rtl"
      className="mt-3 flex flex-wrap gap-2"
    >
      <div className="rounded-xl bg-[#fff1d6] px-3 py-2 text-center">
        <p className="text-lg font-black text-[#172033]">
          {time.days}
        </p>
        <p className="text-xs text-gray-500">
          يوم
        </p>
      </div>

    </div>
  );
}