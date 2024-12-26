import React from 'react'
import { motion } from "framer-motion";

const Header = () => {
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center w-full overflow-hidden relative' 
    style={{backgroundImage: "url('/header_img.jpg')"}} 
    id='Header'>

      {/* darker background */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>  

      <motion.div initial={{ opacity: 0, y:100 }} whileInView={{ opacity: 1, y:0}} transition={{ duration: 1 }} viewport={{ once:true }}
      className='container mx-auto text-white text-center z-10 py-4 px-6 pt-20 sm:pt-0 md:px-20 lg:px-32'>
        
        <h2 className='text-3xl font-bold sm:text-4xl inline-block'>
          Discover Malaysia: A Land of Endless Adventures
        </h2>
        
        <p className='text-lg mt-4 mx-6'>
          Explore Malaysia's stunning beaches, vibrant cities, and rich culture. Your adventure starts here!
        </p>

        <div className='flex flex-col mt-16 sm:flex-row gap-4 justify-center items-center'>
          <a href='#Destinations' className='border border-white px-8 py-3 rounded-full hover:bg-slate-100 hover:text-slate-700'>Destinations</a>
          <a href='#Contact' className='border border-white inset-0 bg-black bg-opacity-50 px-8 py-3 rounded-full  hover:bg-slate-100 hover:text-slate-700'>Contact Us</a>
        </div>
      
      </motion.div>
    </div>
  )
}

export default Header