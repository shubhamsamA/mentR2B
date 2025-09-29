import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MentR2B",
  description: "Ai Career  Mentor/Coach ",
  icons: {
    icon: "/logo1.png",
  },
};

export default function RootLayout({ children }) {
  return (
<ClerkProvider>
  <html lang="en"  suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* Background always fixed behind */}
      <BackgroundLines className="fixed inset-0 -z-10 bg-black" />

      {/* Foreground content */}
      <Navbar />
      <Toaster richColors/>
      <main className="min-h-screen relative z-10">
        {children}
      </main>
    </body>
  </html>
</ClerkProvider>

  );
}
