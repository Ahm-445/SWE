   export default function Content({
      contentTree,
      completedItems,
      expandedChapters,
      toggleChapter,
      openAddContent,
      renderLecture,
    }) {
      return (
   <section className="mb-8 font-custom">

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-black text-[#172033]">
                محتوى المادة
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                الفصول والمحاضرات الخاصة بالمادة
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                openAddContent(
                  null,
                  "chapter"
                )
              }
              className="rounded-xl bg-[#f28c28] px-5 py-3 font-bold text-white transition hover:opacity-90"
            >
              + إضافة فصل
            </button>
          </div>

          {contentTree.length === 0 ? (
            <div className="rounded-3xl border border-[#e8dfd4] bg-white p-10 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1d6] text-3xl">
                📖
              </div>

              <h3 className="text-lg font-black text-[#172033]">
                لا يوجد محتوى حتى الآن
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                أضف أول فصل للمادة للبدء.
              </p>

              <button
                type="button"
                onClick={() =>
                  openAddContent(
                    null,
                    "chapter"
                  )
                }
                className="mt-5 rounded-xl bg-[#172033] px-5 py-3 font-bold text-white"
              >
                إضافة فصل
              </button>
            </div>
          ) : (
            <div
              dir="rtl"
              className="space-y-4"
            >
              {contentTree.map(
                (chapter, chapterIndex) => {

                  const isExpanded =
                    expandedChapters[
                      chapter.id
                    ] ?? true;

                  const chapterLectures =
                    chapter.children || [];

                  const chapterCompleted =
                    chapterLectures.filter(
                      (lecture) =>
                        completedItems[
                          lecture.id
                        ]
                    ).length;

                  return (
                    <div
                      key={chapter.id}
                      className="overflow-hidden rounded-3xl border border-[#e8dfd4] bg-white shadow-sm"
                    >

                      {/* Chapter header */}

                      <div
                        dir="rtl"
                        className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            toggleChapter(
                              chapter.id
                            )
                          }
                          className="flex min-w-0 items-center gap-4 text-right"
                        >

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1d6] font-black text-[#f28c28]">
                            {chapterIndex + 1}
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-lg font-black text-[#172033]">
                              {chapter.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {chapterCompleted} من{" "}
                              {
                                chapterLectures.length
                              }{" "}
                              مكتملة
                            </p>
                          </div>
                        </button>

                        <div className="flex flex-wrap items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openAddContent(
                                chapter.id,
                                "lecture"
                              )
                            }
                            className="rounded-xl border border-[#e8dfd4] bg-[#faf7f2] px-4 py-2 text-sm font-bold text-[#172033] transition hover:border-[#f28c28]"
                          >
                            + إضافة محاضرة
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleChapter(
                                chapter.id
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f2] text-[#172033]"
                          >
                            {isExpanded
                              ? "⌃"
                              : "⌄"}
                          </button>
                        </div>
                      </div>

                      {/* Description */}

                      {chapter.description && (
                        <div className="border-t border-[#e8dfd4] px-5 py-4 text-sm leading-7 text-gray-500">
                          {chapter.description}
                        </div>
                      )}

                      {/* Lectures */}

                      {isExpanded && (
                        <div className="border-t border-[#e8dfd4] bg-[#faf7f2] p-4">

                          {chapterLectures.length ===
                          0 ? (
                            <div className="rounded-2xl border border-dashed border-[#d9d0c5] bg-white p-6 text-center">

                              <p className="text-sm text-gray-500">
                                لا توجد محاضرات في هذا
                                الفصل.
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  openAddContent(
                                    chapter.id,
                                    "lecture"
                                  )
                                }
                                className="mt-3 text-sm font-bold text-[#f28c28]"
                              >
                                + إضافة محاضرة
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {chapterLectures.map(
                                renderLecture
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      );
    }