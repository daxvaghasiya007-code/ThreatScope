import Globe3D from "../components/Globe3D";
import { Activity, Download, Lock, ChevronRight, Server, MapPin, Shield, AlertTriangle, Search, X, Loader2, FileText, Terminal, Globe, Cloud, CheckCircle } from "lucide-react"; // Added Cloud, CheckCircle
import { useState, useContext, useEffect, useCallback, useRef } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate, useLocation } from "react-router-dom";

// ... (RiskGauge Component - NO CHANGES) ...
const RiskGauge = ({ score, analyzing }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        if (analyzing) {
            const interval = setInterval(() => {
                setDisplayScore(Math.floor(Math.random() * 99));
            }, 80);
            return () => clearInterval(interval);
        } else {
            let start = 0;
            const end = score || 0;
            if (start === end) return;
            let totalDuration = 1000;
            let incrementTime = (totalDuration / (end || 1));

            let timer = setInterval(() => {
                start += 1;
                setDisplayScore(start);
                if (start >= end) clearInterval(timer);
            }, incrementTime);
            return () => clearInterval(timer);
        }
    }, [score, analyzing]);

    const getColor = (s) => {
        if (analyzing) return "#3b82f6";
        if (s < 40) return "#4ade80";
        if (s < 70) return "#facc15";
        return "#ef4444";
    };

    const color = getColor(displayScore);
    const radius = 85;
    const stroke = 14;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - ((displayScore / 100) * circumference) / 2;

    return (
        <div className="relative flex flex-col items-center justify-center mb-10 mt-6">
            <svg height={radius * 2} width={radius * 2} className="rotate-180">
                <circle
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeDasharray={`${circumference / 2} ${circumference}`}
                />
                <circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset, transition: "stroke-dashoffset 0.1s linear" }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2 text-center">
                <span className={`text-7xl font-black text-white leading-none ${analyzing ? 'animate-pulse' : ''}`}>
                    {displayScore}
                </span>
                <span className="text-lg block text-gray-400 font-bold mt-2 tracking-widest">/ 100</span>
            </div>

            <div className="absolute -bottom-8 text-base font-black tracking-[0.3em] uppercase whitespace-nowrap" style={{ color }}>
                {analyzing ? "CALCULATING" : (displayScore < 40 ? "SYSTEM SECURE" : displayScore < 70 ? "MODERATE RISK" : "CRITICAL RISK")}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [target, setTarget] = useState("");
    const [scanData, setScanData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState("SEARCH");
    const [coords, setCoords] = useState(null);

    const hasScannedRef = useRef(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const getRisk = (port) => {
        if (port === 80 || port === 443) return { label: "LOW", color: "text-green-400", level: "LOW" };
        if (port === 22 || port === 21) return { label: "HIGH", color: "text-orange-400", level: "HIGH" };
        return { label: "MEDIUM", color: "text-yellow-400", level: "MEDIUM" };
    };

    const executeScan = useCallback((scanTarget) => {
        if (!scanTarget) return;
        setError("");
        setScanData(null);
        setCoords(null);
        setTarget(scanTarget);
        setSearching(true);

        setTimeout(async () => {
            setSearching(false);
            setViewMode("LOCKED");
            setLoading(true);

            if (!user) {
                const fakeLat = (Math.random() * 180 - 90).toFixed(4);
                const fakeLon = (Math.random() * 360 - 180).toFixed(4);

                // --- MOCK DATA UPDATED ---
                const fakeData = {
                    target: scanTarget,
                    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.XX.XX`,
                    riskScore: Math.floor(Math.random() * (95 - 40) + 40),
                    geo: { country: "Restricted Location", city: "Unknown", org: "ISP Redacted", loc: `${fakeLat},${fakeLon}` },
                    ports: [80, 443],
                    tech_stack: ["Encrypted"],
                    security_issues: ["Login to View Full Report"],
                    header_audit: { "X-Frame-Options": "FAIL" },
                    ssl_info: { valid: true, issuer: "DigiCert Inc", expires: "2025-12-30", days_left: 120 },
                    dns_records: { mx: ["alt1.gmail-smtp-in.l.google.com"], ns: ["ns1.cloudflare.com"], txt: ["v=spf1 include:_spf.google.com ~all"] }
                };

                setTimeout(() => {
                    setLoading(false);
                    setScanData(fakeData);
                    setAnalyzing(true);
                    setCoords({ lat: parseFloat(fakeLat), lon: parseFloat(fakeLon) });

                    setTimeout(() => {
                        setAnalyzing(false);
                        hasScannedRef.current = false;
                    }, 3000);
                }, 3000);
                return;
            }

            try {
                const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.post("http://localhost:5000/api/scan", { target: scanTarget }, config);
                setTimeout(() => {
                    setLoading(false);
                    setScanData(data);
                    setAnalyzing(true);
                    if (data.geo.loc) {
                        const [lat, lon] = data.geo.loc.split(",");
                        setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
                    }
                    setTimeout(() => {
                        setAnalyzing(false);
                        hasScannedRef.current = false;
                    }, 3000);
                }, 3000);
            } catch (err) {
                console.error(err);
                const errorMsg = err.response?.data?.message || "Target Host Unreachable Or Timed Out.";
                setTimeout(() => {
                    setLoading(false);
                    setViewMode("SEARCH");
                    setError(errorMsg);
                    hasScannedRef.current = false;
                }, 1000);
            }
        }, 1000);
    }, [user]);

    // ... (UseEffect and Handlers Remain Same) ...
    useEffect(() => {
        const stateTarget = location.state?.target;
        const storageTarget = localStorage.getItem("pendingScan");
        const finalTarget = stateTarget || storageTarget;
        if (finalTarget && !hasScannedRef.current) {
            hasScannedRef.current = true;
            if (storageTarget) localStorage.removeItem("pendingScan");
            navigate(location.pathname, { replace: true, state: {} });
            setTimeout(() => {
                setTarget(finalTarget);
                executeScan(finalTarget);
            }, 100);
        }
    }, [location.state, location.pathname, executeScan, navigate]);
    const handleScan = (e) => { e.preventDefault(); executeScan(target); };
    const handleLoginRedirect = () => { if (target) localStorage.setItem("pendingScan", target); navigate("/login"); };

    const handleExport = () => {
        if (!scanData) return;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFillColor(5, 10, 25);
        doc.rect(0, 0, 210, 297, "F");
        doc.setTextColor(0, 255, 255);
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text("THREATSCOPE", pageWidth / 2, 100, { align: "center" });
        doc.setFontSize(14);
        doc.setTextColor(200, 200, 200);
        doc.text("CLASSIFIED INTELLIGENCE DOSSIER", pageWidth / 2, 115, { align: "center" });
        doc.text(`TARGET: ${scanData.target.toUpperCase()}`, pageWidth / 2, 140, { align: "center" });
        doc.text(`DATE: ${new Date().toLocaleString()}`, pageWidth / 2, 148, { align: "center" });

        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, "F");
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("1. EXECUTIVE RISK ASSESSMENT", 14, 20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Overall Risk Score: ${scanData.riskScore}/100`, 14, 30);
        doc.text(`Primary IP: ${scanData.ip}`, 14, 36);
        doc.text(`Geo-Location: ${scanData.geo.city}, ${scanData.geo.country}`, 14, 42);

        // --- NEW: SSL IN PDF ---
        doc.text(`SSL Issuer: ${scanData.ssl_info?.issuer || "N/A"}`, 14, 48);
        doc.text(`SSL Expiry: ${scanData.ssl_info?.days_left || 0} Days Remaining`, 14, 54);

        const breakdown = [];
        const highRisk = [21, 22, 23, 445, 3389, 3306, 5432, 6379, 27017];
        const medRisk = [8080, 8443, 3000, 5000, 8888];

        scanData.ports.forEach(p => {
            if (highRisk.includes(p)) breakdown.push([`Open Port ${p}`, "+20 (Critical Service)"]);
            else if (medRisk.includes(p)) breakdown.push([`Open Port ${p}`, "+10 (Dev Service)"]);
            else breakdown.push([`Open Port ${p}`, "+2 (Standard Web)"]);
        });

        const issues = scanData.security_issues || [];
        issues.forEach(i => {
            if (i.includes("Missing")) breakdown.push([i, "+1 (Security Gap)"]);
        });

        const tech = scanData.tech_stack || [];
        if (tech.length > 0) breakdown.push([`${tech.length} Technologies Detected`, `+${tech.length * 2} (Attack Surface)`]);

        if (scanData.ssl_info?.valid === false) breakdown.push(["Invalid SSL Certificate", "+20 (Critical Risk)"]);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("2. SCORE CALCULATION BREAKDOWN", 14, 70);

        autoTable(doc, {
            startY: 75,
            head: [['Risk Factor Identified', 'Score Impact']],
            body: breakdown.length ? breakdown : [['No Significant Risks Detected', '+0']],
            theme: 'striped',
            headStyles: { fillColor: [200, 0, 0] }
        });

        // --- NEW: DNS RECORDS IN PDF ---
        const dnsY = doc.lastAutoTable.finalY + 15;
        doc.text("3. DNS RECONNAISSANCE", 14, dnsY);
        const dnsData = [];
        scanData.dns_records?.mx?.forEach(mx => dnsData.push(["MX (Mail)", mx]));
        scanData.dns_records?.ns?.forEach(ns => dnsData.push(["NS (Nameserver)", ns]));

        autoTable(doc, {
            startY: dnsY + 5,
            head: [['Record Type', 'Value']],
            body: dnsData.length ? dnsData : [['No DNS Records Found', 'N/A']],
            theme: 'grid'
        });

        doc.save(`ThreatScope_Dossier_${scanData.target}.pdf`);
    };

    return (
        <div className="flex h-screen w-full flex-col bg-[#050505] text-white overflow-hidden relative">
            <div className="absolute inset-0 z-0">
                <Globe3D targetLoc={coords} />
            </div>

            <div className="relative z-10 flex flex-1 flex-col w-full h-full pointer-events-none pt-20">
                {viewMode === "SEARCH" && (
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl pointer-events-auto transition-opacity duration-1000 ${searching ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="bg-black/60 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                            <h1 className="text-center text-4xl font-bold text-white mb-2 tracking-widest">THREAT<span className="text-cyan-500">SCOPE</span></h1>
                            <p className="text-center text-cyan-200/60 font-mono mb-8">ENTERPRISE RECONNAISSANCE GRID</p>
                            <form onSubmit={handleScan} className="relative flex w-full items-center">
                                <Search className="absolute left-4 text-cyan-500" />
                                <input type="text" placeholder="Target IP or Domain (e.g., google.com)" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded bg-black/50 border border-cyan-900 px-12 py-4 text-lg text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all font-mono" />
                                <button type="submit" disabled={searching} className="absolute right-2 rounded bg-cyan-700 px-6 py-2 font-bold text-white hover:bg-cyan-600 transition-all">SCAN</button>
                            </form>
                            {!user && <p className="text-gray-500 text-xs mt-4 text-center">Guest Mode: Simulation Protocol Active.</p>}
                            {error && <p className="text-red-400 text-xs mt-4 text-center font-mono bg-red-900/20 py-2 rounded">{error}</p>}
                        </div>
                    </div>
                )}

                {viewMode === "LOCKED" && (
                    <div className="flex h-full w-full p-6 gap-6 items-center justify-start pl-20">
                        {loading && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm animate-fade-in">
                                <Loader2 size={80} className="text-cyan-500 mb-6 animate-spin" />
                                <h3 className="text-3xl font-bold text-white animate-pulse tracking-widest">ESTABLISHING UPLINK...</h3>
                                <p className="text-sm text-cyan-400 font-mono mt-4">RESOLVING DNS... SECURING HANDSHAKE...</p>
                                <div className="w-96 bg-gray-900 h-1 mt-8 rounded overflow-hidden">
                                    <div className="h-full bg-cyan-500 animate-progress"></div>
                                </div>
                            </div>
                        )}

                        {!loading && scanData && (
                            <div className="w-137.5 h-fit bg-black/80 border border-cyan-500/50 rounded-xl backdrop-blur-xl shadow-2xl p-10 pointer-events-auto animate-slide-right flex flex-col gap-6 relative overflow-hidden">
                                {!user && !analyzing && (
                                    <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border-2 border-cyan-500/30 m-2 rounded-lg">
                                        <Lock size={64} className="text-cyan-500 mb-4 animate-bounce" />
                                        <h3 className="text-2xl font-bold text-white mb-2">CLASSIFIED INTEL</h3>
                                        <p className="text-sm text-gray-400 mb-6">Full Threat Analysis Is Restricted To Authorized Personnel.</p>
                                        <button onClick={handleLoginRedirect} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all">LOGIN TO DECRYPT</button>
                                    </div>
                                )}
                                <div className="border-b border-gray-700 pb-4">
                                    <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                                        {analyzing ? <Loader2 className="animate-spin text-cyan-400" /> : <Shield className="text-cyan-400" />}
                                        {analyzing ? "ANALYZING TARGET..." : "TARGET SUMMARY"}
                                    </h2>
                                    <p className="text-cyan-400 font-mono text-sm mt-1 truncate">{scanData.target.toUpperCase()}</p>
                                </div>
                                <div className="flex flex-col items-center py-2"><RiskGauge score={scanData.riskScore} analyzing={analyzing} /></div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm border-b border-gray-800 pb-2">
                                        <span className="text-gray-400 flex items-center gap-2"><Terminal size={14} /> IP Address</span>
                                        <span className={`font-mono ${analyzing ? 'blur-sm text-gray-500' : 'text-white'}`}>{analyzing ? "192.XXX.XXX.XXX" : scanData.ip}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-gray-800 pb-2">
                                        <span className="text-gray-400 flex items-center gap-2"><MapPin size={14} /> Location</span>
                                        <span className={`font-mono ${analyzing ? 'blur-sm text-gray-500' : 'text-white'}`}>{analyzing ? "TRIANGULATING..." : scanData.geo.country}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-gray-800 pb-2">
                                        <span className="text-gray-400 flex items-center gap-2"><Globe size={14} /> ISP Org</span>
                                        <span className={`font-mono ${analyzing ? 'blur-sm text-gray-500' : 'text-white'}`}>{analyzing ? "LOOKUP..." : (scanData.geo.org || "Unknown").substring(0, 25)}</span>
                                    </div>
                                </div>
                                <button onClick={() => user ? setViewMode("REPORT") : handleLoginRedirect()} disabled={analyzing} className={`w-full font-bold py-4 rounded shadow-[0_0_15px_rgba(8,145,178,0.4)] flex items-center justify-center gap-2 transition-all ${analyzing ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}>
                                    {analyzing ? "PROCESSING..." : "VIEW FULL REPORT"} <ChevronRight size={16} />
                                </button>
                                <button onClick={() => { setViewMode("SEARCH"); setCoords(null); }} className="text-center text-xs text-gray-500 hover:text-white z-50 relative">CANCEL SCAN</button>
                            </div>
                        )}
                    </div>
                )}

                {/* --- STATE 3: REPORT OVERLAY --- */}
                {viewMode === "REPORT" && scanData && (
                    <div className="absolute inset-0 bg-[#0a0a0a] z-50 overflow-y-auto pointer-events-auto animate-fade-in p-8 pt-24">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-white flex items-center gap-3"><Lock className="text-cyan-500" /> MISSION REPORT</h1>
                                <p className="text-gray-500 font-mono mt-2">TARGET: {scanData.target.toUpperCase()}</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleExport} className="bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 px-8 py-3 rounded hover:bg-cyan-500/20 flex items-center gap-2 font-bold transition-all"><Download size={20} /> EXPORT PDF</button>
                                <button onClick={() => setViewMode("LOCKED")} className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 flex items-center gap-2 font-bold"><X size={20} /> CLOSE</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-6">
                                {/* SSL CARD */}
                                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg"><CheckCircle size={20} className="text-green-500" /> SSL ENCRYPTION</h3>
                                    {scanData.ssl_info?.valid ? (
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-400 uppercase">Issuer</p>
                                            <p className="text-cyan-400 font-bold">{scanData.ssl_info.issuer.substring(0, 30)}...</p>
                                            <p className="text-xs text-gray-400 uppercase mt-2">Expires In</p>
                                            <p className="text-white font-mono">{scanData.ssl_info.days_left} Days</p>
                                        </div>
                                    ) : <p className="text-red-500 font-bold">NO VALID CERTIFICATE FOUND</p>}
                                </div>

                                <div className="bg-red-950/10 border border-red-900/50 p-6 rounded-xl">
                                    <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2 text-lg"><AlertTriangle size={20} /> CRITICAL ISSUES</h3>
                                    <ul className="space-y-3">
                                        {scanData.security_issues?.length > 0 ? scanData.security_issues.map((issue, i) => (
                                            <li key={i} className="text-sm text-gray-300 border-l-2 border-red-500 pl-3">{issue}</li>
                                        )) : <li className="text-sm text-gray-500">No Critical Configuration Gaps Found.</li>}
                                    </ul>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                {/* DNS INTELLIGENCE */}
                                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
                                    <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 text-lg"><Cloud size={20} /> DNS INTELLIGENCE</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-xs text-gray-500 font-bold uppercase mb-2">Mail Servers (MX)</h4>
                                            {scanData.dns_records?.mx?.length ? scanData.dns_records.mx.map((mx, i) => <p key={i} className="text-xs font-mono text-gray-300 truncate">{mx}</p>) : <p className="text-xs text-gray-600">None</p>}
                                        </div>
                                        <div>
                                            <h4 className="text-xs text-gray-500 font-bold uppercase mb-2">Nameservers (NS)</h4>
                                            {scanData.dns_records?.ns?.length ? scanData.dns_records.ns.map((ns, i) => <p key={i} className="text-xs font-mono text-gray-300 truncate">{ns}</p>) : <p className="text-xs text-gray-600">None</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
                                    <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 text-lg"><Server size={20} /> TECHNOLOGY STACK</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {scanData.tech_stack?.length > 0 ? scanData.tech_stack.map((t, i) => (
                                            <span key={i} className="bg-cyan-950/40 border border-cyan-800/50 text-cyan-200 px-4 py-2 rounded text-sm font-bold tracking-wide">{t}</span>
                                        )) : (
                                            <span className="text-gray-500 italic">No Explicit Tech Headers Found</span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
                                    <h3 className="text-gray-300 font-bold mb-4 flex items-center gap-2 text-lg"><Shield size={20} /> PORT SCAN ANALYSIS</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-xs text-gray-500 border-b border-gray-800">
                                                    <th className="pb-3 pl-2">PORT</th>
                                                    <th className="pb-3">SERVICE</th>
                                                    <th className="pb-3">RISK LEVEL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scanData.ports?.map((port) => {
                                                    const risk = getRisk(port);
                                                    return (
                                                        <tr key={port} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                                            <td className="py-4 pl-2 font-mono text-white font-bold">{port}</td>
                                                            <td className="py-4 text-gray-400">TCP/OPEN</td>
                                                            <td className="py-4"><span className={`text-xs px-3 py-1 rounded font-bold ${risk.color}`}>{risk.level}</span></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;