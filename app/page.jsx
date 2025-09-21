import WobbleCardDemo from "@/components/feature";
import { Freq } from "@/components/freq";
import HeroSection from "@/components/hero";
import { Testimonial } from "@/components/testimonial";
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number";
import { Working } from "@/components/work";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WobbleCardDemo />
      <section className="w-full py-12 md:py-24  bg-white/5 rounded-2xl text-white ">
        <div className="container mx-auto px-4 md:px-6 ">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">
                <CountingNumber
                  number={50}
                  inView={true}
                  transition={{ stiffness: 100, damping: 300 }}
                />
                +
              </h3>
              <p className="">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">
                <CountingNumber
                  number={1000}
                  inView={true}
                  transition={{ stiffness: 100, damping: 100 }}
                />
                +
              </h3>
              <p className="">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">
                <CountingNumber
                  number={95}
                  inView={true}
                  transition={{ stiffness: 100, damping: 300 }}
                />
                %
              </h3>
              <p className="">Success Rate </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7
              </h3>
              <p className="">AI Support </p>
            </div>
            
          </div>
        </div>
      </section>
      <Working/>
      <Testimonial/>
      <Freq/>
    </div>
  );
}
