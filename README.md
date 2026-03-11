# 🚀 Naksu: Elite Student Productivity & AI Dashboard

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

Naksu is a comprehensive, full-stack web application engineered specifically to supercharge university student productivity. Built with modern web technologies, it serves as a centralized command center for academic tracking, organization management, class representation (Komting) duties, and AI-assisted task execution.

## ✨ Key Technical Highlights (Why Naksu Stands Out)

- **Smart Academic Engine:** Features a custom algorithm that automatically splits "Theory & Practice" courses into distinct scheduling blocks, calculates real-time GPA (IPK/IPS), and manages a 16-meeting attendance matrix using persistent local storage.
- **Seamless AI Integration:** Directly integrates Google's Gemini AI to act as a contextual virtual assistant for brainstorming and problem-solving right on the dashboard.
- **Hybrid State Management:** Strategically utilizes both Server-Side database (PostgreSQL via Prisma & Supabase) for structural data and Client-Side persistent storage (`localStorage`) for high-frequency user interactions (like attendance toggles and draft typing) to ensure zero latency.
- **Pixel-Perfect Responsive UI:** A mobile-first, highly responsive layout with smooth Lottie animations, ensuring a flawless experience from ultra-wide desktop monitors to smartphone screens.

## 🛠️ Core Modules

### 1. 📊 Dashboard & Analytics
- **Productivity Streak:** Gamified daily streak tracking using high-performance 60fps DotLottie animations.
- **Dynamic Counters:** Tracks active academic tasks, daily YouTube tech-video targets, and countdowns to major goals (e.g., GSA Application).
- **News Radar:** Real-time tech news fetcher to stay updated with industry trends.

### 2. 🎓 Akademik (Academic Portal)
- Exact UI/UX clone of the university's academic portal with enhanced functionality.
- Interactive calendar and auto-updating daily schedule.
- Visual attendance tracker with circular progress bars and color-coded status (Present/Permission/Absent).
- Automated CGPA (IPK) calculator based on dynamic grade inputs (UTS, UAS, Quiz, Tasks).

### 3. 🌍 UPM English Club (Organization Management)
- **Member Database:** Full CRUD functionality with integrated **Bulk CSV Upload** system.
- **Agenda Manager:** Tracking organizational work programs (Proker).
- **Drafting Board:** Dedicated space for speech drafts and event ideation.

### 4. 📢 Pusat Komando Komting (Class Representative Hub)
- **Draft Manager:** Write, save, and 1-click auto-copy announcement drafts to clipboard for quick broadcasting to class groups.
- **Quick Links:** Centralized repository for important class links (attendance forms, group drives) with 1-click copy functionality.

### 5. 🚀 Proyek Spesial (Portfolio Showcase)
- A dynamic showcase for side projects (like Telegram Bots, APIs, etc.).
- Includes technology tags and direct routing to GitHub repositories or live deployments.

## 💻 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM:** Prisma
- **AI Model:** Google Gemini API
- **Icons & Animations:** Lucide React, DotLottie Player
- **Deployment:** Vercel

## ⚙️ Local Installation

1. Clone this repository:
   ```bash
   git clone [https://github.com/mhdhkl7/naksu.git](https://github.com/mhdhkl7/naksu.git)

```

2. Navigate to the directory and install dependencies:
```bash
cd naksu
npm install

```


3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase connection string:
```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"

```


4. Push the database schema:
```bash
npx prisma db push

```


5. Run the development server:
```bash
npm run dev

```


Open `http://localhost:3000` in your browser.

## 👨‍💻 Developer

Developed by **Muhammad Haikal Siregar**

* Informatics Student at Universitas Satya Terra Bhinneka
* 🔗 LinkedIn: [haikal-siregar](https://www.google.com/search?q=https://www.linkedin.com/in/haikal-siregar)
* 🐙 GitHub: [mhdhkl7](https://www.google.com/search?q=https://github.com/mhdhkl7)

---

*Built with passion, coffee, and a relentless drive for innovation.*

```
