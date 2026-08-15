import { Link } from "react-router-dom";

// price is stored in the smallest currency unit (paise for INR)
const formatPrice = (price, currency) => {
  if (!price) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
  }).format(price / 100);
};

const StarIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor">
    <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
  </svg>
);

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/courses/${course.slug || course._id}`}
      className="group block rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video bg-gradient-to-br from-lavender via-white to-primary/10 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-muted text-sm font-body">
            No thumbnail
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-primary mb-1.5">
          {course.category}
        </p>
        <h3 className="font-heading font-bold text-ink line-clamp-2 mb-1">{course.title}</h3>
        <p className="font-body text-sm text-brand-muted mb-4">{course.instructor?.name}</p>
        <div className="flex items-center justify-between text-sm pt-4 border-t border-ink/10">
          <span className="flex items-center gap-1 font-body text-ink/80">
            <StarIcon className="w-3.5 h-3.5 text-primary" />
            {(course.rating ?? 0).toFixed(1)}{" "}
            <span className="text-brand-muted">({course.reviewsCount || 0})</span>
          </span>
          <span className="font-heading font-bold text-ink">{formatPrice(course.price, course.currency)}</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
