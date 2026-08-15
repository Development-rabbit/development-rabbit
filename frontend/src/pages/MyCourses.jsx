import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyPurchases } from "../api/purchases";
import ContinueLearningSection from "../components/ContinueLearningSection";

const formatPrice = (amount, currency) => {
  if (!amount) return "Free";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR" }).format(
    amount / 100
  );
};

const STATUS_STYLES = {
  COMPLETED: "bg-green-50 text-green-700",
  CREATED: "bg-yellow-50 text-yellow-700",
  FAILED: "bg-red-50 text-red-700",
};

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MyCourses = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyPurchases({ status: "COMPLETED" });
        setPurchases(data.purchases);
      } catch (err) {
        setError("Could not load your courses.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <span className="inline-block text-sm font-semibold text-primary bg-lavender px-4 py-1.5 rounded-full mb-5">
          Your Library
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink mb-10">My Courses</h1>

        <ContinueLearningSection />

        {loading && <p className="font-body text-brand-muted">Loading…</p>}
        {error && <p className="font-body text-red-600">{error}</p>}
        {!loading && !error && purchases.length === 0 && (
          <div className="text-center py-16 bg-lavender/40 rounded-2xl">
            <p className="font-body text-brand-muted mb-4">You haven't purchased any courses yet.</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 font-body font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              Browse courses
              <ArrowIcon />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {purchases.map((purchase) => (
            <Link
              key={purchase._id}
              to={`/courses/${purchase.course?.slug || purchase.course?._id}`}
              className="flex gap-4 bg-white border border-ink/10 rounded-2xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="w-24 h-16 rounded-xl bg-gradient-to-br from-lavender via-white to-primary/10 overflow-hidden shrink-0">
                {purchase.course?.thumbnail && (
                  <img
                    src={purchase.course.thumbnail}
                    alt={purchase.course.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-ink mb-1 truncate">{purchase.course?.title}</p>
                <span
                  className={`inline-block font-body text-xs font-semibold px-2 py-0.5 rounded-full ${
                    STATUS_STYLES[purchase.status] || "bg-mist text-brand-muted"
                  }`}
                >
                  {purchase.status}
                </span>
                <p className="font-body text-sm text-brand-muted mt-1.5">
                  {formatPrice(purchase.amount, purchase.currency)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
