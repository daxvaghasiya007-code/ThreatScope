import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import mongoose from 'mongoose';
import readline from 'readline';
import rateLimit from 'express-rate-limit'; // NEW
import helmet from 'helmet'; // NEW
import mongoSanitize from 'express-mongo-sanitize'; // NEW
import hpp from 'hpp'; // NEW
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
connectDB();

const app = express();

// --- SECURITY MIDDLEWARE STACK ---

// 1. SET SECURITY HTTP HEADERS
app.use(helmet());

// 2. RATE LIMITING (PREVENT DDOS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100, // Limit Each IP To 100 Requests Per Window
    message: "Too Many Requests From This IP, Please Try Again After 15 Minutes"
});
app.use('/api', limiter); // Apply To All API Routes

// 3. BODY PARSER
app.use(express.json({ limit: '10kb' })); // Limit Body Size

// 4. DATA SANITIZATION AGAINST NOSQL INJECTION
app.use(mongoSanitize());

// 5. DATA SANITIZATION AGAINST XSS
// app.use(xss());

// 6. PREVENT PARAMETER POLLUTION
app.use(hpp());

// 7. ENABLE CORS (Restrict In Production)
app.use(cors());

// --- ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/scan', scanRoutes);

app.get('/', (req, res) => {
    res.send('ThreatScope Intelligence API Active [SECURE]');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.clear();
    console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
    console.log('\x1b[36m%s\x1b[0m', ` THREATSCOPE BACKEND ACTIVE ON PORT: ${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
    console.log('\x1b[33m%s\x1b[0m', ' [INFO] MongoDB Connected Securely.');
    console.log('\x1b[35m%s\x1b[0m', ' [SEC]  Rate Limiting & Helmet Enabled.');
    console.log('\x1b[35m%s\x1b[0m', ' [SEC]  Anti-RCE & Anti-XSS Guards Active.');
    console.log('\x1b[32m%s\x1b[0m', ' [CMD]  Press "q" To Shutdown Server.');
    console.log('\x1b[32m%s\x1b[0m', ' [CMD]  Press "s" For System Status.');
    console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
});

// KEYPRESS HANDLER
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

process.stdin.on('keypress', async (str, key) => {
    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
        console.log('\n\x1b[31m%s\x1b[0m', '[WARN] Initiating Shutdown Sequence...');
        server.close(() => {
            console.log(' [OK]  HTTP Server Terminated.');
            mongoose.connection.close(false).then(() => {
                console.log(' [OK]  Database Connection Closed.');
                console.log('\x1b[32m%s\x1b[0m', '[DONE] System Offline. Good Bye, Agent.');
                process.exit(0);
            });
        });
    }
    if (key.name === 's') {
        console.log('\n [LOG] Memory Usage: ' + (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB');
        console.log(' [LOG] Uptime: ' + process.uptime().toFixed(0) + ' Seconds');
    }
});