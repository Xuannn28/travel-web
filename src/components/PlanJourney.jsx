import React, { useState } from 'react'
import { assets } from '../assets/assets'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

// if user click on any of the places shown in recommendation section, replace it as destination and the older one into depart.
// if user click save, it will save form data into backend database.

const PlanJourney = () => {

    // state to track selected button
    const [ currentButton, setCurrentButton ] = useState('Attractions');

    // initial position of map marker: center of KL
    const initialPosition = [3.1390, 101.6869];

    // state to track depart position(coordinates)
    const [ departure, setDeparture ] = useState('')

    // state to track destination(value)
    const [ destination, setDestination] = useState('');

    // state to track marker position(coordinates)
    const [ markerPosition, setMarkerPosition ] = useState(initialPosition);

    // state to track distance
    const [ distance, setDistance ] = useState(0);

    // function to calculate distance via Haversine formula
    const calcDistance = (latDep, latDest, lonDep, lonDest) => {
        const R = 6371e3; // metres
        const φ1 = latDep * Math.PI/180; // φ, λ in radians
        const φ2 = latDest * Math.PI/180;
        const Δφ = (latDest-latDep) * Math.PI/180;
        const Δλ = (lonDest-lonDep) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return (R * c) / 1000; // in km
    }

    /**
     * function to handle form submission.
     * @param {} eventObject - object contains details about the event triggered.
     */
    const handleFormSubmission = async(eventObject) => {

        // prevent reloading the page upon submission
        eventObject.preventDefault();

        // fetch coordinates from Nominatim API
        try{
            console.log(departure, destination)
            const resDeparture = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(departure)}&format=json`);
            const resDestination = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json`);
            
            // convert res to json format
            const dataDeparture = await resDeparture.json();
            const dataDestination = await resDestination.json();

            // check result: if not null then map to that location, otherwise give alert message to user
            if (dataDestination && dataDestination.length > 0 && dataDeparture && dataDeparture.length > 0) {
                console.log("Departure: ",dataDeparture)
                console.log("Destination: ",dataDestination)

                // use first result of data (result returned are sorted by relevance by default)
                const { lat:latDep, lon:lonDep } = dataDeparture[0];
                const { lat:latDest, lon:lonDest } = dataDestination[0];
                
                // set lat, lon of destination as marker position
                setMarkerPosition([parseFloat(latDest), parseFloat(lonDest)]);

                // calculate distance between departure and destination
                const dist = calcDistance(latDep, latDest, lonDep, lonDest);
                setDistance(dist.toFixed(2));

            }else {
                alert('Depature/destination not found.')
            }
        }catch(error){
            console.log(error);
            alert('Failed to fetch location. Please try again.')
        }
    }   

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
                <div className='w-1/2 lg:h-[550px] mx-auto bg-white bg-opacity-90 rounded-xl p-8 mt-5 '>
                    <form onSubmit={handleFormSubmission} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="from" className='text-sm text-gray-500 font-semibold'>
                                From
                            </label>
                            <input type="text" value={departure} onChange={(eventObj) => setDeparture(eventObj.target.value)} id='from' placeholder='Enter your location' className='border border-gray-200 p-2 rounded-lg'/>
                        </div>

                        <div className='flex flex-col gap-2'>
                            {/* destination always syncs with users' input */}
                            <label htmlFor="to" className='text-sm text-gray-500 font-semibold'>
                                To
                            </label>
                            <input type="text" value={destination} onChange={(eventObj) => setDestination(eventObj.target.value)} id='to' placeholder='Enter your destination (i.e. Kuala Lumpur)' className='border border-gray-200 p-2 rounded-lg'/>
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

                    {/* Map */}
                    {/* Initial position: center of Kuala Lumpur; allow zooming in and out */}
                    <div style={{ height: '60vh' }} className='mt-5'>
                        <MapContainer center={markerPosition} zoom={13} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={markerPosition}>
                                <Popup>
                                Destination: <br/>{destination}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* distance */}
                    <div className='text-white'>
                        Distance: {distance} km
                    </div>

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
                    
                    {/* content based on selected button */}
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