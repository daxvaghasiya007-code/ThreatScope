import Globe3D from "../components/Globe3D";
import { Search, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm) {
            // FIX: Use 'state' To Pass Data Reliably To Dashboard
            navigate("/dashboard", { state: { target: searchTerm } });
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-[#050505] text-white overflow-hidden relative">
            <div className="absolute inset-0 z-0 opacity-80">
                <Globe3D />
            </div>

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center pt-20 px-4">
                <div className="w-full max-w-4xl text-center animate-fade-in">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-600 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)] mb-4">
                        THREATSCOPE
                    </h1>
                    <p className="text-xl md:text-2xl text-cyan-100/70 font-mono tracking-widest mb-12">
                        GLOBAL CYBERSECURITY INTELLIGENCE GRID
                    </p>

                    <div className="relative max-w-2xl mx-auto mb-16 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                        <form onSubmit={handleSearch} className="relative flex items-center bg-black rounded-lg border border-cyan-500/50 p-1">
                            <input
                                type="text"
                                placeholder="Enter Target IP or Domain..."
                                className="w-full bg-transparent px-6 py-4 text-lg outline-none text-white font-mono placeholder-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-md transition-colors">
                                <Search size={24} />
                            </button>
                        </form>
                    </div>

                    {!user && (
                        <div className="inline-block">
                            <Link
                                to="/register"
                                className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-700 px-10 py-5 rounded-full text-xl font-bold tracking-wider shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:scale-105 hover:shadow-[0_0_60px_rgba(0,255,255,0.6)] transition-all border border-cyan-400/30"
                            >
                                <Lock size={24} /> ACCESS INTEL DATABASE
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;