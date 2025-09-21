import { howItWorks } from '@/data/howItWork'
import { Item } from '@radix-ui/react-accordion'
import React from 'react'

export const Working = () => {
  return (
    <section className="w-full py-10 md:py-12 lg:py-16">
        <div className='container mx-auto px-4 md:px-6'>
            <div className='text-center max-w-3xl mx-auto mb-12 text-white'>
                <h2 className='text-3xl font-bold mb-4 tracking-tight'>How It Works</h2>
                <p className='text-shadow-white'>Four simple steps to accelerate your career growth</p>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
                {howItWorks.map((Item,index)=>{
                    return(
                        <div key={index} className='flex flex-col items-center text-center space-y-4 text-white bg-white/10 rounded-2xl p-4'>
                        <div className='w-16 h-16 rounded-full flex items-center justify-center '>
                            {Item.icon}
                            </div>
                            <h3 className='font-semibold text-xl'>{Item.title}</h3>
                            <p>{Item.description}</p>
                            </div>
                    );
                })}
            </div>
        </div>
    </section>
  )
}
