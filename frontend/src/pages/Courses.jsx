import { useEffect, useState } from "react";
import { getCourses } from "../api/courses";
import CourseCard from "../components/CourseCard";

const CATEGORIES = ["all", "development", "design", "business", "marketing", "other"];

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="9" cy="9" r="6" />
    <path d="m17 17-4-4" strokeLinecap="round" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M16 10H4M9 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCourses({
          page,
          limit: 12,
          category,
          search: search || undefined,
        });
        if (!cancelled) {
          setCourses(data.courses);
          setPagination(data.pagination);
        }
      } catch (err) {
        if (!cancelled) setError("Could not load courses.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCourses();
    return () => {
      cancelled = true;
    };
  }, [page, category, search]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-t from-lavender/50 to-white">
      <div className="relative max-w-6xl mx-auto pt-5 sm:pt-8 px-4 sm:px-6  pb-16 sm:pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            
            <h1 className="font-heading font-bold text-3xl sm:text-4xl leading-tight text-ink">
              Browse <span className="text-primary">All Courses</span>
            </h1>
            <p className="font-body text-brand-muted mt-2">
              Pick a track and start prompting, directing, and editing with AI today.
            </p>
          </div>

      
        </div>

        

        {loading && <p className="font-body text-brand-muted">Loading courses…</p>}
        {error && <p className="font-body text-red-600">{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <p className="font-body text-brand-muted">No courses found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-14">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
              className="w-11 h-11 rounded-full bg-white border border-ink/10 text-ink flex items-center justify-center hover:border-primary/40 transition-colors disabled:opacity-30 disabled:hover:border-ink/10"
            >
              <ArrowLeftIcon />
            </button>
            <span className="font-body text-sm text-brand-muted">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
              className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              <ArrowIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
