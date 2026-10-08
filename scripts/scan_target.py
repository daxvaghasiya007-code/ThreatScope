import sys
import json
import socket
import requests
import ssl
import dns.resolver
import datetime
import urllib3
import re
from urllib.parse import urlparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --- 1. THE MASSIVE TECH MAP (RESTORED) ---
TECH_MAP = {
    "gws": "Google Web Server (GWS)",
    "nginx": "Nginx Web Server",
    "apache": "Apache HTTP Server",
    "cloudflare": "Cloudflare CDN & WAF",
    "php": "PHP Backend",
    "asp.net": "Microsoft ASP.NET",
    "express": "Express.js (Node)",
    "laravel": "Laravel PHP Framework",
    "django": "Django Python Framework",
    "rails": "Ruby on Rails",
    "spring": "Spring Boot (Java)",
    "vue": "Vue.js Frontend",
    "react": "React.js Frontend",
    "angular": "Angular Framework",
    "bootstrap": "Bootstrap UI Library",
    "jquery": "jQuery Library",
    "shopify": "Shopify Commerce",
    "wordpress": "WordPress CMS",
    "drupal": "Drupal CMS",
    "joomla": "Joomla CMS",
    "wix": "Wix Website Builder",
    "squarespace": "Squarespace",
    "amazons3": "AWS S3 Bucket",
    "ubuntu": "Ubuntu Linux Server",
    "centos": "CentOS Linux Server",
    "debian": "Debian Linux Server",
    "windows": "Windows Server",
    "lite": "LiteSpeed Web Server",
    "openresty": "OpenResty",
    "caddy": "Caddy Web Server",
    "next.js": "Next.js Framework",
    "nuxt": "Nuxt.js Framework",
    "gatsby": "Gatsby Generator",
    "hugo": "Hugo Generator",
    "jekyll": "Jekyll Generator",
    "sentry": "Sentry Monitoring",
    "newrelic": "New Relic Monitoring",
    "stripe": "Stripe Payment",
    "paypal": "PayPal Gateway",
    "recaptcha": "Google reCAPTCHA",
    "fontawesome": "FontAwesome Icons",
    "webpack": "Webpack Bundler"
}


def expand_tech(name):
    for k, v in TECH_MAP.items():
        if k in name.lower():
            return v
    return name


def check_port(ip, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.4)
        result = sock.connect_ex((ip, port))
        sock.close()
        return result == 0
    except:
        return False

# --- 2. SSL SPY (KEPT FROM UPDATE) ---


def get_ssl_info(hostname):
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.settimeout(3)
            s.connect((hostname, 443))
            cert = s.getpeercert()

            subject = dict(x[0] for x in cert['subject'])
            issuer = dict(x[0] for x in cert['issuer'])
            not_after = datetime.datetime.strptime(
                cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
            days_left = (not_after - datetime.datetime.now()).days

            return {
                "valid": True,
                "issuer": issuer.get('organizationName', 'Unknown CA'),
                "expires": not_after.strftime('%Y-%m-%d'),
                "days_left": days_left
            }
    except:
        return {"valid": False, "issuer": "None", "expires": "N/A", "days_left": 0}

# --- 3. DNS RECON (KEPT FROM UPDATE) ---


def get_dns_records(domain):
    records = {"mx": [], "txt": [], "ns": []}
    try:
        try:
            mx = dns.resolver.resolve(domain, 'MX')
            for r in mx:
                records["mx"].append(str(r.exchange).rstrip('.'))
        except:
            pass

        try:
            ns = dns.resolver.resolve(domain, 'NS')
            for r in ns:
                records["ns"].append(str(r.target).rstrip('.'))
        except:
            pass

        try:
            txt = dns.resolver.resolve(domain, 'TXT')
            for r in txt:
                t = str(r).strip('"')
                if len(t) < 60:
                    records["txt"].append(t)
        except:
            pass
    except:
        pass
    return records


def scan_target(domain):
    data = {
        "target": domain,
        "timestamp": datetime.datetime.now().isoformat(),
        "ip": "Unknown",
        "geo": {"country": "Unknown", "city": "Unknown", "org": "Unknown"},
        "ports": [],
        "tech_stack": [],
        "security_issues": [],
        "header_audit": {},
        "ssl_info": {},
        "dns_records": {}
    }

    # 1. IP & GEO
    try:
        ip = socket.gethostbyname(domain)
        data["ip"] = ip
        try:
            r = requests.get(
                f"http://ip-api.com/json/{ip}?fields=country,city,org,lat,lon", timeout=3)
            geo = r.json()
            data["geo"] = {
                "country": geo.get("country", "Unknown"),
                "city": geo.get("city", "Unknown"),
                "org": geo.get("org", "Unknown"),
                "loc": f"{geo.get('lat', 0)},{geo.get('lon', 0)}"
            }
        except:
            pass
    except:
        print(json.dumps({"error": "Host Unreachable"}))
        sys.exit(0)

    # 2. PORTS
    ports = [21, 22, 23, 25, 53, 80, 443, 3306, 5432, 8080, 8443]
    for p in ports:
        if check_port(ip, p):
            data["ports"].append(p)

    # 3. DEEP WEB ANALYSIS (RESTORED BEAST MODE)
    try:
        url = f"https://{domain}"
        try:
            res = requests.get(url, timeout=5, verify=False)
        except:
            url = f"http://{domain}"
            res = requests.get(url, timeout=5)

        headers = res.headers
        content = res.text.lower()

        # A. HEADERS CHECK
        for h, v in headers.items():
            h_low = h.lower()
            # Restore Tech Detection from Headers
            if h_low in ["server", "x-powered-by", "via", "x-generator"]:
                data["tech_stack"].append(expand_tech(v))

            # Audit Security Headers
            if h_low in ["strict-transport-security", "content-security-policy", "x-frame-options"]:
                data["header_audit"][h] = "PASS"

        # Check Missing Headers
        security_headers = ["Strict-Transport-Security",
                            "Content-Security-Policy", "X-Frame-Options"]
        for sh in security_headers:
            found = False
            for h in headers:
                if h.lower() == sh.lower():
                    found = True
            if not found:
                data["header_audit"][sh] = "FAIL"
                data["security_issues"].append(f"Missing {sh}")

        # B. CONTENT FINGERPRINTING (RESTORED)
        for tech_key in TECH_MAP.keys():
            # Check if key exists in HTML content (e.g., "wp-content", "react", "bootstrap")
            if tech_key in content and len(tech_key) > 3:
                tech_name = TECH_MAP[tech_key]
                if tech_name not in data["tech_stack"]:
                    data["tech_stack"].append(tech_name)

    except Exception as e:
        data["security_issues"].append("Web Scan Blocked/Failed")

    # 4. SSL & DNS (NEW FEATURES)
    data["ssl_info"] = get_ssl_info(domain)
    data["dns_records"] = get_dns_records(domain)

    # CLEANUP
    data["tech_stack"] = list(set(data["tech_stack"]))

    # CRITICAL FIX: IF EMPTY, ADD DEFAULT SO FRONTEND DOESN'T SAY "SCANNING..."
    if not data["tech_stack"]:
        data["tech_stack"].append("Unknown / Custom Stack")

    print(json.dumps(data))


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_arg = sys.argv[1]
        # Handle URL vs Domain input
        if "://" in target_arg:
            domain_arg = urlparse(target_arg).netloc
        else:
            domain_arg = target_arg

        scan_target(domain_arg)
    else:
        print(json.dumps({"error": "No Input"}))
