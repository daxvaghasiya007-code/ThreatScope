import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Clock, CheckCircle, Search, Shield, MapPin, Terminal, AlertTriangle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // IMPORT NAVIGATE

const History = () => {
    const { user } = useContext(AuthContext);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // INITIALIZE NAVIGATE

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get("http://localhost:5000/api/users/profile", config);
                setHistoryData(data.searchHistory || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed To Fetch History", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    // HANDLE CLICK: REDIRECT TO DASHBOARD AND SCAN
    const handleHistoryClick = (targetDomain) => {
        navigate("/dashboard", { state: { target: targetDomain } });
    };

    const getRiskColor = (score) => {
        if (score < 40) return "text-green-400";
        if (score < 70) return "text-yellow-400";
        return "text-red-500";
    };

    const getRiskBg = (score) => {
        if (score < 40) return "bg-green-500";
        if (score < 70) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#050505] text-white">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="z-10 flex flex-1 flex-col p-8 items-center pt-32">
                <div className="w-full max-w-6xl">

                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <Clock className="text-cyan-500" /> MISSION LOGS
                            </h1>
                            <p className="text-gray-500 font-mono">ARCHIVED INTELLIGENCE FOR AGENT: {user?.name.toUpperCase()}</p>
                        </div>
                        <div className="bg-cyan-900/20 border border-cyan-800 rounded px-4 py-2 flex items-center gap-2">
                            <Search size={16} className="text-cyan-600" />
                            <input type="text" placeholder="Search Archives..." className="bg-transparent outline-none text-sm text-cyan-100 w-48 font-mono" />
                        </div>
                    </div>

                    <div className="w-full rounded-xl border border-cyan-900/50 bg-black/80 backdrop-blur-md overflow-hidden shadow-2xl">

                        {loading ? (
                            <div className="p-20 text-center flex flex-col items-center">
                                <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <span className="text-cyan-500 font-mono animate-pulse">DECRYPTING ARCHIVES...</span>
                            </div>
                        ) : historyData.length === 0 ? (
                            <div className="p-20 text-center text-gray-500 font-mono border-t border-gray-800">
                                <Shield size={48} className="mx-auto mb-4 opacity-20" />
                                NO RECORDS FOUND. INITIATE SCAN IN DASHBOARD.
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-cyan-950/40 text-cyan-400 uppercase text-xs font-bold tracking-wider">
                                    <tr>
                                        <th className="p-6">Timestamp</th>
                                        <th className="p-6">Target Domain</th>
                                        <th className="p-6">Meta Data</th>
                                        <th className="p-6">Threat Assessment</th>
                                        <th className="p-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {historyData.map((item, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleHistoryClick(item.target)} // CLICK EVENT
                                            className="hover:bg-cyan-900/20 transition-all cursor-pointer group"
                                        >

                                            <td className="p-6 text-gray-500 font-mono text-xs">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </td>

                                            <td className="p-6">
                                                <div className="font-bold text-white text-lg flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
                                                    {item.target}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono mt-1">IP: {item.ip || "Hidden"}</div>
                                            </td>

                                            <td className="p-6">
                                                <div className="flex flex-col gap-1 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1"><MapPin size={12} /> {item.location || "Unknown"}</span>
                                                    <span className="flex items-center gap-1"><Terminal size={12} /> {item.ports?.length || 0} Ports Open</span>
                                                </div>
                                            </td>

                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${getRiskBg(item.riskScore)}`}
                                                            style={{ width: `${item.riskScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-sm font-black ${getRiskColor(item.riskScore)}`}>
                                                        {item.riskScore}/100
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="p-6 text-right">
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    RE-SCAN <ChevronRight size={14} />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-600 font-mono flex items-center justify-center gap-2">
                        <AlertTriangle size={12} />
                        END OF ENCRYPTED RECORD STREAM // CLASSIFIED LEVEL 5
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;