"use client";

import Image from "next/image";
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
     
      <div className="mt-2 animate-float">
        <Image
          src="/astr.png"
          alt="Lost in Space Astronaut"
          width={400}
          height={400}
          priority
          className="drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
        />
      </div>

      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Lost in Space{dots}
        </h2>
        <p className="mt-3 text-gray-400 max-w-md mx-auto font-bold">
          The page you’re looking for doesn’t exist or has been moved. Our
          astronaut couldn’t find it either
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
