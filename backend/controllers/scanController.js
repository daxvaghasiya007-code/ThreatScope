// ... (Imports And Security Checks Remain The Same) ...
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import Scan from "../models/scanModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const scanTarget = async (req, res) => {
    const { target } = req.body;

    if (!target) {
        return res.status(400).json({ message: "Target Domain Is Required" });
    }

    const safeInputRegex = /^[a-zA-Z0-9.:\/-]+$/;

    if (!safeInputRegex.test(target)) {
        console.log(`[BLOCK] Malicious Input Detected: ${target}`);
        return res.status(400).json({ message: "Security Alert: Invalid Characters Detected (RCE Prevention Active)." });
    }

    const scriptPath = path.join(__dirname, "../../scripts/scan_target.py");
    const command = `python "${scriptPath}" ${target}`;

    exec(command, async (error, stdout, stderr) => {
        if (error && !stdout) {
            console.error("Critical Python Error:", error);
            return res.status(500).json({ message: "Scan Engine Failure. Check Server Logs." });
        }

        try {
            const jsonStartIndex = stdout.indexOf('{');
            const jsonString = stdout.substring(jsonStartIndex);
            const result = JSON.parse(jsonString);

            if (result.error) return res.status(400).json({ message: result.error });

            // SCORING
            let calculatedScore = 0;
            const ports = result.ports || [];
            const issues = result.security_issues || [];
            const tech = result.tech_stack || [];
            const ssl = result.ssl_info || {}; // NEW

            const highRisk = [21, 22, 23, 445, 3389, 3306, 5432, 6379, 27017];
            const medRisk = [8080, 8443, 3000, 5000, 8888];

            ports.forEach(p => {
                if (highRisk.includes(p)) calculatedScore += 20;
                else if (medRisk.includes(p)) calculatedScore += 10;
                else if (p === 80 || p === 443) calculatedScore += 2;
                else calculatedScore += 5;
            });

            const missingHeaders = issues.filter(i => i.includes("Missing"));
            calculatedScore += (missingHeaders.length * 1);

            calculatedScore += (tech.length * 2);

            // SSL PENALTY
            if (ssl.valid === false) calculatedScore += 20; // No SSL is BAD

            if (calculatedScore < 10) calculatedScore = 10;
            if (calculatedScore > 100) calculatedScore = 100;

            result.riskScore = calculatedScore;

            if (req.user) {
                try {
                    await Scan.create({
                        user: req.user._id,
                        target: result.target,
                        ip: result.ip,
                        location: `${result.geo.city}, ${result.geo.country}`,
                        riskScore: calculatedScore,
                        ports: result.ports,
                        tech_stack: result.tech_stack,
                        security_issues: result.security_issues,
                        ssl_info: result.ssl_info, // NEW
                        dns_records: result.dns_records // NEW
                    });
                } catch (dbError) {
                    console.error("DB Save Error:", dbError);
                }
            }

            res.json(result);

        } catch (parseError) {
            console.error("JSON Error:", parseError);
            res.status(500).json({ message: "Target Host Unreachable Or Timed Out." });
        }
    });
};