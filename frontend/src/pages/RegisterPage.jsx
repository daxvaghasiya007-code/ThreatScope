import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, Mail, ShieldAlert, Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState(null);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- PASSWORD STRENGTH LOGIC ---
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length > 5) strength += 1;
        if (pass.length > 8) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
        return strength;
    };

    const strength = getStrength(password);
    const getStrengthColor = () => {
        if (strength < 2) return "bg-red-500";
        if (strength < 4) return "bg-yellow-500";
        return "bg-green-500";
    };
    const getStrengthText = () => {
        if (strength < 2) return "WEAK";
        if (strength < 4) return "MODERATE";
        return "STRONG";
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (password !== confirmPassword) {
            setMessage("Passwords Do Not Match");
            return;
        }
        const result = await register(name, email, password);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setMessage(result.error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="z-10 w-full max-w-md p-8 animate-fade-in">
                <div className="mb-8 text-center">
                    <ShieldAlert className="mx-auto h-12 w-12 text-cyan-500 mb-2" />
                    <h1 className="text-3xl font-bold tracking-widest text-white">THREAT<span className="text-cyan-500">SCOPE</span></h1>
                    <p className="text-gray-500 text-xs tracking-[0.3em] font-mono">NEW AGENT REGISTRATION</p>
                </div>

                <div className="rounded-xl border border-cyan-500/30 bg-black/80 p-8 shadow-[0_0_30px_rgba(0,255,255,0.1)] backdrop-blur-md">
                    <h2 className="mb-6 text-center text-xl font-bold text-white">CREATE PROFILE</h2>

                    {message && <div className="mb-4 bg-red-900/50 text-red-200 p-2 rounded text-center text-sm border border-red-800">{message}</div>}

                    <form onSubmit={submitHandler} className="space-y-5">

                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full rounded border border-gray-700 bg-gray-900/50 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full rounded border border-gray-700 bg-gray-900/50 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Password"
                                className="w-full rounded border border-gray-700 bg-gray-900/50 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-500 hover:text-white">
                                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* STRENGTH METER */}
                        {password && (
                            <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
                                <p className="text-[10px] text-right mt-1 text-gray-500 font-bold">{getStrengthText()}</p>
                            </div>
                        )}

                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="w-full rounded border border-gray-700 bg-gray-900/50 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3.5 text-gray-500 hover:text-white">
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex items-start gap-2 text-xs text-gray-400">
                            <input type="checkbox" className="mt-1" required />
                            <span>I Agree To The <Link to="/terms" className="text-cyan-500 hover:underline">Terms of Service</Link> And <Link to="/privacy" className="text-cyan-500 hover:underline">Privacy Policy</Link></span>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded bg-cyan-600 py-3 font-bold text-white shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-transform hover:scale-[1.02] hover:bg-cyan-500"
                        >
                            INITIATE CLEARANCE
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already An Agent? <Link to="/login" className="text-cyan-400 hover:text-white font-bold transition-colors">Login To Terminal</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;