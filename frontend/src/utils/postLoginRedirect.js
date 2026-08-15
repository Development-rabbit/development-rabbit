import { getContinueLearning } from "../api/progress";

// Decides where to send the user right after a successful login/signup/OAuth
// callback. Never overrides an explicit deep-link target (ProtectedRoute
// sends the user to /login with `state: { from: location }` when it bounces
// them) — this only kicks in for the default "no specific destination" case.
export const resolvePostLoginDestination = async (explicitFrom) => {
  if (explicitFrom) return explicitFrom;

  try {
    const { hasAnyEnrollment } = await getContinueLearning();
    return hasAnyEnrollment ? "/my-courses" : "/";
  } catch {
    // A network hiccup here must never block the login flow.
    return "/";
  }
};
