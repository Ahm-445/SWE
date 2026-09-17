export default function AddExamModel({
  showExamModal,
  setShowExamModal,
  examForm,
  setExamForm,
  allLectures,
  contentTree,
  toggleExamPart,
  addExam,
  savingExam,
}) {
  return (
    <div>
{showExamModal && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 p-4 text-right backdrop-blur-sm"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e8dfd4] bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-[#e8dfd4] p-5">

              <div>

                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1d6]">
                  📝
                </div>

                <h2 className="text-xl font-black text-[#172033]">
                  إضافة اختبار
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  حدد اسم الاختبار وتاريخه والأجزاء
                  الداخلة فيه.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowExamModal(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f2] text-gray-500 transition hover:bg-[#fff1d6]"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-5">

              {/* Exam name */}

              <div>

                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  اسم الاختبار
                </label>

                <input
                  type="text"
                  value={examForm.name}
                  onChange={(e) =>
                    setExamForm(
                      (prev) => ({
                        ...prev,
                        name:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="مثال: الاختبار النصفي"
                  className="w-full rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-4 text-right outline-none transition focus:border-[#f28c28]"
                />
              </div>

              {/* Exam date */}

              <div>

                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  تاريخ الاختبار
                </label>

                <input
                  type="date"
                  value={examForm.date}
                  onChange={(e) =>
                    setExamForm(
                      (prev) => ({
                        ...prev,
                        date: e.target.value,
                      })
                    )
                  }
                  dir="ltr"
                  className="w-full rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-4 text-right outline-none transition focus:border-[#f28c28]"
                />

              </div>

              {/* Content selection */}

              <div>

                <div className="mb-3 flex items-center justify-between gap-4">

                  <label className="block text-sm font-bold text-[#172033]">
                    الأجزاء الداخلة في الاختبار
                  </label>

                  <span className="text-xs font-bold text-gray-400">
                    تم اختيار{" "}
                    {
                      examForm
                        .selectedParts
                        .length
                    }
                  </span>
                </div>

                {allLectures.length ===
                0 ? (
                  <div className="rounded-2xl border border-[#e8dfd4] bg-[#faf7f2] p-6 text-center text-sm text-gray-500">
                    أضف محتوى المادة أولًا حتى
                    تتمكن من ربطه بالاختبار.
                  </div>
                ) : (
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-[#e8dfd4] bg-[#faf7f2] p-3">

                    {contentTree.map(
                      (chapter) => (
                        <div
                          key={chapter.id}
                        >

                          <div className="mb-2 rounded-xl bg-white px-3 py-2 font-black text-[#172033]">
                            {chapter.title}
                          </div>

                          <div className="space-y-2 pr-3">

                            {(
                              chapter.children ||
                              []
                            ).map(
                              (lecture) => {

                                const selected =
                                  examForm.selectedParts.some(
                                    (id) =>
                                      String(
                                        id
                                      ) ===
                                      String(
                                        lecture.id
                                      )
                                  );

                                return (
                                  <button
                                    key={
                                      lecture.id
                                    }
                                    type="button"
                                    onClick={() =>
                                      toggleExamPart(
                                        lecture.id
                                      )
                                    }
                                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-right transition ${
                                      selected
                                        ? "border-[#f28c28] bg-[#fff1d6]"
                                        : "border-[#e8dfd4] bg-white hover:border-[#f28c28]"
                                    }`}
                                  >

                                    <span
                                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                                        selected
                                          ? "border-[#f28c28] bg-[#f28c28] text-white"
                                          : "border-[#d9d0c5] bg-white text-transparent"
                                      }`}
                                    >
                                      ✓
                                    </span>

                                    <span className="text-sm font-bold text-[#172033]">
                                      {
                                        lecture.title
                                      }
                                    </span>

                                  </button>
                                );
                              }
                            )}

                          </div>
                        </div>
                      )
                    )}

                  </div>
                )}
              </div>

              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowExamModal(false)
                  }
                  className="flex-1 rounded-xl bg-[#f3eee8] px-5 py-4 font-bold text-[#172033]"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  disabled={
                    savingExam ||
                    !examForm.name.trim() ||
                    !examForm.date ||
                    examForm.selectedParts
                      .length === 0
                  }
                  onClick={addExam}
                  className="flex-1 rounded-xl bg-[#f28c28] px-5 py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingExam
                    ? "جاري الحفظ..."
                    : "إضافة الاختبار"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    );
}