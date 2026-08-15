import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { initiateCartPurchase, verifyCartPurchase } from "../api/purchases";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const formatPrice = (price, currency) => {
  if (!price) return "Free";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR" }).format(
    price / 100
  );
};

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CartIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3h2l2.3 11.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cart = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, subtotal, removeFromCart, removeItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setError("");
    setCheckingOut(true);

    try {
      const result = await initiateCartPurchase(items.map((item) => item.courseId));
      const resolvedIds = [
        ...result.freeEnrolled.map((c) => c.courseId),
        ...result.alreadyOwned.map((c) => c.courseId),
        ...result.invalid,
      ];

      const finish = (message) => {
        removeItems([...resolvedIds, ...(result.payment?.courseIds || [])]);
        navigate("/my-courses", { state: { checkoutMessage: message } });
      };

      if (!result.payment) {
        removeItems(resolvedIds);
        const parts = [];
        if (result.freeEnrolled.length) parts.push(`Enrolled in ${result.freeEnrolled.length} free course(s).`);
        if (result.alreadyOwned.length) parts.push(`${result.alreadyOwned.length} course(s) were already in your library.`);
        finish(parts.join(" ") || "Your cart has been processed.");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Could not load the payment gateway. Please try again.");
        setCheckingOut(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: result.payment.keyId,
        amount: result.payment.amount,
        currency: result.payment.currency,
        order_id: result.payment.orderId,
        name: "Development Rabbit",
        description: `${result.payment.courseIds.length} course(s)`,
        prefill: { name: user?.name, email: user?.email },
        handler: async (response) => {
          try {
            await verifyCartPurchase({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            finish("Payment successful — you're enrolled!");
          } catch {
            setError("Payment verification failed. Please contact support.");
          } finally {
            setCheckingOut(false);
          }
        },
        modal: {
          ondismiss: () => setCheckingOut(false),
        },
      });
      razorpay.open();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not start checkout.");
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-lavender flex items-center justify-center text-primary mx-auto mb-5">
            <CartIcon />
          </div>
          <h1 className="font-heading font-bold text-2xl text-ink mb-2">Your cart is empty</h1>
          <p className="font-body text-brand-muted mb-6">Browse courses and add a few to get started.</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 font-body font-semibold text-white bg-primary hover:opacity-90 transition-opacity px-6 py-3 rounded-full"
          >
            Browse Courses
            <ArrowIcon />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <span className="inline-block text-sm font-semibold text-primary bg-lavender px-4 py-1.5 rounded-full mb-5">
          Your Cart
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink mb-10">
          {items.length} {items.length === 1 ? "Course" : "Courses"} in Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.courseId}
                className="flex items-center gap-4 border border-ink/10 rounded-2xl p-4"
              >
                <div className="w-24 h-16 rounded-xl bg-gradient-to-br from-lavender via-white to-primary/10 overflow-hidden shrink-0">
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/courses/${item.slug || item.courseId}`}
                    className="font-heading font-bold text-ink hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="font-body text-sm text-brand-muted mt-1">
                    {formatPrice(item.price, item.currency)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.courseId)}
                  aria-label={`Remove ${item.title} from cart`}
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={clearCart}
              className="self-start font-body text-sm font-semibold text-brand-muted hover:text-red-600 transition-colors mt-2"
            >
              Clear cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-lavender/40 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-ink/10">
                <span className="font-body text-sm text-brand-muted">Subtotal</span>
                <span className="font-heading font-bold text-2xl text-ink">
                  {formatPrice(subtotal, items[0]?.currency)}
                </span>
              </div>

              {error && <p className="font-body text-red-600 text-sm mb-3">{error}</p>}

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full py-3 bg-gradient-to-r from-primary to-royal-purple text-white rounded-full font-body font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {checkingOut ? "Processing…" : isAuthenticated ? "Checkout" : "Log In to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
