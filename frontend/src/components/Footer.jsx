import { ShieldAlert, MessageSquare, Terminal, Globe } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link

const Footer = () => {
    return (
        <footer className="w-full bg-black border-t border-gray-900 pt-16 pb-8 px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                {/* Brand */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-cyan-500" />
                        <span className="text-xl font-bold tracking-wider text-white">
                            THREAT<span className="text-cyan-500">SCOPE</span>
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        The World's Most Advanced OSINT Reconnaissance Platform. Securing The Digital Frontier, One Node At A Time.
                    </p>
                </div>

                {/* Platform */}
                <div>
                    <h4 className="font-bold text-white mb-6 tracking-wider">PLATFORM</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><Link to="/register" className="hover:text-cyan-500 transition-colors">Intelligence Grid</Link></li>
                        <li><Link to="/about" className="hover:text-cyan-500 transition-colors">API Access</Link></li>
                        <li><Link to="/about" className="hover:text-cyan-500 transition-colors">Enterprise</Link></li>
                        <li><span className="text-cyan-900 bg-cyan-900/20 px-2 py-0.5 rounded text-xs font-bold">LIVE</span> System Status</li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="font-bold text-white mb-6 tracking-wider">COMPANY</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><Link to="/about" className="hover:text-cyan-500 transition-colors">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-cyan-500 transition-colors">Contact Support</Link></li>
                        <li><Link to="/privacy" className="hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-cyan-500 transition-colors">Terms Of Service</Link></li>
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h4 className="font-bold text-white mb-6 tracking-wider">CONNECT</h4>
                    <div className="flex gap-4">
                        <a href="#" className="bg-gray-900 p-2 rounded hover:bg-cyan-500 hover:text-black transition-colors text-gray-400"><MessageSquare size={20} /></a>
                        <a href="#" className="bg-gray-900 p-2 rounded hover:bg-cyan-500 hover:text-black transition-colors text-gray-400"><Terminal size={20} /></a>
                        <a href="#" className="bg-gray-900 p-2 rounded hover:bg-cyan-500 hover:text-black transition-colors text-gray-400"><Globe size={20} /></a>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-mono">
                <p>&copy; 2024 THREATSCOPE INC. ALL RIGHTS RESERVED.</p>
                <p>ENCRYPTED CONNECTION ESTABLISHED</p>
            </div>
        </footer>
    );
};

export default Footer;