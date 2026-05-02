# Deployment Guide - Flakes.pdf

This guide explains how to deploy the **Flakes.pdf** application (Java Spring Boot backend + React frontend).

---

## 1. Backend Deployment (e.g., Render)

Since the backend requires **Ghostscript** for PDF compression, the best way to deploy is using **Docker**.

### Steps for Render:
1.  **New Web Service**: Create a new Web Service on Render and connect your GitHub repository.
2.  **Runtime**: Select **Docker**.
3.  **Advanced Settings**:
    - **Root Directory**: `backend-java`
4.  **Environment Variables**:
    - `MONGO_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A long random string (e.g., `your-secret-key-12345`).
    - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://flakes-pdf.vercel.app`).
    - `GS_PATH`: `/usr/bin/gs` (Docker will install it there).
5.  **Deploy**: Render will build the Docker image and start the service.

---

## 2. Frontend Deployment (e.g., Vercel / Netlify)

The frontend is a standard Vite React app.

### Steps for Vercel:
1.  **New Project**: Connect your GitHub repository.
2.  **Root Directory**: `frontend`
3.  **Framework Preset**: Vite
4.  **Environment Variables**:
    - `VITE_API_BASE_URL`: Your deployed backend URL (e.g., `https://flakes-backend.onrender.com`).
5.  **Build & Deploy**: Vercel will build and host your site.

---

## 3. Important Links & Variables to Sync

| Variable | File Reference | Where to set it |
| :--- | :--- | :--- |
| **`VITE_API_BASE_URL`** | `frontend/src/api.js` | Frontend Hosting (Vercel/Netlify) |
| **`ALLOWED_ORIGINS`** | `SecurityConfig.java` | Backend Hosting (Render/Railway) |
| **`MONGO_URI`** | `application.properties` | Backend Hosting (Render/Railway) |
| **`JWT_SECRET`** | `JwtUtils.java` | Backend Hosting (Render/Railway) |

---

## 📄 Dockerfile (for Backend)
I have created a `Dockerfile` in the `backend-java` folder. It automatically:
- Installs **Java 17**.
- Installs **Ghostscript**.
- Builds your Spring Boot application.
- Starts the server on the correct port.

---

## 🛠️ Local Testing before Deploy
Before you push to GitHub, make sure everything works locally:
1.  **Backend**: `mvn clean install` in `backend-java`.
2.  **Frontend**: `npm run build` in `frontend` to check for build errors.
