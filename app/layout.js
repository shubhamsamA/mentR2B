import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundLines } from "@/components/ui/background-lines";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        ><BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-black">
          {children}
      </BackgroundLines>
        </body>
    </html>
  );
}
