import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseDetail, createCourse, updateCourse } from "../../api/courses";

const CATEGORIES = ["development", "design", "business", "marketing", "other"];
const LEVELS = ["beginner", "intermediate", "advanced"];

const emptyForm = {
  title: "",
  description: "",
  price: 0,
  currency: "INR",
  category: "development",
  level: "beginner",
  tags: "",
  isPublished: false,
};

const inputClass =
  "w-full border border-ink/10 rounded-xl px-3 py-2 font-body text-sm bg-white focus:border-primary outline-none transition-colors";
const labelClass = "font-body text-sm font-semibold text-ink block mb-1.5";

const CourseForm = () => {
  const { courseId } = useParams();
  const isEdit = Boolean(courseId);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const course = await getCourseDetail(courseId);
        setForm({
          title: course.title || "",
          description: course.description || "",
          price: course.price ?? 0,
          currency: course.currency || "INR",
          category: course.category || "development",
          level: course.level || "beginner",
          tags: (course.tags || []).join(", "),
          isPublished: course.isPublished || false,
        });
      } catch (err) {
        setError("Could not load this course.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, isEdit]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("currency", form.currency);
    formData.append("category", form.category);
    formData.append("level", form.level);
    formData.append("tags", form.tags);
    if (isEdit) formData.append("isPublished", form.isPublished);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    try {
      if (isEdit) {
        await updateCourse(courseId, formData);
        navigate("/admin/courses");
      } else {
        const course = await createCourse(formData);
        navigate(`/admin/courses/${course._id}/manage`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save this course.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="max-w-6xl mx-auto px-4 py-16 font-body text-brand-muted">Loading…</div>;

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <span className="inline-block text-sm font-semibold text-primary bg-lavender px-4 py-1.5 rounded-full mb-5">
          Admin
        </span>
        <h1 className="font-heading font-bold text-3xl text-ink mb-8">
          {isEdit ? "Edit Course" : "New Course"}
        </h1>

        {error && <p className="font-body text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-5">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" value={form.title} onChange={handleChange("title")} className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              rows={4}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (in paise, 0 = free)</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange("price")}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <input type="text" value={form.currency} onChange={handleChange("currency")} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={handleChange("category")} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <select value={form.level} onChange={handleChange("level")} className={inputClass}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={handleChange("tags")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Thumbnail</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 font-body text-sm font-semibold text-ink">
              <input type="checkbox" checked={form.isPublished} onChange={handleChange("isPublished")} />
              Published (visible to students)
            </label>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-primary to-royal-purple text-white rounded-full font-body font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
