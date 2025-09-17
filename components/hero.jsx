"use client"
import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"

const HeroSection = () => {
  return (
    <section className="w-full pt-36 md:pt-48 pb-10 ">
    <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
            <h1 className="gradient font-extrabold tracking-tighter  text-transparent bg-clip-text pb-2 pr-2 text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
                AI that turns uncertainty into
                <br/>
              your next big move.
            </h1>
            <p className="mx-auto max-w-[600px] text-white md:text-xl">
              MentR2B combines AI resumes, mock interviews, cover letters, and industry insights to prepare you for every opportunity.
            </p>
        </div>
        <div className="space-x-5">
            <Link href="/dashboard">
                <Button szie="lg" className="px-8 cursor-pointer">
                    Get Started    
                </Button>
            </Link>
            <Link href="/">
            <Button size="lg" className="px-8 cursor-pointer" variant="outline">
                Demo 
            </Button>
            </Link>
        </div>
        <div >
            <div>
                <Image
                src={"/banner.jpg"}
                width={1280}
                height={720}
                alt="Banner MentR2B"
                className="rounded-lg shadow-2xl bordedr mx-auto"
                priority
                />
            </div>
        </div>
    </div>
    </section>
  )
}

export default HeroSection