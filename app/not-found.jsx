"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Custom404() {


  return (
    <div className="flex min-h-screen flex-col items-center justify-center  text-white px-4">
     
      <div className="mt-7 animate-float ">
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
        <h2 className="text-2xl md:text-3xl font-black text-white pb-1">
          Lost in Space
        </h2>
        <p className="  max-w-md mx-auto font-black text-white mb-3">
          The page you’re looking for doesn’t exist or has been moved. Our
          astronaut couldn’t find it either
        </p>
      </div>

        <Link href="/">
            <Button size="lg" variant="GO">
               Go Home 
            </Button>
            </Link>
    </div>
  );
}
