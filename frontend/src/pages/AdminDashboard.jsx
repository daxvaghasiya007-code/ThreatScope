import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Users, Trash2, ShieldCheck, Mail, AlertTriangle, Loader2, Lock } from "lucide-react";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");

    // --- FIX 1: DERIVE ACCESS STATE DURING RENDER (NO SETSTATE LOOP) ---
    // We Do Not Use UseEffect To Check Permissions. We Check Immediately.
    const isAdmin = user && user.isAdmin;

    // --- FIX 2: DEPENDENCY ARRAY & UNUSED VARS ---
    useEffect(() => {
        // If Not Admin, Do Nothing (The Render Logic Below Handles It)
        if (!isAdmin) return;

        let isMounted = true;

        const fetchUsers = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get("http://localhost:5000/api/users", config);

                if (isMounted) {
                    setUsers(data);
                    setLoading(false);
                }
            } catch (err) {
                // --- FIX 3: USE THE 'err' VARIABLE TO SATISFY LINTER ---
                if (isMounted) {
                    console.error("Fetch Error:", err);
                    setApiError("Failed To Load User Database. Access Denied.");
                    setLoading(false);
                }
            }
        };

        fetchUsers();

        return () => { isMounted = false; };

        // WE ONLY DEPEND ON user.token (Primitive), NOT the user Object (Reference)
    }, [user.token, isAdmin]);

    const deleteHandler = async (id) => {
        if (window.confirm("CONFIRM TERMINATION: Are You Sure You Want To Delete This Agent?")) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                await axios.delete(`http://localhost:5000/api/users/${id}`, config);
                setUsers((prev) => prev.filter((u) => u._id !== id));
            } catch (err) {
                console.error(err); // Log Error
                alert("Termination Failed: Server Error");
            }
        }
    };

    // --- RENDER LOGIC: HANDLE ACCESS DENIED HERE (OUTSIDE EFFECT) ---
    if (!isAdmin) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#050505] text-white">
                <div className="bg-red-900/20 border border-red-500 p-8 rounded-xl text-center">
                    <Lock size={48} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-red-500">ACCESS DENIED</h1>
                    <p className="text-gray-400 font-mono mt-2">ADMINISTRATOR CLEARANCE REQUIRED</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#050505] text-white pt-32 px-8">
            <div className="max-w-6xl mx-auto w-full">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-red-900/20 p-4 rounded-full border border-red-500/50">
                        <ShieldCheck size={40} className="text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white">COMMAND CENTER</h1>
                        <p className="text-red-500 font-mono tracking-widest">CLEARANCE LEVEL: ADMINISTRATOR</p>
                    </div>
                </div>

                {/* API ERROR STATE */}
                {apiError && (
                    <div className="bg-red-900/20 border border-red-500 text-red-400 p-6 rounded-xl flex items-center gap-4 mb-8">
                        <AlertTriangle size={24} />
                        <span className="font-bold">{apiError}</span>
                    </div>
                )}

                {/* LOADING STATE */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 size={48} className="text-cyan-500 animate-spin" />
                    </div>
                ) : (
                    /* DATA TABLE */
                    <div className="bg-black/80 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/80 text-gray-400 font-bold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-6">Agent ID</th>
                                    <th className="p-6">Identity</th>
                                    <th className="p-6">Contact</th>
                                    <th className="p-6">Role</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {users.length > 0 ? (
                                    users.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-900/30 transition-colors group">
                                            <td className="p-6 font-mono text-xs text-gray-500 group-hover:text-cyan-600 transition-colors">
                                                {u._id}
                                            </td>
                                            <td className="p-6 font-bold text-white flex items-center gap-2">
                                                <Users size={16} className="text-cyan-600" /> {u.name}
                                            </td>
                                            <td className="p-6 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} /> {u.email}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {u.isAdmin ? (
                                                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-xs font-bold border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                                        ADMINISTRATOR
                                                    </span>
                                                ) : (
                                                    <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded text-xs font-bold border border-cyan-500/30">
                                                        ANALYST
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6 text-right">
                                                {!u.isAdmin && (
                                                    <button
                                                        onClick={() => deleteHandler(u._id)}
                                                        className="bg-red-900/20 border border-red-900/50 hover:bg-red-600 hover:text-white text-red-500 p-2 rounded transition-all shadow-lg hover:shadow-red-500/20"
                                                        title="Terminate Agent"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-gray-500 font-mono">
                                            NO AGENTS FOUND IN DATABASE.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;