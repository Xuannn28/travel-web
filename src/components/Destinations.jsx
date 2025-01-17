import React from 'react';
import { assets } from '../assets/assets';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const Destinations = () => {

  const navigate = useNavigate();

  // function to navigate to plan journey page
  const handlePlanJourney = () => {
    navigate('/plan-journey');
    window.scrollTo({
      top: 0,
      behavior:'smooth'
    })
  }


  // sliding card settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [  // change the number of slides to show on different screen sizes
      {
        breakpoint: 1024,   
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    
    <div className='w-full min-h-screen bg-gradient-to-b from-slate-800 to-slate-700 text-white mx-auto py-20' id='Destinations'>

        <motion.div  initial={{ opacity: 0, y:100 }} whileInView={{ opacity: 1, y:0}} transition={{ duration: 1 }} viewport={{ once:true }}
        className='z-10 relative'>

            {/* header */}
            <h3 className='text-3xl text-slate-300 font-bold py-4 px-6 pt-20 sm:pt-0 md:px-20 lg:px-32 sm:text-4xl inline-block'>
                <span>Popular </span>Destinations
            </h3>

            {/* popular destination sliding cards */}
            <div className='w-3/4 m-auto'>
              <div className='mt-20 '>
                <Slider {...settings}>

                {data.map((destination) => (
                  <div className='bg-white h-[450px] w-[300px] text-black rounded-xl' key={destination.name}>

                    <div className='h-[300px] flex justify-center items-center overflow-hidden mx-auto mt-0 rounded-t-xl'>
                      <img src={destination.img} alt={destination.location} className='w-full h-full object-cover'/>
                    </div>

                    <div className='flex flex-col justify-center items-center gap-3 mt-3 px-4 py-2 h-[150px]'>
                      <p className='text-slate-400 font-sans sm:text-sm text-center leading-tight'>
                        {destination.location}
                      </p>
                      <h4 className='text-lg font-bold font-sans sm:text-[16px] text-center leading-tight'>
                        {destination.name}
                      </h4>

                      <a href='#SeeMore' className='text-sm text-blue-500 font-semibold font-sans hover:underline'>
                        See More
                      </a>
                    </div>

                  </div>
                ))}

                </Slider>
              </div>
            </div>

        </motion.div>
        
        {/* Plan journey button */}
        <div className='flex flex-col mt-16 sm:flex-row gap-4 justify-center items-center'>
                <button onClick={handlePlanJourney} className='border border-white text-white px-8 py-3 rounded-full hover:bg-slate-100 hover:text-slate-700'>
                    Plan Your Journey
                </button>
        </div>

    </div>
  )
}

const data = [
  {
    name: "Petronas Twin Towers: A Symbol of Kuala Lumpur's Skyline",
    img: assets.twin_towers,
    location: 'Kuala Lumpur'
    
  },

  {
    name: "Conquering Mount Kinabalu: Your Guide to Sabah's Iconic Peak",
    img: assets.kinabalu,
    location: 'Sabah'
  },

  {
    name: 'Island Hopping in Langkawi: A Complete Guide to the Jewel of Kedah',
    img: assets.island,
    location: 'Kedah'
  },

  {
    name: "A Taste of Penang: Must-Try Delicacies in Malaysia's Food Haven",
    img: assets.food,
    location: 'Penang'
  }
]

export default Destinations