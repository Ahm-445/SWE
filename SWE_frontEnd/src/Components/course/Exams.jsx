 import Countdown from "../common/Countdown";
 
 export const Exams = ({ exams, content, getExamProgress, formatDate, setShowExamModal }) => {
     return (
        <section>

            <div className="font-custom mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <h2 className="text-2xl font-black text-[#172033]">
                    الاختبارات
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    الاختبارات المرتبطة بأجزاء المادة
                </p>
                </div>

                <button
                type="button"
                onClick={() =>
                    setShowExamModal(true)
                }
                className="rounded-xl bg-[#f28c28] px-5 py-3 font-bold text-white transition hover:opacity-90"
                >
                + إضافة اختبار
                </button>
            </div>

            {exams.length === 0 ? (
                <div className="rounded-3xl border border-[#e8dfd4] bg-white p-10 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1d6] text-3xl">
                    📝
                </div>

                <h3 className="text-lg font-black text-[#172033]">
                    لا توجد اختبارات
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                    أضف اختبارًا وحدد الأجزاء الداخلة
                    فيه.
                </p>

                <button
                    type="button"
                    onClick={() =>
                    setShowExamModal(true)
                    }
                    className="mt-5 rounded-xl bg-[#172033] px-5 py-3 font-bold text-white"
                >
                    إضافة اختبار
                </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">

                {exams.map((exam) => {

                    const examProgress =
                    getExamProgress(exam);

                    const examParts =
                    (exam.content_ids || [])
                        .map((id) =>
                        content.find(
                            (item) =>
                            String(item.id) ===
                            String(id)
                        )
                        )
                        .filter(Boolean);

                    return (
                    <div
                        key={exam.id}
                        className="rounded-3xl border border-[#e8dfd4] bg-white p-5 shadow-sm"
                    >

                        <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-start gap-3">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff1d6] text-xl">
                            📝
                            </div>

                            <div className="min-w-0">

                            <h3 className="font-black text-[#172033]">
                                {exam.name}
                            </h3>

                            <p
                                dir="rtl"
                                className="mt-1 text-sm text-gray-500"
                            >
                                {formatDate(
                                exam.exam_date
                                )}
                            </p>

                            <Countdown
                                date={exam.exam_date}
                            />

                            </div>
                        </div>

                        <span className="shrink-0 rounded-full bg-[#faf7f2] px-3 py-1 text-xs font-bold text-[#172033]">
                            {examProgress}%
                        </span>
                        </div>

                        <div className="mt-5">
                        <div
                            dir="ltr"
                            className="h-2 overflow-hidden rounded-full bg-[#e8dfd4]"
                        >
                            <div
                            className="h-full rounded-full bg-[#f28c28] transition-all"
                            style={{
                                width: `${examProgress}%`,
                            }}
                            />
                        </div>
                        </div>

                        <div className="mt-5">

                        <p className="mb-2 text-sm font-bold text-[#172033]">
                            الأجزاء الداخلة:
                        </p>

                        {examParts.length > 0 ? (
                            <div className="flex flex-wrap gap-2">

                            {examParts.map(
                                (part) => (
                                <span
                                    key={part.id}
                                    className="rounded-lg bg-[#faf7f2] px-3 py-2 text-xs font-bold text-gray-600"
                                >
                                    {part.title}
                                </span>
                                )
                            )}

                            </div>
                        ) : (
                            <p className="text-xs text-gray-400">
                            لم يتم العثور على الأجزاء
                            المرتبطة.
                            </p>
                        )}
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
        </section>

        );
    }