import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseDetail, toggleCourseLike, getCourseReviews, addCourseReview } from "../api/courses";
import { initiatePurchase, verifyPurchase } from "../api/purchases";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const formatPrice = (price, currency) => {
  if (!price) return "Free";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR" }).format(
    price / 100
  );
};

const CONTENT_TYPE_LABEL = { video: "Video", note: "Notes", quiz: "Quiz" };

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M16 10H4M9 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor">
    <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
  </svg>
);

const LockIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
  </svg>
);

const PlayCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 9.5v5l4.5-2.5Z" strokeLinejoin="round" />
  </svg>
);

const HeartIcon = ({ className = "w-4 h-4", filled = false }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
    <path d="M12 20.5s-7-4.4-9.5-8.7C.9 8.8 2 5.5 5 4.6c2-.6 3.9.2 5 1.9 1.1-1.7 3-2.5 5-1.9 3 .9 4.1 4.2 2.5 7.2C19 16.1 12 20.5 12 20.5Z" strokeLinejoin="round" />
  </svg>
);

const CartAddIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3h2l2.3 11.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart, isInCart } = useCart();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const loadCourse = useCallback(async () => {
    setError("");
    try {
      const data = await getCourseDetail(courseId);
      setCourse(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Course not found");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const loadReviews = useCallback(async () => {
    try {
      const data = await getCourseReviews(courseId);
      setReviews(data.reviews);
    } catch (err) {
      // non-fatal
    }
  }, [courseId]);

  useEffect(() => {
    setLoading(true);
    loadCourse();
    loadReviews();
  }, [loadCourse, loadReviews]);

  const handleLike = async () => {
    if (!isAuthenticated) return navigate("/login");
    const result = await toggleCourseLike(course._id);
    setCourse((prev) => ({
      ...prev,
      isLikedByUser: result.isLiked,
      likesCount: (prev.likesCount || 0) + (result.isLiked ? 1 : -1),
    }));
  };

  const handleBuy = async () => {
    if (!isAuthenticated) return navigate("/login");
    setPurchaseError("");
    setPurchasing(true);
    try {
      const result = await initiatePurchase(course._id);

      if (result.instant) {
        await loadCourse();
        setPurchasing(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setPurchaseError("Could not load the payment gateway. Please try again.");
        setPurchasing(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: result.keyId,
        amount: result.amount,
        currency: result.currency,
        order_id: result.orderId,
        name: course.title,
        description: "Course purchase",
        prefill: { name: user?.name, email: user?.email },
        handler: async (response) => {
          try {
            await verifyPurchase(course._id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await loadCourse();
          } catch (err) {
            setPurchaseError("Payment verification failed. Please contact support.");
          } finally {
            setPurchasing(false);
          }
        },
        modal: {
          ondismiss: () => setPurchasing(false),
        },
      });
      razorpay.open();
    } catch (err) {
      setPurchaseError(err?.response?.data?.message || "Could not start checkout.");
      setPurchasing(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSubmitting(true);
    try {
      await addCourseReview(course._id, reviewForm);
      await Promise.all([loadCourse(), loadReviews()]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err?.response?.data?.message || "Could not submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 font-body text-brand-muted">Loading…</div>
    );
  if (error || !course) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <p className="font-body text-red-600 mb-4">{error || "Course not found"}</p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 font-body text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          <ArrowLeftIcon />
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 font-body text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          <ArrowLeftIcon />
          Back to courses
        </Link>

        <div className="mt-6 grid lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-2">
            <span className="inline-block font-body text-xs font-semibold uppercase tracking-wide text-primary bg-lavender px-3 py-1 rounded-full mb-4">
              {course.category} · {course.level}
            </span>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="font-body text-brand-muted mb-5 whitespace-pre-line">{course.description}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-sm text-brand-muted mb-8 pb-8 border-b border-ink/10">
              <span>By {course.instructor?.name}</span>
              <span className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-primary" />
                {(course.rating ?? 0).toFixed(1)} ({course.reviewsCount || 0} reviews)
              </span>
              <span>{course.enrollmentsCount || 0} enrolled</span>
            </div>

            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full rounded-2xl mb-10 aspect-video object-cover"
              />
            )}

            <h2 className="font-heading font-bold text-xl text-ink mb-5">Course Content</h2>
            <div className="flex flex-col gap-4 mb-12">
              {(!course.modules || course.modules.length === 0) && (
                <p className="font-body text-brand-muted text-sm">No modules yet.</p>
              )}
              {course.modules?.map((module) => (
                <div key={module._id} className="border border-ink/10 rounded-2xl overflow-hidden">
                  <div className="bg-lavender/50 px-5 py-3 font-heading font-bold text-ink">{module.title}</div>
                  <ul className="divide-y divide-ink/10">
                    {module.content.map((item) => {
                      const locked = !item.isDemo && !course.isEnrolled;
                      const isDone = item.type === "video" ? item.isCompleted : item.isViewed;
                      const inProgress =
                        item.type === "video" && !item.isCompleted && item.watchedSeconds > 0 && item.duration > 0;
                      const progressPercent = inProgress
                        ? Math.min(100, Math.round((item.watchedSeconds / item.duration) * 100))
                        : 0;
                      const row = (
                        <div className="flex items-center justify-between px-5 py-3.5 font-body text-sm">
                          <span className="flex items-center gap-3 text-ink min-w-0">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt=""
                                className="w-14 h-9 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <span className="text-brand-muted uppercase text-xs w-12 shrink-0">
                                {CONTENT_TYPE_LABEL[item.type]}
                              </span>
                            )}
                            <span className={`truncate ${isDone ? "text-brand-muted" : ""}`}>
                              {isDone && "✓ "}
                              {item.title}
                            </span>
                            {inProgress && (
                              <span className="text-xs font-semibold text-primary bg-lavender px-2 py-0.5 rounded-full shrink-0">
                                {progressPercent}%
                              </span>
                            )}
                            {item.isDemo && (
                              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                Demo
                              </span>
                            )}
                          </span>
                          <span className="text-brand-muted shrink-0 ml-3">
                            {locked ? <LockIcon /> : <PlayCircleIcon className="text-primary" />}
                          </span>
                        </div>
                      );
                      return (
                        <li key={item._id}>
                          {locked ? (
                            <div className="opacity-50 cursor-not-allowed">{row}</div>
                          ) : (
                            <Link to={`/content/${item._id}`} className="block hover:bg-lavender/30 transition-colors">
                              {row}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="font-heading font-bold text-xl text-ink mb-5">Reviews</h2>
            {isAuthenticated && course.isEnrolled && (
              <form onSubmit={handleReviewSubmit} className="mb-8 bg-lavender/40 rounded-2xl p-5">
                {reviewError && <p className="font-body text-red-600 text-sm mb-2">{reviewError}</p>}
                <div className="flex items-center gap-2 mb-3">
                  <label className="font-body text-sm font-semibold text-ink">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                    className="border border-ink/10 rounded-lg px-2 py-1 text-sm font-body bg-white focus:border-primary outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts…"
                  className="w-full border border-ink/10 rounded-xl px-3 py-2 text-sm font-body mb-3 bg-white focus:border-primary outline-none"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="font-body text-sm font-semibold text-white bg-primary hover:opacity-90 transition-opacity px-5 py-2 rounded-full disabled:opacity-60"
                >
                  {reviewSubmitting ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            )}
            {isAuthenticated && !course.isEnrolled && (
              <p className="font-body text-sm text-brand-muted mb-6">Purchase this course to leave a review.</p>
            )}
            <div className="flex flex-col gap-4">
              {reviews.length === 0 && <p className="font-body text-brand-muted text-sm">No reviews yet.</p>}
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-ink/10 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-bold text-ink text-sm">{review.user?.name}</span>
                    <span className="flex items-center gap-0.5 text-primary">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <StarIcon key={i} className="w-3.5 h-3.5" />
                      ))}
                    </span>
                  </div>
                  {review.comment && <p className="font-body text-brand-muted text-sm">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-lavender/40 rounded-2xl p-6 sticky top-24">
              <p className="font-heading font-bold text-3xl text-ink mb-4">
                {formatPrice(course.price, course.currency)}
              </p>

              {purchaseError && <p className="font-body text-red-600 text-sm mb-3">{purchaseError}</p>}

              {course.isEnrolled ? (
                <div className="text-center text-green-700 bg-green-50 rounded-xl py-3 font-body font-semibold text-sm mb-3">
                  ✓ You're enrolled
                </div>
              ) : (
                <>
                  <button
                    onClick={handleBuy}
                    disabled={purchasing}
                    className="w-full py-3 bg-gradient-to-r from-primary to-royal-purple text-white rounded-full font-body font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 mb-3"
                  >
                    {purchasing ? "Processing…" : course.price === 0 ? "Enroll for Free" : "Buy Now"}
                  </button>
                  <button
                    onClick={() => addToCart(course)}
                    disabled={isInCart(course._id)}
                    className={`w-full py-2.5 rounded-full font-body font-semibold text-sm border flex items-center justify-center gap-2 transition-colors mb-3 ${
                      isInCart(course._id)
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-white text-ink border-ink/10 hover:border-primary/40"
                    }`}
                  >
                    {isInCart(course._id) ? <CheckIcon /> : <CartAddIcon />}
                    {isInCart(course._id) ? "Added to Cart" : "Add to Cart"}
                  </button>
                </>
              )}

              <button
                onClick={handleLike}
                className={`w-full py-2.5 rounded-full font-body font-semibold text-sm border flex items-center justify-center gap-2 transition-colors ${
                  course.isLikedByUser
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-white text-ink border-ink/10 hover:border-primary/40"
                }`}
              >
                <HeartIcon filled={course.isLikedByUser} />
                {course.isLikedByUser ? "Liked" : "Like"} ({course.likesCount || 0})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
