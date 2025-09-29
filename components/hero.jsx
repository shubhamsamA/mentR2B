"use client"
import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { SignedIn} from "@clerk/nextjs"

const HeroSection = () => {
 const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 100; 
      const clamped = Math.min(scrollY, maxScroll);

      const rotate = 15 - (clamped / maxScroll) * 15; 
      const translateY = (clamped / maxScroll) * 40;  

      if (imageElement) {
        imageElement.style.transform = `rotateX(${rotate}deg) translateY(${translateY}px) scale(1)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10 overflow-x-hidden">
    <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
            <h1 className="gradient font-extrabold tracking-tighter  text-transparent bg-clip-text pb-2 pr-2 text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              AI that turns uncertainty into
                <br/>
              your next big move.
            </h1>
            <p className="mx-auto max-w-[600px] text-white md:text-xl">
              MentR2B combines AI resumes, mock interviews, Quiz, cover letters, and industry insights to prepare you for every opportunity.
            </p>
        </div>
        <div className="space-x-5">
          <SignedIn>
            <Link href="/dashboard">
                <Button size="lg" className="px-8 cursor-pointer">
                    Dashboard
                </Button>
            </Link>
          </SignedIn>
            <Link href="/">
            <Button size="lg" className="px-8 cursor-pointer" variant="outline">
                Demo 
            </Button>
            </Link>
        </div>
       <div className="hero-image-wrapper mt-5 md:mt-0  p-2">
          <div ref={imageRef} className="hero-image rounded-l shadow-2xl mx-auto " >
                <Image
                src="/banner02.png"
                width={920}
                height={550}
                alt="Banner MentR2B"
                className="rounded-lg shadow-2xl bordedr mx-auto "
                priority
                />
            </div>
        </div>
    </div>
    </section>
  )
}

export default HeroSection