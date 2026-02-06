# School Helpdesk

**[LAN Testing Guide](docs/LAN_GUIDE.md)** | **[Security Checklist](docs/SECURITY_CHECKLIST.md)** | **[Deployment Guide](docs/DEPLOYMENT_CHECKLIST.md)**

## How to run locally on mobile (LAN Access)

To access the application from other devices on your local network (e.g., mobile phone, tablet):

1.  **Find your PC's LAN IP address**:
    - Open a terminal and run `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
    - Look for the IPv4 Address (e.g., `192.168.1.50`).

2.  **Configure Frontend**:
    - Build the frontend environment file:
      ```bash
      cp frontend/.env.local.example frontend/.env.local
      ```
    - Open `frontend/.env.local` and set `NEXT_PUBLIC_API_BASE_URL` to your PC's IP address:
      ```env
      NEXT_PUBLIC_API_BASE_URL=http://192.168.1.50:4000
      ```
      *(Replace `192.168.1.50` with your actual IP)*

3.  **Start the Application**:
    - **Backend**: Ensure the backend is running (either via Docker or locally). It is configured to listen on `0.0.0.0` (all interfaces).
    - **Frontend**: Run the dev server:
      ```bash
      cd frontend
      npm run dev
      ```
      The frontend will now be accessible at `http://0.0.0.0:3000`.

4.  **Access from Mobile**:
    - Connect your mobile device to the same Wi-Fi network.
    - Open your mobile browser and go to `http://<YOUR_LAN_IP>:3000` (e.g., `http://192.168.1.50:3000`).
    - You should be able to log in and use the application.

## Mobile testing in LAN

The application is configured to automatically detect the backend URL based on the hostname.
If you access the frontend via `http://192.168.1.50:3000`, it will try to connect to the backend at `http://192.168.1.50:4000`.

**Important:** If you change `.env.local`, you MUST restart the dev server (`npm run dev`) for changes to take effect.
