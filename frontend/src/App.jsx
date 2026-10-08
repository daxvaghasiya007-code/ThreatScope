import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard"; // NEW

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return !user ? children : <Navigate to="/dashboard" />;
};

// NEW: ADMIN ROUTE GUARD
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user && user.isAdmin ? children : <Navigate to="/dashboard" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooter = ["/dashboard", "/login", "/register", "/admin"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

            {/* NEW ADMIN ROUTE */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;