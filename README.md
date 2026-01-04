# Zappy Vendor Event Tracker

A robust, mobile-responsive web application for vendor event check-ins and tracking. Built with **Next.js 16** and **Redux Toolkit**, this application ensures a seamless experience for vendors to verify their identity and log their location on event days.

## 📱 Tech Stack

### Frontend
-   **Next.js 16 (App Router)**: For high-performance, server-rendered React applications.
-   **React 19**: Leveraging the latest features for building interactive UIs.
-   **Tailwind CSS 4**: Utility-first CSS framework for rapid, responsive design.
-   **Redux Toolkit**: For centralized and predictable state management.
-   **Lucide React**: For consistent and beautiful icons.

### Backend (Integration)
-   **Next.js API Routes**: Handling backend logic, such as email sending.
-   **Nodemailer**: For sending transactional emails (OTP codes).

### Functionality & Features

#### 1. 🔐 Secure OTP Verification
A multi-step verification flow ensuring only authorized vendors can access the system.
-   **Email Validation**: Checks for valid email formats.
-   **One-Time Password (OTP)**: Generates a 6-digit code sent via email.
-   **Security**: Includes a 30-second expiry timer and a lockout mechanism after 3 failed attempts.

#### 2. 📍 Location & Check-In
Ensures vendors are physically present at the event location.
-   **Geolocation with Retry Logic**: 
    -   Automatically attempts to fetch location up to **3 times**.
    -   Falls back to lower accuracy modes if high-precision GPS fails, handling "Permission denied" or "Unavailable" errors gracefully.
-   **Photo Evidence**: Requires vendors to take or upload an arrival photo.

#### 3. 📊 Dashboard & State Management
-   **Persistent State**: Redux slices (`startOtpSlice`, `eventSlice`, etc.) manage application state across different views.
-   **Progress Tracking**: Tracks the vendor's journey from "Not Started" to "Checked In".

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+ installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/AmitKumar2k2/Zappy.git
    cd Zappy
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

```
d:/Zappy/
├── app/                  # Next.js App Router pages
│   ├── api/              # API routes (e.g., send-otp)
│   ├── dashboard/        # Main vendor dashboard
│   ├── event/            # Event workflow pages (check-in, etc.)
│   └── globals.css       # Global styles (Tailwind)
├── components/           # Reusable React components
│   ├── features/         # Feature-specific components (LocationFetcher, PhotoUploader)
│   ├── layout/           # Layout components (Header, etc.)
│   └── ui/               # Generic UI components (Buttons, Inputs, Cards)
├── store/                # Redux store configuration
│   ├── slices/           # State slices (checkIn, event, otp, ui)
│   └── provider.tsx      # Redux provider wrapper
└── lib/                  # Utility functions
```

## 🧩 Key Highlights
-   **Resilient Components**: The `LocationFetcher` component is designed to handle real-world connectivity issues by implementing retry mechanisms and adaptive accuracy requirements.
-   **Mock & Real Modes**: The application is structured to support both mock data (for testing) and real API integrations.
-   **User Feedback**: Comprehensive toast notifications keep users informed of every action (success, error, or warning).

---
*Built for Zappy Event Management*
