import { Eye, MessageSquare, Plus, Star, Users } from "lucide-react";
import RatingBar from "./RatingBar";

export default function EvaluationResults({ details, onAddReview }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#e6dfd5] p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="text-center sm:text-right">
            <h2 className="text-2xl font-black text-gray-800">
              {details.target.name}
            </h2>

            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 mt-2">
              {details.target.department}
            </span>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                {details.stats.totalRatings} تقييم
              </span>

              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                {details.target.viewsCount} مشاهدة
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-3xl shadow-sm text-center min-w-[140px]">
            <div className="flex items-center justify-center gap-1 text-amber-200 mb-1">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span className="text-xs font-bold">التقييم العام</span>
            </div>
            <div className="text-3xl font-extrabold">
              {details.stats.averages.final}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <RatingBar label="الشرح" value={details.stats.averages.explanation} color="bg-emerald-500" />
          <RatingBar label="التعامل" value={details.stats.averages.dealing} color="bg-blue-500" />
          <RatingBar label="الدرجات والتصحيح" value={details.stats.averages.grading} color="bg-amber-500" />
          <RatingBar label="التحضير والالتزام" value={details.stats.averages.attendance} color="bg-purple-500" />
        </div>

        {details.stats.topTags?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 mb-3">
              الإشارات الأكثر تكراراً:
            </p>

            <div className="flex flex-wrap gap-2">
              {details.stats.topTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 bg-[#fbf8f3] border border-[#e6dfd5] text-gray-700 font-semibold rounded-xl"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onAddReview}
          className="w-full mt-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" /> إضافة تقييمك لـ {details.target.name}
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-600" />
          تجارب الطلاب ({details.reviews.length})
        </h3>

        {details.reviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-[#e6dfd5] text-gray-400">
            كن أول من يضيف تقييماً وتجربة!
          </div>
        ) : (
          details.reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-[#e6dfd5] shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  {rev.subjectName && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                      {rev.subjectName}
                    </span>
                  )}

                  {rev.grade && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
                      القريد: {rev.grade}
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-gray-400">
                  {new Date(rev.createdAt).toLocaleDateString("ar-SA")}
                </span>
              </div>

              {rev.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {rev.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-[#fbf8f3] text-gray-600 px-2 py-0.5 rounded-lg border border-[#e6dfd5]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {rev.comment && (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pt-1">
                  {rev.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
