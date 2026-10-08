import { AlertOctagon, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#050505] text-white p-6 relative overflow-hidden">

            {/* Background Circuit */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="z-10 flex flex-col items-center text-center animate-fade-in">
                <AlertOctagon size={100} className="text-red-500 mb-6 animate-pulse" />

                <h1 className="text-8xl font-black text-white mb-2 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold text-red-500 tracking-widest mb-6">SIGNAL LOST</h2>

                <p className="text-gray-400 max-w-md mb-8 font-mono">
                    The Requested Node Is Offline Or Restricted By Clearance Level.
                </p>

                <Link to="/" className="flex items-center gap-2 bg-red-900/20 border border-red-500/50 text-red-400 px-8 py-3 rounded-full hover:bg-red-500 hover:text-black transition-all font-bold">
                    <Home size={18} /> RETURN TO BASE
                </Link>
            </div>
        </div>
    );
};

export default NotFound;