import Navbar from "../components/Navbar";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { User, Key, Save, CheckCircle, AlertTriangle, Eye, EyeOff, Shield, Activity, Terminal } from "lucide-react";
import axios from "axios";

const Settings = () => {
    const { user } = useContext(AuthContext);

    // Form States
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Tab State
    const [activeTab, setActiveTab] = useState("PROFILE");

    // API Key State
    const [apiKey, setApiKey] = useState("sk_live_8392849283928394");

    // Mock Security Logs
    const securityLogs = [
        { id: 1, event: "Successful Login", date: "2026-09-11 12:00:04 PM", ip: "192.168.1.45", status: "SUCCESS" },
        { id: 2, event: "API Key Regenerated", date: "2026-09-10 09:15:22 AM", ip: "192.168.1.45", status: "SUCCESS" },
        { id: 3, event: "Profile Updated", date: "2026-09-09 03:44:11 PM", ip: "192.168.1.45", status: "SUCCESS" },
        { id: 4, event: "Failed Login Attempt", date: "2026-09-08 11:42:01 PM", ip: "45.22.19.102", status: "WARNING" },
    ];

    const generateKey = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "sk_live_";
        for (let i = 0; i < 24; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setApiKey(result);
        setSuccess(true);
        setMessage("New API Key Generated Securely");
        setTimeout(() => setMessage(null), 3000);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);
        setSuccess(false);

        if (password && password !== confirmPassword) {
            setMessage("Passwords Do Not Match");
            return;
        }

        setLoading(true);

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };

            const payload = { name, email };
            if (password) payload.password = password;

            const { data } = await axios.put("http://localhost:5000/api/users/profile", payload, config);

            localStorage.setItem("userInfo", JSON.stringify(data));
            setSuccess(true);
            setMessage("Profile Updated Successfully In MongoDB");

        } catch (error) {
            setMessage(error.response?.data?.message || "Update Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#050505] text-white">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

            <div className="z-10 flex flex-1 flex-col p-8 items-center pt-32">
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* SIDEBAR NAVIGATION */}
                    <div className="rounded-xl border border-gray-800 bg-black/60 p-4 h-fit backdrop-blur-md col-span-1">
                        <div className="space-y-2">
                            <button 
                                onClick={() => setActiveTab("PROFILE")}
                                className={`w-full text-left px-4 py-3 rounded-r font-bold transition-all ${activeTab === "PROFILE" ? "bg-cyan-900/20 text-cyan-400 border-l-2 border-cyan-500" : "text-gray-500 hover:text-white border-l-2 border-transparent"}`}
                            >
                                Profile Settings
                            </button>
                            <button 
                                onClick={() => setActiveTab("API")}
                                className={`w-full text-left px-4 py-3 rounded-r font-bold transition-all ${activeTab === "API" ? "bg-cyan-900/20 text-cyan-400 border-l-2 border-cyan-500" : "text-gray-500 hover:text-white border-l-2 border-transparent"}`}
                            >
                                API Keys
                            </button>
                            <button 
                                onClick={() => setActiveTab("SECURITY")}
                                className={`w-full text-left px-4 py-3 rounded-r font-bold transition-all ${activeTab === "SECURITY" ? "bg-cyan-900/20 text-cyan-400 border-l-2 border-cyan-500" : "text-gray-500 hover:text-white border-l-2 border-transparent"}`}
                            >
                                Security Log
                            </button>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="md:col-span-3 space-y-6">
                        
                        {/* TAB 1: PROFILE SETTINGS */}
                        {activeTab === "PROFILE" && (
                            <form onSubmit={handleUpdate} className="rounded-xl border border-cyan-500/30 bg-black/80 p-8 shadow-[0_0_20px_rgba(0,255,255,0.05)] backdrop-blur-md animate-fade-in">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <User className="text-cyan-500" /> OPERATIVE PROFILE
                                </h2>

                                {message && (
                                    <div className={`mb-6 p-4 rounded flex items-center gap-3 text-sm font-bold ${success ? 'bg-green-900/30 text-green-400 border border-green-500/50' : 'bg-red-900/30 text-red-400 border border-red-500/50'}`}>
                                        {success ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                                        {message}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs text-cyan-500 mb-1 font-bold uppercase tracking-wider">Codename / Username</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900/80 border border-gray-700 rounded p-3 text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-cyan-500 mb-1 font-bold uppercase tracking-wider">Secure Email</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900/80 border border-gray-700 rounded p-3 text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all" />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs text-cyan-500 mb-1 font-bold uppercase tracking-wider">New Password</label>
                                        <input
                                            type={showPass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Leave blank to keep current"
                                            className="w-full bg-gray-900/80 border border-gray-700 rounded p-3 pr-12 text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all"
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-gray-500 hover:text-white">
                                            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs text-cyan-500 mb-1 font-bold uppercase tracking-wider">Confirm Password</label>
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-gray-900/80 border border-gray-700 rounded p-3 pr-12 text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-9 text-gray-500 hover:text-white">
                                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full mt-8 bg-cyan-600 py-3 rounded font-bold hover:bg-cyan-500 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)] flex items-center justify-center gap-2">
                                    {loading ? "UPDATING..." : <><Save size={18} /> SAVE CHANGES</>}
                                </button>
                            </form>
                        )}

                        {/* TAB 2: API KEYS */}
                        {activeTab === "API" && (
                            <div className="rounded-xl border border-gray-800 bg-black/80 p-8 backdrop-blur-md animate-fade-in">
                                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Key className="text-cyan-500" /> API MANAGEMENT
                                </h2>
                                <p className="text-gray-400 text-sm mb-8">Generate and manage cryptographic keys for programmatic access to the ThreatScope intelligence grid.</p>
                                
                                {message && (
                                    <div className="mb-6 p-4 rounded flex items-center gap-3 text-sm font-bold bg-green-900/30 text-green-400 border border-green-500/50">
                                        <CheckCircle size={18} /> {message}
                                    </div>
                                )}

                                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                                    <label className="block text-xs text-cyan-500 mb-3 font-bold uppercase tracking-wider">Active Secret Key</label>
                                    <div className="flex justify-between items-center bg-black p-4 rounded border border-gray-700">
                                        <code className="text-cyan-400 font-mono text-lg">{apiKey}</code>
                                        <button onClick={generateKey} className="bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded hover:bg-cyan-500 hover:text-black font-bold transition-all shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                                            REGENERATE KEY
                                        </button>
                                    </div>
                                    <p className="text-red-400/80 text-xs mt-4 flex items-center gap-1">
                                        <AlertTriangle size={12} /> Warning: Regenerating this key will immediately revoke access for all applications using the old key.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: SECURITY LOG */}
                        {activeTab === "SECURITY" && (
                            <div className="rounded-xl border border-gray-800 bg-black/80 p-8 backdrop-blur-md animate-fade-in">
                                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Shield className="text-cyan-500" /> SECURITY LOG
                                </h2>
                                <p className="text-gray-400 text-sm mb-6">Review recent authentication events and account modifications.</p>
                                
                                <div className="overflow-x-auto border border-gray-800 rounded-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-900/80 text-cyan-500 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 font-bold">Event</th>
                                                <th className="p-4 font-bold">Date & Time</th>
                                                <th className="p-4 font-bold">IP Address</th>
                                                <th className="p-4 font-bold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800 bg-black/40">
                                            {securityLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-gray-900/40 transition-colors">
                                                    <td className="p-4 text-gray-200 flex items-center gap-2">
                                                        <Activity size={14} className={log.status === "WARNING" ? "text-yellow-500" : "text-gray-500"} />
                                                        {log.event}
                                                    </td>
                                                    <td className="p-4 text-gray-400 font-mono text-xs">{log.date}</td>
                                                    <td className="p-4 text-gray-400 font-mono text-xs flex items-center gap-2">
                                                        <Terminal size={12} /> {log.ip}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'SUCCESS' ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;