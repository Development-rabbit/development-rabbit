import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getCourseDetail,
  createModule,
  deleteModule,
  reorderModules,
  createContent,
  updateContent,
  deleteContent,
  reorderContent,
  retryContentUpload,
  getContent,
} from "../../api/courses";

const CONTENT_TYPES = ["video", "note", "quiz"];

const emptyContentForm = {
  type: "video",
  title: "",
  description: "",
  isDemo: false,
  duration: "",
  videoUrl: "",
  body: "",
  questionsJson: '[\n  {\n    "questionText": "",\n    "options": ["", ""],\n    "correctOptionIndex": 0,\n    "explanation": ""\n  }\n]',
};

const AddContentForm = ({ courseId, moduleId, onCreated }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyContentForm);
  const [file, setFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("isDemo", form.isDemo);
    if (file) formData.append("media", file);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    if (form.type === "video") {
      formData.append("duration", form.duration);
      if (form.videoUrl) formData.append("videoUrl", form.videoUrl);
    } else if (form.type === "note") {
      formData.append("body", form.body);
    } else if (form.type === "quiz") {
      try {
        JSON.parse(form.questionsJson);
      } catch (err) {
        setError("Questions must be valid JSON.");
        setSubmitting(false);
        return;
      }
      formData.append("questions", form.questionsJson);
    }

    try {
      await createContent(courseId, moduleId, formData);
      setForm(emptyContentForm);
      setFile(null);
      setThumbnailFile(null);
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add content.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-body text-sm font-semibold text-primary hover:underline mt-2"
      >
        + Add content
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 border border-ink/10 rounded-xl p-3 space-y-3 bg-lavender/40">
      {error && <p className="text-red-600 text-xs font-body">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <select
          value={form.type}
          onChange={handleChange("type")}
          className="border border-ink/10 rounded-xl px-2 py-1.5 text-sm font-body bg-white focus:border-primary outline-none"
        >
          {CONTENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs font-semibold text-ink font-body">
          <input type="checkbox" checked={form.isDemo} onChange={handleChange("isDemo")} />
          Demo (free preview)
        </label>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={handleChange("title")}
        className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange("description")}
        rows={2}
        className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
      />

      {form.type === "video" && (
        <>
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <input
            type="text"
            placeholder="…or paste a video URL instead of uploading"
            value={form.videoUrl}
            onChange={handleChange("videoUrl")}
            className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
          />
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={form.duration}
            onChange={handleChange("duration")}
            className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
            required
          />
          <div>
            <label className="text-xs text-brand-muted block mb-1 font-body">
              Thumbnail (optional — Bunny auto-generates one if you skip this)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
          </div>
        </>
      )}

      {form.type === "note" && (
        <>
          <textarea
            placeholder="Note body"
            value={form.body}
            onChange={handleChange("body")}
            rows={4}
            className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
          />
          <div>
            <label className="text-xs text-brand-muted block mb-1 font-body">Optional attachment</label>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </>
      )}

      {form.type === "quiz" && (
        <div>
          <label className="text-xs text-brand-muted block mb-1 font-body">
            Questions (JSON array of {"{questionText, options[], correctOptionIndex, explanation}"})
          </label>
          <textarea
            value={form.questionsJson}
            onChange={handleChange("questionsJson")}
            rows={8}
            className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-xs font-mono bg-white focus:border-primary outline-none"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="text-sm font-semibold text-white bg-primary hover:opacity-90 transition-opacity px-3 py-1.5 rounded-full disabled:opacity-60 font-body"
        >
          {submitting ? "Adding…" : "Add"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm font-semibold text-brand-muted hover:text-ink px-3 py-1.5 font-body transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// The course-detail list only ever carries structure-only content fields
// (no videoUrl/body/questions), so editing fetches the full payload via
// GET /content/:contentId (allowed for admins regardless of purchase/demo
// status) and pre-fills the form from that instead.
const EditContentForm = ({ courseId, moduleId, item, onSaved, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [full, setFull] = useState(null);
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getContent(item._id)
      .then((data) => {
        if (cancelled) return;
        setFull(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
          duration: data.duration ?? "",
          videoUrl: "",
          body: data.body || "",
          questionsJson: data.questions ? JSON.stringify(data.questions, null, 2) : "[]",
        });
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load this content for editing.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [item._id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (file) formData.append("media", file);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    if (item.type === "video") {
      if (form.duration !== "") formData.append("duration", form.duration);
      if (form.videoUrl) formData.append("videoUrl", form.videoUrl);
    } else if (item.type === "note") {
      formData.append("body", form.body);
    } else if (item.type === "quiz") {
      try {
        JSON.parse(form.questionsJson);
      } catch (err) {
        setError("Questions must be valid JSON.");
        setSubmitting(false);
        return;
      }
      formData.append("questions", form.questionsJson);
    }

    try {
      await updateContent(courseId, moduleId, item._id, formData);
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update content.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-xs text-brand-muted mt-2 font-body">Loading…</p>;
  if (loadError) return <p className="text-xs text-red-600 mt-2 font-body">{loadError}</p>;

  return (
    <form onSubmit={handleSubmit} className="mt-3 border border-ink/10 rounded-xl p-3 space-y-3 bg-lavender/40">
      {error && <p className="text-red-600 text-xs font-body">{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={handleChange("title")}
        className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange("description")}
        rows={2}
        className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
      />

      {item.type === "video" && (
        <>
          {full?.videoUrl && (
            <p className="text-xs text-brand-muted truncate font-body">
              Current video:{" "}
              <a href={full.videoUrl} target="_blank" rel="noreferrer" className="underline">
                {full.videoUrl}
              </a>
            </p>
          )}
          <label className="text-xs text-brand-muted block mb-1 font-body">Replace video (optional)</label>
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <input
            type="text"
            placeholder="…or paste a new video URL"
            value={form.videoUrl}
            onChange={handleChange("videoUrl")}
            className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
          />
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={form.duration}
            onChange={handleChange("duration")}
            className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
          />
        </>
      )}

      {item.type === "note" && (
        <>
          <textarea
            placeholder="Note body"
            value={form.body}
            onChange={handleChange("body")}
            rows={4}
            className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
          />
          {full?.attachmentUrl && (
            <p className="text-xs text-brand-muted truncate font-body">
              Current attachment:{" "}
              <a href={full.attachmentUrl} target="_blank" rel="noreferrer" className="underline">
                {full.attachmentName || full.attachmentUrl}
              </a>
            </p>
          )}
          <div>
            <label className="text-xs text-brand-muted block mb-1 font-body">Replace attachment (optional)</label>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </>
      )}

      {item.type === "quiz" && (
        <div>
          <label className="text-xs text-brand-muted block mb-1 font-body">
            Questions (JSON array of {"{questionText, options[], correctOptionIndex, explanation}"})
          </label>
          <textarea
            value={form.questionsJson}
            onChange={handleChange("questionsJson")}
            rows={8}
            className="w-full border border-ink/10 rounded-xl px-3 py-1.5 text-xs font-mono bg-white focus:border-primary outline-none"
          />
        </div>
      )}

      <div>
        <label className="text-xs text-brand-muted block mb-1 font-body">
          {item.type === "video" ? "Replace thumbnail (optional)" : "Thumbnail (optional)"}
        </label>
        <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="text-sm font-semibold text-white bg-primary hover:opacity-90 transition-opacity px-3 py-1.5 rounded-full disabled:opacity-60 font-body"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-brand-muted hover:text-ink px-3 py-1.5 font-body transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const CourseManage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [orderDrafts, setOrderDrafts] = useState({});
  const [retryingId, setRetryingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setError("");
    try {
      const data = await getCourseDetail(courseId);
      setCourse(data);
      const drafts = {};
      data.modules?.forEach((m) => {
        drafts[m._id] = m.order;
        m.content.forEach((c) => {
          drafts[c._id] = c.order;
        });
      });
      setOrderDrafts(drafts);
    } catch (err) {
      setError("Could not load this course.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    try {
      await createModule(courseId, { title: newModuleTitle.trim() });
      setNewModuleTitle("");
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Could not add module.");
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Delete this module and all its content?")) return;
    try {
      await deleteModule(courseId, moduleId);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Could not delete module.");
    }
  };

  const handleSaveModuleOrder = async () => {
    const items = course.modules.map((m) => ({ id: m._id, order: Number(orderDrafts[m._id] ?? m.order) }));
    try {
      await reorderModules(courseId, items);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Could not save module order.");
    }
  };

  const handleSaveContentOrder = async (moduleId, content) => {
    const items = content.map((c) => ({ id: c._id, order: Number(orderDrafts[c._id] ?? c.order) }));
    try {
      await reorderContent(courseId, moduleId, items);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Could not save content order.");
    }
  };

  const handleToggleFlag = async (moduleId, content, field) => {
    const formData = new FormData();
    formData.append(field, !content[field]);
    try {
      await updateContent(courseId, moduleId, content._id, formData);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Could not update content.");
    }
  };

  const handleRetryUpload = async (moduleId, contentId) => {
    setRetryingId(contentId);
    try {
      await retryContentUpload(courseId, moduleId, contentId);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Retry failed — the video is still saved, you can try again.");
    } finally {
      setRetryingId(null);
    }
  };

  const handleDeleteContent = async (moduleId, contentId) => {
    if (!window.confirm("Delete this content item?")) return;
    try {
      await deleteContent(courseId, moduleId, contentId);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Could not delete content.");
    }
  };

  if (loading)
    return <div className="max-w-6xl mx-auto px-4 py-16 font-body text-brand-muted">Loading…</div>;
  if (error || !course)
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 font-body text-red-600">{error || "Course not found"}</div>
    );

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <Link to="/admin/courses" className="font-body text-sm font-semibold text-primary hover:underline">
          ← All courses
        </Link>
        <h1 className="font-heading font-bold text-3xl text-ink mt-3 mb-1">{course.title}</h1>
        <p className="font-body text-sm text-brand-muted mb-10">
          Manage modules and content, and set what's a free preview.
        </p>

        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg text-ink">Modules</h2>
            <button
              onClick={handleSaveModuleOrder}
              className="font-body text-sm font-semibold text-ink/70 hover:text-ink border border-ink/10 rounded-full px-3 py-1.5 transition-colors"
            >
              Save Module Order
            </button>
          </div>

          <div className="flex flex-col gap-6 mb-8">
            {course.modules?.map((module) => (
              <div key={module._id} className="border border-ink/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    value={orderDrafts[module._id] ?? module.order}
                    onChange={(e) => setOrderDrafts((prev) => ({ ...prev, [module._id]: e.target.value }))}
                    className="w-16 border border-ink/10 rounded-xl px-2 py-1 text-sm font-body bg-white focus:border-primary outline-none"
                    title="Order"
                  />
                  <p className="font-heading font-bold text-ink flex-1">{module.title}</p>
                  <button
                    onClick={() => handleDeleteModule(module._id)}
                    className="font-body text-sm font-semibold text-red-600 hover:underline"
                  >
                    Delete module
                  </button>
                </div>

                {module.content.length > 0 && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => handleSaveContentOrder(module._id, module.content)}
                      className="font-body text-xs font-semibold text-brand-muted hover:text-ink transition-colors"
                    >
                      Save content order
                    </button>
                  </div>
                )}

                <ul className="flex flex-col gap-2">
                  {module.content.map((item) => (
                    <li key={item._id} className="border border-ink/10 rounded-xl px-3 py-2 text-sm">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={orderDrafts[item._id] ?? item.order}
                        onChange={(e) => setOrderDrafts((prev) => ({ ...prev, [item._id]: e.target.value }))}
                        className="w-14 border border-ink/10 rounded-xl px-2 py-1 text-xs font-body bg-white focus:border-primary outline-none"
                        title="Order"
                      />
                      <span className="font-body text-xs uppercase text-brand-muted w-12 shrink-0">{item.type}</span>
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="w-12 h-8 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-8 rounded-lg bg-mist shrink-0" />
                      )}
                      <span className="flex-1 font-body text-ink/80">{item.title}</span>
                      {item.type === "video" && item.uploadStatus === "failed" && (
                        <>
                          <span className="font-body text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-700">
                            Upload failed
                          </span>
                          <button
                            onClick={() => handleRetryUpload(module._id, item._id)}
                            disabled={retryingId === item._id}
                            className="font-body text-xs font-semibold text-primary hover:underline disabled:opacity-60"
                          >
                            {retryingId === item._id ? "Retrying…" : "Retry upload"}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleToggleFlag(module._id, item, "isDemo")}
                        className={`font-body text-xs font-semibold px-2 py-1 rounded-full ${
                          item.isDemo ? "bg-green-50 text-green-700" : "bg-mist text-brand-muted"
                        }`}
                      >
                        {item.isDemo ? "Demo" : "Locked"}
                      </button>
                      <button
                        onClick={() => handleToggleFlag(module._id, item, "isPublished")}
                        className={`font-body text-xs font-semibold px-2 py-1 rounded-full ${
                          item.isPublished ? "bg-lavender text-primary" : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Draft"}
                      </button>
                      <button
                        onClick={() => setEditingId(editingId === item._id ? null : item._id)}
                        className="font-body text-xs font-semibold text-ink/70 hover:underline"
                      >
                        {editingId === item._id ? "Close" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDeleteContent(module._id, item._id)}
                        className="font-body text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    {editingId === item._id && (
                      <EditContentForm
                        courseId={courseId}
                        moduleId={module._id}
                        item={item}
                        onSaved={() => {
                          setEditingId(null);
                          load();
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    )}
                    </li>
                  ))}
                </ul>

                <AddContentForm courseId={courseId} moduleId={module._id} onCreated={load} />
              </div>
            ))}
            {(!course.modules || course.modules.length === 0) && (
              <p className="font-body text-brand-muted text-sm">No modules yet — add one below.</p>
            )}
          </div>

          <form onSubmit={handleAddModule} className="flex gap-2">
            <input
              type="text"
              placeholder="New module title"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="flex-1 border border-ink/10 rounded-xl px-3 py-2 text-sm font-body bg-white focus:border-primary outline-none transition-colors"
            />
            <button
              type="submit"
              className="font-body text-sm font-semibold text-white bg-gradient-to-r from-primary to-royal-purple hover:opacity-90 transition-opacity px-4 py-2 rounded-full"
            >
              + Add Module
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseManage;
