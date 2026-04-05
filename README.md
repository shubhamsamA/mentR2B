# MentR2B - AI Career Mentor & Coach

MentR2B is an AI-powered career mentoring platform designed to help users land their dream jobs. It provides comprehensive tools including AI mock interviews, resume building, cover letter generation, and personalized career guidance.

## 🚀 Key Features

- **🤖 AI Mock Interviews:** Practice interviews with real-time AI feedback using your webcam and microphone.
- **📄 Smart Resume Builder:** Create professional, ATS-friendly resumes with AI assistance and export them to PDF.
- **✉️ AI Cover Letter Generator:** Generate tailored cover letters for specific job descriptions instantly.
- **📊 Career Dashboard:** Track your interview performance, success rates, and career progression with interactive charts.
- **💼 Industry-Specific Guidance:** Get tailored advice and interview questions for over 50+ industries.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Authentication:** Clerk
- **Database:** PostgreSQL with Prisma ORM
- **AI Integration:** Google Generative AI (Gemini)
- **Background Jobs:** Inngest
- **UI & Styling:** Tailwind CSS, Radix UI, Framer Motion
- **Forms & Validation:** React Hook Form, Zod
- **Media & Export:** React Webcam, React Hook Speech-to-Text, html2pdf.js
- **Charts:** Recharts

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shubhamsamA/mentR2B.git
   cd mentR2B
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Database (Prisma)
   DATABASE_URL=your_database_url

   # Google Generative AI
   GEMINI_API_KEY=your_gemini_api_key

   # Inngest
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/shubhamsamA/mentR2B/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

