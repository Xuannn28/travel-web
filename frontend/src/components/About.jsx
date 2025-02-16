import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className='relative w-full min-h-screen mx-auto py-20 bg-cover bg-center overflow-hidden' id='About'
    style={{backgroundImage: "url('/about_background.jpg')"}} >
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0"></div>
        
        <motion.div initial={{ opacity: 0, y:100 }} whileInView={{ opacity: 1, y:0}} transition={{ duration: 1 }} viewport={{ once:true }}
        className='z-10 relative'>

            {/* header  */}
            <h3 className='text-3xl text-slate-300 font-bold py-4 px-6 pt-20 sm:pt-0 md:px-20 lg:px-32 sm:text-4xl inline-block'>
                We help travelers
            </h3>

            {/* about us cards */}
            <div className='flex flex-col sm:flex-row gap-10 mx-6 p-11 justify-around'>
                
                <div className='max-w-sm rounded-md overflow-hidden shadow-lg bg-slate-600 bg-opacity-55 flex flex-col items-center text-center p-5'>
                    <img src={assets.travel_icon} width={60} height={60} className='object-contain rounded-full'/>
                    <h5 className='font-semibold font-sans text-lg text-blue-200 mt-3'>
                        Travel
                    </h5>
                    <p className='text-white font-sans'>
                        Discover seamless travel experiences with tailored solutions for every destination.
                    </p>
                </div>

                <div className='max-w-sm rounded-md overflow-hidden shadow-lg bg-slate-600 bg-opacity-55 flex flex-col items-center text-center p-5'>
                    <img src={assets.benefit_icon} width={60} height={60} className='object-contain rounded-full'/>
                    <h5 className='font-semibold font-sans text-lg text-blue-200 mt-3'>
                        Benefits
                    </h5>
                    <p className='text-white font-sans'>
                        Enjoy unmatched benefits, from exclusive discounts to personalized travel support.
                    </p>
                </div>

                <div className='max-w-sm rounded-md overflow-hidden shadow-lg bg-slate-600 bg-opacity-55 flex flex-col items-center text-center p-5'>
                    <img src={assets.about_us} width={60} height={60} className='object-contain rounded-full'/> 
                    <h5 className='font-semibold font-sans text-lg text-blue-200 mt-3'>
                        About Us
                    </h5>
                    <p className='text-white font-sans'>
                        Since 2015, we've been dedicated to making travel easier and more enjoyable for everyone.
                    </p>
                </div>

                <div className='max-w-sm rounded-md overflow-hidden shadow-lg bg-slate-600 bg-opacity-55 flex flex-col items-center text-center p-5'>
                    <img src={assets.awards} width={60} height={60} className='object-contain rounded-full'/>
                    <h5 className='font-semibold font-sans text-lg text-blue-200 mt-3'>
                        Awards
                    </h5>
                    <p className='text-white font-sans'>
                        Winner of the 2023 Excellence in Travel Service award for outstanding customer satisfaction.
                    </p>
                </div>
            </div>

            {/* Explore More button */}
            <div className='flex flex-col mt-16 sm:flex-row gap-4 justify-center items-center'>
                <a href='#ExploreMore' className='border border-white text-white px-8 py-3 rounded-full hover:bg-slate-100 hover:text-slate-700'>
                    Explore More
                </a>
                
            </div>

        </motion.div>
        
    </div>
  )
}

export default About