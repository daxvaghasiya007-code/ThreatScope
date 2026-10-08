import { Shield, Lock, Eye, FileText } from "lucide-react";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <Shield className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-black mb-2">PRIVACY PROTOCOLS</h1>
                    <p className="text-gray-500 font-mono">CLASSIFICATION LEVEL: PUBLIC</p>
                </div>

                <div className="space-y-8 text-gray-300">
                    <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Eye className="text-cyan-500" /> 1. DATA COLLECTION
                        </h2>
                        <p className="leading-relaxed">
                            ThreatScope Collects Only Mission-Critical Data:
                            <br />• User Credentials (Hash-Encrypted via Bcrypt).
                            <br />• Target Domain Queries (Stored For Historical Audit).
                            <br />• IP Addresses (For Rate Limiting & DDOS Protection).
                        </p>
                    </section>

                    <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Lock className="text-cyan-500" /> 2. ENCRYPTION STANDARDS
                        </h2>
                        <p className="leading-relaxed">
                            All Transmissions Are Secured Via TLS 1.3. Database Entries Are At Rest Using AES-256 Standards. We Do Not Sell Intelligence To Third-Party Brokers.
                        </p>
                    </section>

                    <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="text-cyan-500" /> 3. DATA RETENTION
                        </h2>
                        <p className="leading-relaxed">
                            Scan History Is Retained For 30 Days For Audit Purposes via MongoDB TTL Indexes. Users May Request A "Hard Wipe" Of Their Logs Via The Contact Command Center.
                        </p>
                    </section>

                    <div className="text-center pt-8 text-sm text-gray-500 font-mono">
                        LAST UPDATED: {new Date().toLocaleDateString()} // VER: 1.0.4
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;