# ThreatScope 🔍

**Enterprise OSINT And Reconnaissance Platform**

Automated SSL, DNS, Port Scanning, And Tech Stack Detection — Built With Python And Node.js.

---

## What It Does

ThreatScope Accepts A Target Domain Or IP And Runs A Full Passive Reconnaissance Pipeline:

| Module                   | What It Detects                                 |
|--------------------------|-------------------------------------------------|
| **SSL Analysis**         | Certificate Validity, Issuer, Expiry Date, SANs |
| **DNS Enumeration**      | A, MX, NS, TXT, CNAME Records                   |
| **Port Scanning**        | Open Ports With Service Detection               |
| **Tech Stack Detection** | Web Server, Frameworks, CMS, CDN Fingerprinting |

Results Are Returned Via A Clean REST API And Displayed On A React Dashboard.

---

## Tech Stack

**Backend** — Node.js + Express  
**Scanning Engine** — Python (`requests`, `dnspython`)  
**Frontend** — React + Vite  
**Database** — MongoDB (via Mongoose)

---

## Project Structure

```
ThreatScope/
├── backend/
│   ├── config/          # Database And App Config
│   ├── controllers/     # Route Logic
│   ├── middleware/      # Auth And Error Handling
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # API Endpoints
│   └── server.js        # Entry Point
├── frontend/
│   ├── src/             # React Components And Pages
│   ├── public/          # Static Assets
│   └── index.html
└── scripts/
    └── scan_target.py   # Python Reconnaissance Engine
```

---

## Setup And Installation

### Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB (Local Or Atlas)

### Backend

```bash
cd backend
npm install
# Add your .env (see .env.example)
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Python Engine

```bash
cd scripts
pip install requests dnspython
python scan_target.py
```

---

## Environment Variables

Create A `.env` File In The `backend/` Directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## Features

- Single-Input Scan Interface — Enter Domain, Get Full Recon Report
- Modular Python Backend For Extensible Scan Modules
- REST API Architecture — Scan Results Served As JSON
- React Dashboard With Real-Time Result Display
- MongoDB Storage For Scan History

---

## Use Cases

- **Security Research** — Passive Recon On Authorized Targets
- **Bug Bounty Prep** — Quick Tech Stack And SSL Fingerprinting
- **Penetration Testing** — Pre-Engagement Reconnaissance Phase
- **CTF Challenges** — Fast Domain Intelligence Gathering

---

## Disclaimer

ThreatScope Is Built For **Authorized Security Research Only**.  
Use On Targets You Own Or Have Explicit Written Permission To Test.  
Unauthorized Use Is Illegal Under The CFAA And Equivalent Laws.