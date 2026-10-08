import Globe3D from "../components/Globe3D";
import { Shield, Target, Users, Lock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[#050505] text-white overflow-hidden relative">
            <div className="absolute inset-0 z-0 opacity-50">
                <Globe3D />
            </div>

            <div className="relative z-10 flex flex-col items-center pt-32 px-6 pb-20">

                {/* HERO */}
                <div className="max-w-4xl text-center mb-20 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        WE SEE THE <span className="text-cyan-500">INVISIBLE</span>.
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        ThreatScope Was Founded On A Single Principle: **You Cannot Defend What You Cannot See.** We Provide Enterprise-Grade Reconnaissance To Expose Vulnerabilities Before Adversaries Do.
                    </p>
                </div>

                {/* MISSION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-20">
                    <div className="bg-black/80 border border-cyan-900/50 p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500 transition-colors group">
                        <Shield className="w-12 h-12 text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-white mb-4">Proactive Defense</h3>
                        <p className="text-gray-400">We don't wait for attacks. Our automated grid scans 24/7 to identify exposure in real-time.</p>
                    </div>
                    <div className="bg-black/80 border border-cyan-900/50 p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500 transition-colors group">
                        <Target className="w-12 h-12 text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-white mb-4">Precision Intel</h3>
                        <p className="text-gray-400">Zero false positives. Our deep-learning engine filters noise to deliver actionable threat data.</p>
                    </div>
                    <div className="bg-black/80 border border-cyan-900/50 p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500 transition-colors group">
                        <Users className="w-12 h-12 text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-white mb-4">Elite Community</h3>
                        <p className="text-gray-400">Built by Red Teamers, for Red Teamers. We empower security analysts with military-grade tools.</p>
                    </div>
                </div>

                {/* STATS */}
                <div className="w-full bg-cyan-900/10 border-y border-cyan-900/30 py-16 mb-20 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-black text-white mb-2">1.2M+</div>
                            <div className="text-cyan-500 font-mono text-sm">DOMAINS SCANNED</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-white mb-2">850k</div>
                            <div className="text-cyan-500 font-mono text-sm">THREATS NEUTRALIZED</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-white mb-2">99.9%</div>
                            <div className="text-cyan-500 font-mono text-sm">UPTIME SLA</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-white mb-2">24/7</div>
                            <div className="text-cyan-500 font-mono text-sm">GLOBAL MONITORING</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">READY TO SECURE YOUR PERIMETER?</h2>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        START FREE SCAN <ChevronRight />
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default About;