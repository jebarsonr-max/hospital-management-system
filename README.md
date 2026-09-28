# Hospital Management System 🏥

A comprehensive Hospital Management System developed as a college project, featuring both a core **C programming reference implementation** and a **responsive Node.js/Express web application**.

---

## 🌟 Project Overview

This project demonstrates how core data structure concepts implemented in C (structures, arrays, linear search, element shifting) translate into modern full-stack web applications using RESTful APIs and responsive frontends.

### Key Highlights
- **Core C Implementation**: Menu-driven console application using standard C structures, arrays, and functions.
- **Web Interface**: Interactive dashboard running on Node.js and Express with in-memory storage (no database setup required).
- **Free Cloud Deployment**: Configured for instant, zero-cost deployment on Render with HTTPS support.

---

## 📋 Features

### 1. Patient Management
- **Add Patient**: Register patients with ID, Name, Age, Gender, Disease, and Phone Number.
- **View Patients**: Display patient records in a clean, formatted table.
- **Search Patient**: Real-time search by ID, Name, or Disease.
- **Delete Patient**: Remove patient records seamlessly.

### 2. Doctor Management
- **Add Doctor**: Register medical specialists with ID, Name, Specialization, and Experience.
- **View Doctors**: Directory listing of available doctors.
- **Delete Doctor**: Remove doctor entries.

### 3. Appointment Booking
- **Book Appointment**: Schedule visits by linking registered patients and doctors with date and time.
- **View Appointments**: Full schedule view showing patient name, assigned doctor, and timings.
- **Cancel Appointment**: Cancel active appointments with 1-click.

### 4. Interactive Dashboard
- Live counter cards for total patients, doctors, and appointments.
- Quick navigation shortcuts.
- Recent patient registration activity.

---

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| **Core Reference** | C Programming Language (GCC) |
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (ES6) |
| **Backend** | Node.js, Express.js |
| **Data Storage** | In-Memory Data Arrays (matches C structure concept) |
| **Deployment** | Render / Any Node.js cloud platform |

---

## 📂 Project Structure

```text
HOSIPTAL MANAGEMENT/
│
├── hospital_management.c   # Original C Core Source Code
├── server.js               # Node.js + Express Backend & REST APIs
├── package.json            # NPM dependencies & scripts
├── render.yaml             # Render free cloud hosting configuration
├── .gitignore              # Files excluded from Git/GitHub
├── README.md               # Project documentation
│
└── public/                 # Web Application Frontend
    ├── index.html          # Single-Page UI & Dashboard
    ├── style.css           # Responsive styles & layout
    └── app.js              # Client-side API integration & DOM logic
```

---

## 💻 Local Setup & Execution

### Running the Web Application (Localhost)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   Visit [http://localhost:3000](http://localhost:3000)

---

### Running the Core C Program

1. **Compile**:
   ```bash
   gcc -o hospital_management hospital_management.c
   ```

2. **Run**:
   - **Windows**: `.\hospital_management.exe`
   - **Linux / macOS**: `./hospital_management`

---

## 🌐 Free Cloud Deployment (Step-by-Step)

Follow these steps to deploy your website online for free on **Render** (no credit card required):

### Step 1: Push Code to GitHub
1. Initialize git and commit files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Hospital Management System"
   ```
2. Create a new public repository on [GitHub](https://github.com/new) named `hospital-management-system`.
3. Link and push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/hospital-management-system.git
   git push -u origin main
   ```

### Step 2: Deploy on Render (Free Tier)
1. Go to [render.com](https://render.com) and sign in using your **GitHub account**.
2. Click **New +** → Select **Web Service**.
3. Choose your `hospital-management-system` repository.
4. Fill in the deployment details:
   - **Name**: `hospital-management-system` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Create Web Service**.

### Step 3: Access Public URL
Once the deployment finishes (takes ~1-2 minutes), Render will give you a live HTTPS link:
`https://hospital-management-system-xxxx.onrender.com`

---

## 🔄 Updating the Live Website

Whenever you make code changes:
```bash
git add .
git commit -m "Update feature or UI"
git push origin main
```
Render automatically detects the GitHub push and redeploys the updated website within seconds!
