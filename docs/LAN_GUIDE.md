# LAN Testing Guide (Mobile/Tablet)

This guide explains how to test the application from other devices on the same Wi-Fi network.

## 1. Prerequisites
- **Computer and Mobile** must be on the **SAME** Wi-Fi network.
- **Node.js** app (Next.js) must be running (`npm run dev -- -H 0.0.0.0`).
- **Backend** (Docker) must be running.

## 2. Find your IP Address
On your development PC:

**Windows**:
1. Open PowerShell.
2. Run `ipconfig`.
3. Look for **IPv4 Address** (usually `192.168.x.x` or `10.x.x.x`).

## 3. Configure Mobile Device
No special configuration needed. The app automatically detects the IP.

## 4. How to Access
Open your mobile browser (Chrome/Safari) and type:

`http://<YOUR_PC_IP>:3000`

**Example**: `http://192.168.1.15:3000`

## 5. Troubleshooting

**"Connection Refused" / Site cannot be reached**
- Check Windows Firewall. You might need to allow Node.js / port 3000 and 4000 through firewall.
- Temporarily disable firewall to test.

**"Login Error" / Network Error**
- Go to `http://<YOUR_PC_IP>:4000/health` on your mobile.
- If this returns `{ "status": "ok" }`, backend is reachable.
- If backend is reachable but login fails, check Console in PC browser for CORS errors.

**Frontend loads but APIs fail**
- Ensure you restarted `npm run dev` after changing configuration.
