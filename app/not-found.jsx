"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Custom404() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center  text-white px-4">
      <h1 className="text-9xl font-extrabold tracking-widest text-red-500">
        404
      </h1>
      <div className="mt-8 animate-float">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="200"
          height="200"
          
        >
          <circle cx="256" cy="256" r="256" fill="#111827" />
          <circle cx="256" cy="180" r="60" fill="#9ca3af" stroke="#fff" strokeWidth="6"/>
          <rect x="200" y="230" width="112" height="140" rx="20" fill="#374151" stroke="#fff" strokeWidth="4"/>
          <circle cx="228" cy="300" r="20" fill="#f87171" />
          <circle cx="284" cy="300" r="20" fill="#60a5fa" />
          <path d="M180 400c30 20 120 20 152 0" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
          <path d="M120 250c-40 30-40 80 0 110" stroke="#9ca3af" strokeWidth="6" strokeLinecap="round" />
          <path d="M392 250c40 30 40 80 0 110" stroke="#9ca3af" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="mt-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Lost in Space{dots}
        </h2>
        <p className="mt-3 text-gray-400 max-w-md mx-auto font-bold">
          The page you’re looking for doesn’t exist or has been moved.  
          Our astronaut couldn’t find it either
        </p>
      </div>

      <Link
        href="/"
        className="mt-10 px-6 py-3 text-lg font-medium rounded-md bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/40"
      >
        Go Home
      </Link>
    </div>
  );
}
