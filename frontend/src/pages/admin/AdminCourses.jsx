import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, deleteCourse, updateCourse } from "../../api/courses";

const formatPrice = (price, currency) => {
  if (!price) return "Free";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR" }).format(
    price / 100
  );
};

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCourses({ limit: 100 });
      setCourses(data.courses);
    } catch (err) {
      setError("Could not load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleTogglePublish = async (course) => {
    setTogglingId(course._id);
    try {
      const formData = new FormData();
      formData.append("isPublished", !course.isPublished);
      const updated = await updateCourse(course._id, formData);
      setCourses((prev) => prev.map((c) => (c._id === course._id ? updated : c)));
    } catch (err) {
      alert(err?.response?.data?.message || "Could not update publish status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setDeletingId(course._id);
    try {
      await deleteCourse(course._id);
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
    } catch (err) {
      alert(err?.response?.data?.message || "Could not delete this course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-block text-sm font-semibold text-primary bg-lavender px-4 py-1.5 rounded-full mb-5">
              Admin
            </span>
            <h1 className="font-heading font-bold text-3xl text-ink">Manage Courses</h1>
          </div>
          <Link
            to="/admin/courses/new"
            className="font-body text-sm font-semibold text-white bg-gradient-to-r from-primary to-royal-purple hover:opacity-90 transition-opacity px-5 py-2.5 rounded-full"
          >
            + New Course
          </Link>
        </div>

        {loading && <p className="font-body text-brand-muted">Loading…</p>}
        {error && <p className="font-body text-red-600">{error}</p>}

        <div className="border border-ink/10 rounded-2xl overflow-hidden divide-y divide-ink/10">
          {courses.map((course) => (
            <div key={course._id} className="flex items-center gap-4 p-4">
              <div className="w-20 h-14 rounded-xl bg-gradient-to-br from-lavender via-white to-primary/10 overflow-hidden shrink-0">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-ink truncate">{course.title}</p>
                <p className="font-body text-sm text-brand-muted">
                  {formatPrice(course.price, course.currency)} · {course.category} ·{" "}
                  <span className={course.isPublished ? "text-green-600" : "text-yellow-600"}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/admin/courses/${course._id}/manage`}
                  className="font-body text-sm font-semibold text-primary hover:underline px-2 py-1"
                >
                  Manage
                </Link>
                <Link
                  to={`/admin/courses/${course._id}/edit`}
                  className="font-body text-sm font-semibold text-ink/70 hover:underline px-2 py-1"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleTogglePublish(course)}
                  disabled={togglingId === course._id}
                  className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full disabled:opacity-50 ${
                    course.isPublished ? "bg-yellow-50 text-yellow-700" : "bg-lavender text-primary"
                  }`}
                >
                  {togglingId === course._id ? "Saving…" : course.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(course)}
                  disabled={deletingId === course._id}
                  className="font-body text-sm font-semibold text-red-600 hover:underline px-2 py-1 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!loading && courses.length === 0 && (
            <p className="font-body text-brand-muted p-4">No courses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
