export default function AddContentModel({
  showAddContent,
  setShowAddContent,
  newContent,
  setNewContent,
  content,
  addContent,
  savingContent,
}) {
  return (
    <div className="font-custom">

    {showAddContent && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 p-4 text-right backdrop-blur-sm"
        >
          <div className="w-full max-w-xl rounded-3xl border border-[#e8dfd4] bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#e8dfd4] p-5">

              <div>
                <h2 className="text-xl font-black text-[#172033]">
                  إضافة{" "}
                  {newContent.type ===
                  "lecture"
                    ? "محاضرة"
                    : "فصل"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  أضف محتوى جديدًا للمادة
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddContent(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f2] text-gray-500 transition hover:bg-[#fff1d6]"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5">

              {/* Type */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  نوع المحتوى
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setNewContent(
                        (prev) => ({
                          ...prev,
                          type: "chapter",
                          parent_id:
                            null,
                        })
                      )
                    }
                    className={`rounded-xl border p-3 font-bold ${
                      newContent.type ===
                      "chapter"
                        ? "border-[#f28c28] bg-[#fff1d6] text-[#172033]"
                        : "border-[#e8dfd4] bg-white text-gray-500"
                    }`}
                  >
                    📚 فصل
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNewContent(
                        (prev) => ({
                          ...prev,
                          type: "lecture",
                        })
                      )
                    }
                    className={`rounded-xl border p-3 font-bold ${
                      newContent.type ===
                      "lecture"
                        ? "border-[#f28c28] bg-[#fff1d6] text-[#172033]"
                        : "border-[#e8dfd4] bg-white text-gray-500"
                    }`}
                  >
                    📖 محاضرة
                  </button>

                </div>
              </div>

              {/* Title */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  عنوان{" "}
                  {newContent.type ===
                  "lecture"
                    ? "المحاضرة"
                    : "الفصل"}
                </label>

                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) =>
                    setNewContent(
                      (prev) => ({
                        ...prev,
                        title:
                          e.target.value,
                      })
                    )
                  }
                  placeholder={
                    newContent.type ===
                    "lecture"
                      ? "مثال: المحاضرة الأولى"
                      : "مثال: الفصل الأول"
                  }
                  className="w-full rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-3 text-right outline-none transition focus:border-[#f28c28]"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  الوصف
                </label>

                <textarea
                  value={
                    newContent.description
                  }
                  onChange={(e) =>
                    setNewContent(
                      (prev) => ({
                        ...prev,
                        description:
                          e.target.value,
                      })
                    )
                  }
                  rows={4}
                  placeholder="اكتب وصفًا مختصرًا للمحتوى..."
                  className="w-full resize-none rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-3 text-right outline-none transition focus:border-[#f28c28]"
                />
              </div>

              {/* Parent */}

              {newContent.type ===
                "lecture" && (
                <div>

                  <label className="mb-2 block text-sm font-bold text-[#172033]">
                    الفصل
                  </label>

                  <select
                    value={
                      newContent.parent_id ||
                      ""
                    }
                    onChange={(e) =>
                      setNewContent(
                        (prev) => ({
                          ...prev,
                          parent_id:
                            e.target.value
                              ? Number(
                                  e.target
                                    .value
                                )
                              : null,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-3 text-right outline-none focus:border-[#f28c28]"
                  >
                    <option value="">
                      اختر الفصل
                    </option>

                    {content
                      .filter(
                        (item) =>
                          item.type ===
                          "chapter"
                      )
                      .map((chapter) => (
                        <option
                          key={chapter.id}
                          value={chapter.id}
                        >
                          {chapter.title}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddContent(false)
                  }
                  className="flex-1 rounded-xl bg-[#f3eee8] px-5 py-3 font-bold text-[#172033]"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  disabled={
                    savingContent ||
                    !newContent.title.trim()
                  }
                  onClick={addContent}
                  className="flex-1 rounded-xl bg-[#f28c28] px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingContent
                    ? "جاري الحفظ..."
                    : "إضافة المحتوى"}
                </button>

              </div>
            </div>
          </div>
        </div>
    )}
    </div>
  );
}