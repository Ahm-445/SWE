import { BookOpen, CalendarDays, CheckCircle2, Trophy } from "lucide-react";
import StatCard from "./StatCard";

export default function StatsSection({
  totalCourses,
  totalHours,
  completedCourses,
  overallProgress,
}) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard icon={BookOpen} label="مواد المستوى" value={totalCourses} suffix="مواد" />
      <StatCard icon={CalendarDays} label="الساعات" value={totalHours} suffix="ساعة" />
      <StatCard
        icon={CheckCircle2}
        label="مواد مكتملة"
        value={completedCourses}
        suffix={`من ${totalCourses}`}
      />
      <StatCard
        icon={Trophy}
        label="التقدم"
        value={`${overallProgress}%`}
        suffix="هذا المستوى"
      />
    </section>
  );
}
