# OTP Input Authentication – Monorepo

A full‑stack **OTP-based email verification system** built as a **monorepo**, with a React (Vite) frontend and a Node.js (Express) backend.

Live URL : https://verifyemailviaotp.netlify.app/

The project demonstrates:

* OTP generation & email delivery
* OTP verification flow
* Monorepo setup with shared local package
* Production deployment using **Netlify (Frontend)** and **Render (Backend)**

---

## 📁 Project Structure

```text
otp-input-monorepo/
├── client/        # Frontend (React + Vite)
├── server/        # Backend (Node.js + Express)
├── netlify.toml   # Netlify monorepo configuration
├── package.json   # Root scripts (concurrently)
└── README.md
```

---

## 🛠 Tech Stack

### Frontend

* React 19
* Vite
* JavaScript (ES Modules)
* Fetch API

### Backend

* Node.js
* Express
* MongoDB (Mongoose)
* Nodemailer (Email OTP)
* JSON Web Token (JWT)
* CORS

### Dev / Tooling

* Monorepo (local package linking)
* Concurrently
* Netlify (Frontend hosting)
* Render (Backend hosting)

---

## 🚀 Local Development Setup

### 1️⃣ Clone the repository

```bash
git clone <repo-url>
cd otp-input-monorepo
```

---

### 2️⃣ Install dependencies (client + server)

```bash
npm run install:all
```

---

### 3️⃣ Environment Variables

#### Server (`server/.env`)

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

> ⚠️ Do not commit `.env` files

---

### 4️⃣ Run the project locally

```bash
npm run dev
```

* Frontend → `http://localhost:5173`
* Backend → `http://localhost:5000`

---

## 🔐 OTP Authentication Flow

1. User enters email in frontend
2. Frontend sends request to backend
3. Backend:

   * Generates OTP
   * Sends OTP via email
   * Stores OTP temporarily
4. User enters OTP
5. Backend verifies OTP
6. Verification success / failure response returned

---

## 🌍 Production Deployment

### Backend (Render)

* Create a **Web Service**
* Root Directory: `server`
* Build Command:

  ```bash
  npm install
  ```
* Start Command:

  ```bash
  npm start
  ```

#### Render Environment Variables

```env
PORT=10000
MONGO_URL=...
EMAIL_USER=...
EMAIL_PASS=...
JWT_SECRET=...
CLIENT_URL=https://verifyemailviaotp.netlify.app
```

---

### Frontend (Netlify)

Deployment handled via `netlify.toml` at repo root.

```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Netlify Environment Variables

```env
VITE_API_URL=https://otp-input-1.onrender.com
```
---

## 👩‍💻 Author

**Vijayashree**
Frontend Developer

---

## ⭐ Future Improvements

* Rate limiting OTP requests
* OTP expiration cleanup job
* UI validation & error handling
* Unit & integration tests

---

Feel free to fork, explore, and extend 🚀
