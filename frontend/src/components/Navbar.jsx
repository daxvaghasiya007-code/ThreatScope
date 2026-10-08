import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { LogOut, ShieldAlert, History, Settings, User, LayoutDashboard, Home, Phone, Info, ShieldCheck } from "lucide-react"; // Import ShieldCheck
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        navigate("/");
        setTimeout(() => logout(), 50);
    };

    const isActive = (path) => location.pathname === path ? "text-cyan-400" : "text-gray-400 hover:text-cyan-300";

    return (
        <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-cyan-900/30 bg-black/90 px-8 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                    <ShieldAlert className="h-8 w-8 text-cyan-500 transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 animate-pulse bg-cyan-500/20 blur-lg rounded-full"></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-widest text-white">
                        THREAT<span className="text-cyan-500">SCOPE</span>
                    </span>
                    <span className="text-[9px] text-cyan-400 tracking-[0.2em] font-mono">ENTERPRISE INTELLIGENCE</span>
                </div>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider">
                {user ? (
                    <>
                        {/* ADMIN BUTTON (CONDITIONAL) */}
                        {user.isAdmin && (
                            <Link to="/admin" className={`flex items-center gap-2 transition-colors ${isActive('/admin')}`}>
                                <ShieldCheck size={18} /> ADMIN
                            </Link>
                        )}

                        <Link to="/dashboard" className={`flex items-center gap-2 transition-colors ${isActive('/dashboard')}`}>
                            <LayoutDashboard size={18} /> DASHBOARD
                        </Link>
                        <Link to="/history" className={`flex items-center gap-2 transition-colors ${isActive('/history')}`}>
                            <History size={18} /> HISTORY
                        </Link>
                        <Link to="/settings" className={`flex items-center gap-2 transition-colors ${isActive('/settings')}`}>
                            <Settings size={18} /> SETTINGS
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/" className={`flex items-center gap-2 transition-colors ${isActive('/')}`}>
                            <Home size={18} /> HOME
                        </Link>
                        <Link to="/about" className={`flex items-center gap-2 transition-colors ${isActive('/about')}`}>
                            <Info size={18} /> ABOUT
                        </Link>
                        <Link to="/contact" className={`flex items-center gap-2 transition-colors ${isActive('/contact')}`}>
                            <Phone size={18} /> CONTACT
                        </Link>
                    </>
                )}
            </div>

            <div className="flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-6">
                        <div className="hidden text-right md:block">
                            <p className="text-sm font-bold text-white flex items-center justify-end gap-2">{user.name} <User className="h-4 w-4 text-cyan-500" /></p>
                            <p className="text-[10px] text-cyan-600 tracking-widest uppercase">{user.isAdmin ? "ADMINISTRATOR" : "ANALYST"}</p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 rounded border border-red-900/50 bg-red-950/20 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-900/40 transition-all">
                            <LogOut size={16} /> LOGOUT
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">LOGIN</Link>
                        <Link to="/register" className="rounded bg-cyan-600 px-6 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:bg-cyan-500 transition-all">REGISTER</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;