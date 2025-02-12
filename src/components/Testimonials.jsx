import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const Testimonials = () => {

    const navigate = useNavigate();

    // function to handle leave a review button
    const handleLeaveReview = () => {
        navigate('/make-review');
        window.scrollTo({
            top: 0
        });
    };

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-slate-700 to-slate-600 text-white mx-auto py-20' id='Testimonials'>

        <motion.div initial={{ opacity: 0, y:100 }} whileInView={{ opacity: 1, y:0}} transition={{ duration: 1 }} viewport={{ once:true }}
        className='z-10 relative'>
        
        {/* header */}
        <h3 className='text-3xl text-slate-300 font-bold py-4 px-6 pt-20 sm:pt-0 md:px-20 lg:px-32 sm:text-4xl inline-block'>
                Testimonials
        </h3>

        {/* feedbacks cards */}
        <div className='bg-black bg-opacity-30 backdrop-blur-sm p-6 rounded-lg mt-10 mx-6 sm:mx-20 lg:mx-32'>
            <div className='mt-15 flex flex-col md:flex-row gap-10 justify-center items-center'>

                {data.map((person) => (
                    <div key={person.name} className='bg-black bg-opacity-50 p-6 rounded-lg mb-6 justify-between w-full max-w-sm min-h-[300px] flex flex-col'>
                        <div>
                            <img src={person.img} alt={person.name} className='w-20 h-20 object-contain rounded-full mx-auto'/>
                        </div>

                        <div className='flex-grow flex flex-col text-start gap-2 mt-3 p-3'>
                            <h3 className='font-sans text-lg font-semibold'>
                                {person.name}
                            </h3>

                            <div className='flex flex-row gap-2 items-center'>
                                <img src={assets.star} alt='rating' width={20} height={20}/> 
                                ({person.rating})
                            </div>

                            <p className='text-white font-sans'>
                                {person.feedback}
                            </p>

                        </div>
                    </div>
                ))}

            </div>
        </div>
        
        {/* buttons */}
        <div className='flex flex-col mt-16 sm:flex-row gap-4 justify-center items-center'>
                <button onClick={handleLeaveReview} className='border border-white text-white px-8 py-3 rounded-full hover:bg-slate-100 hover:text-slate-700'>
                    Leave a Review
                </button>

                <a href='#MoreFeedback' className='border border-white text-white px-8 py-3 rounded-full hover:bg-slate-100 hover:text-slate-700'>
                    View more
                </a>
                
        </div>
            
        </motion.div>
    </div>
  )
}

const data = [
    {
        name: 'Ariana Tan',
        rating: 5,
        feedback: "My trip to Malaysia was unforgettable, thanks to the team at Malaysia Adventure. They made sure everything was perfect, from the hotel to the tours. I can't wait to book my next trip with them!",
        img: assets.person1,
    },

    {
        name: 'Adam Lee',
        rating: 4,
        feedback: "I had an amazing time exploring Malaysia. The culture and natural beauty are incredible. The only downside was the weather, but that didn't stop the fun!",
        img: assets.person2,
    },

    {
        name: 'Brian Tan',
        rating: 4.5,
        feedback: "A perfect vacation! From the bustling cities to the serene beaches. The tour was seamless, and the guides were knowledgeable. I highly recommend Malaysia Adventure to anyone looking for a memorable trip.",
        img: assets.person3,
    }
]
export default Testimonials