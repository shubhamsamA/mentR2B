"use client";

import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function WobbleCardDemo() {
  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-4 ">

     
      <div className="flex flex-row md:flex-row gap-4">
        <WobbleCard containerClassName="bg-black min-h-[200px] w-[50%] md:w-[60%] border" className="bg-black">
          <div className="p-4 text-white">
            <h2 className="text-xl font-semibold">Card 1</h2>
            <p className="mt-2 text-neutral-300">70% width on md+, full width on small screens</p>
          </div>
        </WobbleCard>

        <WobbleCard containerClassName="bg-black min-h-[200px] w-[50%] md:w-[40%] border" className="bg-black">
          <div className="p-4 text-white">
            <h2 className="text-xl font-semibold">Card 2</h2>
            <p className="mt-2 text-neutral-300">30% width on md+, full width on small screens</p>
          </div>
        </WobbleCard>
      </div>

 
      <div className="flex flex-row md:flex-row gap-4">
        <WobbleCard containerClassName="bg-black min-h-[200px] w-[50%] md:w-[40%] border" className="bg-black" >
          <div className="p-4 text-white">
            <h2 className="text-xl font-semibold">Card 4</h2>
            <p className="mt-2 text-neutral-300">30% width on md+, full width on small screens</p>
          </div>
        </WobbleCard>
        <WobbleCard containerClassName="bg-black min-h-[200px] w-[50%] md:w-[60%] border" className="bg-black">
          <div className="p-4 text-white">
            <h2 className="text-xl font-semibold">Card 3</h2>
            <p className="mt-2 text-neutral-300">70% width on md+, full width on small screens</p>
          </div>
        </WobbleCard>

      </div>

    </div>
  );
}
