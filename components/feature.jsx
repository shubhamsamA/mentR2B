"use client";

import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { BrainCircuit, Briefcase, ChartAreaIcon, ChartGantt, ChartLine, Newspaper } from "lucide-react";

export default function WobbleCardDemo() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ">
        <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-white font-extrabold text-center text-3xl tracking-tighter mb-12 ">PowerFul Features for Your career Growth</h1>
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-4 ">

     
      <div className="flex flex-row md:flex-row gap-4 mb-2">
        <WobbleCard containerClassName=" min-h-[200px] w-[50%] md:w-[60%] border" >
          <div className="pt-3 text-white text-center flex flex-col items-center">
            <BrainCircuit className="w-10 h-10 mb-4 text-white"/>
            <h2 className="text-xl font-semibold">AI-Powered career gudiance</h2>
            <p className="mt-2 text-neutral-300">Get personalized career advice and insights Powered by advance AI technology</p>
          </div>
        </WobbleCard>

        <WobbleCard containerClassName=" min-h-[200px] w-[50%] md:w-[40%] border" >
          <div className="pt-3 text-white text-center flex flex-col items-center">
            <Briefcase className="w-10 h-10 mb-4 text-white"/>
            <h2 className="text-xl font-semibold">Interview Preparation</h2>
            <p className="mt-2 text-neutral-300 ">Practice with role specific questions and get instant feedback to improve your performance  </p>
          </div>
        </WobbleCard>
      </div> 
      <div className="flex flex-row md:flex-row gap-4">
        <WobbleCard containerClassName=" min-h-[200px] w-[50%] md:w-[40%] border"  >
          <div className="pt-3 text-white text-center flex flex-col items-center">
            <ChartLine className="w-10 h-10 mb-4 text-white"/>
            <h2 className="text-xl font-semibold">Industry Insights</h2>
            <p className="mt-2 text-neutral-300">Stay ahead with real-time industry trends, salary data, and narket analysis.</p>
          </div>
        </WobbleCard>
        <WobbleCard containerClassName=" min-h-[200px] w-[50%] md:w-[60%] border">
          <div className="pt-3 text-white text-center flex flex-col items-center">
            <Newspaper className="w-10 h-10 mb-4 text-white"/> 
            <h2 className="text-xl font-semibold">Smart Creation</h2>
            <p className="mt-2 text-neutral-300">Generate ATS-optimizedre resumes and AI assistance and AI cover letter customized to your company and role.</p>
          </div>
        </WobbleCard>
      </div>
    </div>
    </div>
    </section>
  );
}
