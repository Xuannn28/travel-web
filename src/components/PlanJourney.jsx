import React, { useState } from 'react'
import { assets } from '../assets/assets'

const PlanJourney = () => {

    // state to track selected button
    const [ currentButton, setCurrentButton ] = useState('Attractions')

    // handler function to update selected button
    const handleButton = (selectedButton) => {
        setCurrentButton(selectedButton);
    };

    // content of respective button
    const content = () => {
        switch (currentButton) {
            case 'Attractions':
                return <div className='w-full bg-slate-200'>
                            <h3>Attraction</h3>
                        </div>;
            case 'Foods':
                return <div className='w-full bg-slate-200'>
                            <h3>Foods</h3>
                        </div>;
            default:
                return <div className='w-full bg-slate-200'>
                            <h3>Hotels</h3>
                        </div>;
        }
    };

  return (
    <div className='min-h-screen w-full m-auto bg-cover bg-center overflow-hidden relative pt-[6rem]' 
    style={{backgroundImage: "url('/header_img.jpg')"}} 
    id='Plan Journey'>

        <div className="absolute inset-0 bg-black bg-opacity-50"></div>  
        <div className='z-0 relative'>

            <div className='flex flex-row gap-5 text-3xl text-white font-bold py-4 px-6 sm:pt-0 md:px-20 lg:px-32 sm:text-4xl'>
                <a href='#Header' className='cursor-pointer'>
                    <img src={assets.logo} alt='logo' width={100} height={100} className='object-contain'/>
                </a>
                <h3 className='mt-5'>
                    Plan Your Journey
                </h3>
            </div>

            
            <div className='grid grid-cols-1 md:grid-cols-2 p-6 mb-5'>
                {/* planning journey form */}
                <div className='w-1/2 mx-auto bg-white bg-opacity-90 rounded-xl p-8 mt-5 '>
                    <form action="" className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="from" className='text-sm text-gray-500 font-semibold'>
                                From
                            </label>
                            <input type="text" id='from' placeholder='Enter your location' className='border border-gray-200 p-2 rounded-lg'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="to" className='text-sm text-gray-500 font-semibold'>
                                To
                            </label>
                            <input type="text" id='to' placeholder='Enter your destination' className='border border-gray-200 p-2 rounded-lg'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="startDate" className='text-sm text-gray-500 font-semibold'>
                                 Start Date
                            </label>
                            <input type="date" id='startDate' placeholder='Enter your date' className='border border-gray-200 p-2 rounded-lg'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="endDate" className='text-sm text-gray-500 font-semibold'>
                                 End Date
                            </label>
                            <input type="date" id='endDate' placeholder='Enter your date' className='border border-gray-200 p-2 rounded-lg'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="people" className='text-sm text-gray-500 font-semibold'>
                                Number of people
                            </label>
                            <input type="number" id='people' placeholder='Enter number of people' className='border border-gray-200 p-2 rounded-lg'/>
                        </div>

                        <button type='submit' className='bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-700'>
                            Plan Journey
                        </button>
                    </form>
                </div>
                
                {/* Search result */}
                <div className='w-full bg-gray-800 mx-auto bg-opacity-90 rounded-xl p-8 mt-5 '>
                    <h3 className='text-white font-semibold'>
                        Search result :
                    </h3>

                    {/* three buttons */}
                    <div className='flex flex-1 mt-3 bg-white rounded-t-lg pt-5 px-5'>
                        <button onClick={() => handleButton('Attractions')} className='border border-b-transparent border-black px-8 py-3 rounded-t-lg bg-slate-300 hover:bg-slate-200 hover:border-b-transparent focus:bg-slate-200'>
                            Attractions
                        </button>
                        <button onClick={() => handleButton('Foods')} className='border border-b-transparent border-black px-8 py-3 rounded-t-lg bg-slate-300 hover:bg-slate-200 hover:border-b-transparent focus:bg-slate-200'>
                            Foods
                        </button>
                        <button onClick={() => handleButton('Hotels')} className='border border-b-transparent border-black px-8 py-3 rounded-t-lg bg-slate-300 hover:bg-slate-200 hover:border-b-transparent focus:bg-slate-200'>
                            Hotels
                        </button>


                    </div>

                    <div className='flex flex-1 bg-slate-200 rounded-b-lg p-5 '>
                        {content()}
                    </div>
                </div>

            </div>
            
        </div>
    </div>
  )
}

export default PlanJourney