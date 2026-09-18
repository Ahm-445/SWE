import { coursesByLevel } from "../../Pages/Dashboard";

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function normalizeContent(items = []) {
  return items.map((item, index) => ({
    id: item.id,
    course_id: item.course_id,
    user_id: item.user_id,
    parent_id: item.parent_id ?? null,
    type: item.type || "chapter",
    title: item.title || "بدون عنوان",
    description: item.description || "",
    order_index:
      typeof item.order_index === "number"
        ? item.order_index
        : index,
    is_default: Boolean(item.is_default),
  }));
}

export function buildTree(items) {
  const normalized = normalizeContent(items);

  const chapters = normalized
    .filter((item) => item.parent_id === null)
    .sort((a, b) => a.order_index - b.order_index);

  return chapters.map((chapter) => ({
    ...chapter,
    children: normalized
      .filter(
        (item) =>
          String(item.parent_id) === String(chapter.id)
      )
      .sort((a, b) => a.order_index - b.order_index),
  }));
}

export function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getCourseFromCatalog(courseId) {
  for (const level of Object.keys(coursesByLevel || {})) {
    const courses = coursesByLevel[level] || [];

    const found = courses.find(
      (course) =>
        String(course.id) === String(courseId)
    );

    if (found) return found;
  }

  return null;
}


