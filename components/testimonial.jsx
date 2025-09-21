import { testimonial } from '@/data/testimonial';
import React from 'react'
import { Card, CardContent } from './ui/card';
import Image from 'next/image';

export const Testimonial = () => {
  return (
    <section className="w-full py-8 md:py-10 lg:py-12  ">
            <div className='container mx-auto px-4 md:px-6'>
                <div className='text-center max-w-3xl mx-auto mb-12 text-white'>
                    <h2 className='text-3xl font-bold tracking-tight mb-4'>What Our Users Say </h2>
                    
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                    {testimonial.map((testimonial,index)=>{
                        return(
                            <Card key={index} className="bg-background">
                                <CardContent className="pt-6">
                                    <div className='flex flex-col space-y-4'>
                                        <div className='flex items-center space-x-4'>
                                            <div>
                                                <Image
                                                width={40}
                                                height={40}
                                                src={testimonial.image}
                                                alt={testimonial.author}
                                                className='rounded-full object-cover border-2 border-primary/20'
                                                />
                                            </div>
                                            <div>
                                                <p className='font-semibold'>{testimonial.author}</p>
                                                <p className='text-sm text-muted-foreground'>{testimonial.role}</p>
                                                <p className='text-sm text-primary'>{testimonial.company}</p>
                                            </div>
                                        </div>
                                        <blockquote>
                                            <p className='text-muted-foreground italic relative'>
                                                <span className='text-3xl text-primary absolute -top-4 -left-2'>
                                                    &quot;
                                                </span>
                                                {testimonial.quote}
                                                <span className='text-3xl text-primary absolute -bottom-4'>
                                                    &quot;
                                                </span>
                                            </p>
                                        </blockquote>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
  )
}
