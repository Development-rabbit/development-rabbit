import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DevModeToggle from "./components/DevModeToggle";
import LoginPage from "./pages/Login";
import GithubCallback from "./pages/GithubCallback";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Cart from "./pages/Cart";
import CourseDetail from "./pages/CourseDetail";
import ContentViewer from "./pages/ContentViewer";
import MyCourses from "./pages/MyCourses";
import AdminCourses from "./pages/admin/AdminCourses";
import CourseForm from "./pages/admin/CourseForm";
import CourseManage from "./pages/admin/CourseManage";

// Auth pages render their own logo/back-to-home chrome, without the
// site-wide Navbar and Footer.
const BARE_CHROME_PATHS = ["/login", "/signup"];

const AppLayout = () => {
  const location = useLocation();
  const bareChrome = BARE_CHROME_PATHS.includes(location.pathname);

  return (
    <>
      {!bareChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/content/:contentId" element={<ContentViewer />} />
          <Route path="/my-courses" element={<MyCourses />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/new" element={<CourseForm />} />
          <Route path="/admin/courses/:courseId/edit" element={<CourseForm />} />
          <Route path="/admin/courses/:courseId/manage" element={<CourseManage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!bareChrome && <Footer />}
      <DevModeToggle />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
