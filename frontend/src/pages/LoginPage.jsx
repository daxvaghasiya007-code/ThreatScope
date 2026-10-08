import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Lock, Mail, Eye, EyeOff, ShieldAlert } from "lucide-react"; // Import Eye Icons

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Toggle State
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        const res = await login(email, password);
        if (res.success) {
            navigate("/dashboard");
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="z-10 w-full max-w-md p-8 animate-fade-in">
                <div className="mb-8 text-center">
                    <ShieldAlert className="mx-auto h-12 w-12 text-cyan-500 mb-2" />
                    <h1 className="text-3xl font-bold tracking-widest text-white">THREAT<span className="text-cyan-500">SCOPE</span></h1>
                    <p className="text-gray-500 text-xs tracking-[0.3em] font-mono">IDENTITY VERIFICATION</p>
                </div>

                <div className="rounded-xl border border-cyan-500/30 bg-black/80 p-8 shadow-[0_0_30px_rgba(0,255,255,0.1)] backdrop-blur-md">
                    <h2 className="mb-6 text-center text-xl font-bold text-white">OPERATIVE LOGIN</h2>

                    {error && <div className="mb-4 bg-red-900/50 text-red-200 p-3 rounded text-center text-sm border border-red-800 flex items-center justify-center gap-2">{error}</div>}

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                placeholder="Access ID / Email"
                                className="w-full rounded border border-gray-700 bg-gray-900/50 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"} // TOGGLE TYPE
                                placeholder="Passcode"
                                className="w-full rounded border border-gray-700 bg-gray-900/50 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {/* EYE BUTTON */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-500 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded bg-cyan-600 py-3 font-bold text-white shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-transform hover:scale-[1.02] hover:bg-cyan-500"
                        >
                            AUTHENTICATE
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        New Operative? <Link to="/register" className="text-cyan-400 hover:text-white font-bold transition-colors">Request Clearance</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;