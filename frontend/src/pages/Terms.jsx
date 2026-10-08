import { AlertTriangle, Gavel, Ban, CheckCircle } from "lucide-react";

const Terms = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <Gavel className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-black mb-2">TERMS OF SERVICE</h1>
                    <p className="text-gray-500 font-mono">OPERATIONAL AGREEMENT</p>
                </div>

                <div className="space-y-8 text-gray-300">
                    <section className="bg-red-950/10 p-8 rounded-xl border border-red-900/30">
                        <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                            <AlertTriangle /> 1. AUTHORIZED USE ONLY
                        </h2>
                        <p className="leading-relaxed font-bold">
                            By Accessing ThreatScope, You Agree To Only Scan Domains You Own Or Have Explicit Written Permission To Audit. Unauthorized Scanning Is A Violation Of The Computer Fraud And Abuse Act (CFAA).
                        </p>
                    </section>

                    <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Ban className="text-cyan-500" /> 2. PROHIBITED TARGETS
                        </h2>
                        <p className="leading-relaxed">
                            The Following Targets Are Strictly Blacklisted:
                            <br />• Government Infrastructure (.gov, .mil) Without Clearance.
                            <br />• Critical Healthcare Systems.
                            <br />• Educational Institutions Without Auth.
                        </p>
                    </section>

                    <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="text-cyan-500" /> 3. LIMITATION OF LIABILITY
                        </h2>
                        <p className="leading-relaxed">
                            ThreatScope Is Provided "As Is". We Are Not Responsible For Downtime, Data Loss, Or Legal Consequences Resulting From Misuse Of This Intelligence Grid.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;