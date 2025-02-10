import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { data } from '../assets/planJourneyData'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import UserService from '../services/user.service';

// Fix the paths for Leaflet's marker icons to work for backend
// Delete default path configuration for Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;

// configure leaflet marker icon paths
// manually set icon paths point to leaftlet/dist/images files bundled
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const PlanJourney = () => {

    // state to track selected button
    const [ currentButton, setCurrentButton ] = useState('Select here');

    const { register, handleSubmit, setValue, watch, formState:{ errors },} = useForm();

    // watch the value of the start_date field
    const startDate = watch('start_date');

    const [ message, setMessage ] = useState("");

    // initial position of map marker: center of Kuala Lumpur
    const initialPosition = [3.1390, 101.6869];

    // state to track depart position(coordinates)
    const [ departure, setDeparture ] = useState('')

    // state to track destination(value)
    const [ destination, setDestination] = useState('');

    // state to track marker position(coordinates)
    const [ markerPosition, setMarkerPosition ] = useState(initialPosition);

    // state to track distance
    const [ distance, setDistance ] = useState(0);

    // state to track city
    const [ state, setState ] = useState('');

    // check for user authorization to access this page
    const navigate = useNavigate();
    useEffect(() => {
        const getJourneyData = async () => {
            try{
                // extract token from user data
                const user = AuthService.getCurrentUser();
                const token = user?.token;

                // redirect to login if token missing
                if (!token) {
                    navigate('/login');
                    return;
                }
                
                // add authorization token to header
                const res = await fetch('/api/plan-journey', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                // handle res
                if (!res.ok) {
                    if (res.status === 401  || res.status === 403) {  // JWT expired or invalid
                        localStorage.removeItem('user');
                        navigate('/login');  
                    } else {
                        const data = await res.json();
                        console.log(data);
                    }
                }

            } catch (err) {
                console.log("Login authorisation error: ", err);
            }
        };

        getJourneyData();
        
    }, [navigate]);

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

    // function to handle Save button
    const handleSave = (data) => {
        setMessage('');
        UserService.planJourney(data.departure, data.destination, data.start_date, data.end_date, data.num_people)
        .then(()=> {
            alert('Save plan successfully.')
          })
          .catch((error) => {
            console.log(error)
            const res =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
    
            setMessage(res);
            alert('Save plan failed. Please try again.')
          });

    }

    /**
     * function to handle form submission.
     * @param {} eventObject - object contains details about the event triggered.
     */
    const handlePlanJourney = async(eventObject) => {

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
                
                // validation check: destination is within Malaysia
                const { display_name } = dataDestination[0]
                if (display_name.includes('Malaysia')){
                    // use first result of data (result returned are sorted by relevance by default)
                    const { lat:latDep, lon:lonDep } = dataDeparture[0];
                    const { lat:latDest, lon:lonDest } = dataDestination[0];
                    
                    // set lat, lon of destination as marker position
                    setMarkerPosition([parseFloat(latDest), parseFloat(lonDest)]);

                    // calculate distance between departure and destination
                    const dist = calcDistance(latDep, latDest, lonDep, lonDest);
                    setDistance(dist.toFixed(2));

                    // find city of destination
                    getState(latDest, lonDest);

                }else {
                    alert('Destination is not in Malaysia. Please try again.')
                }
            }else {
                alert('Depature/destination not found.')
            }
        }catch(error){
            console.log(error);
            alert('Failed to fetch location. Please try again.')
        }
    }   

    const getState = async (lat, lon) => {
        // reverse geocoding
        try{
            // fetch destination city based on coodinates
            const resState = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=5&accept-language=en`);

            // convert to json format
            const data = await resState.json();

            if (data && data.address){
                const state = data.address.state;
                setState(state);
            } else {
                alert('City of the destination is not found. Please be more specific.')
            }

        }catch (error) {
            console.log(`getCity error: ${error}`);
            alert("Failed to fetch city location. Please try again.")
        }
    }

    const onSubmit = (data) => {
        if (data.action === 'planJourney') {
            handlePlanJourney(data);
        } else if (data.action === 'save') {
            handleSave(data);
        }
    }

    /**
     * when destination change, fly marker position and zoom in the map.
     * @param {*} param0 
     * @returns 
     */
    const MapZoomer = ({position}) => {
        const map = useMap();

        if (position) {
            map.flyTo(position, 15)
        }

        return null;
    }

    // handler function to update selected button
    const handleButton = (selectedButton) => {
        setCurrentButton(selectedButton);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0
        })
    }

    // content of respective button
    const content = () => {
        // find the place with matching state
        const recommendation = data.find((place) => place.state === state);

        // if state is included, show all content, otherwise show 'no recommendation found'
        if (recommendation) {
            switch (currentButton) {
                case 'Attractions':
                    return (
                        <div>
                            <h3 className='font-semibold text-lg'>
                                Recommended attraction in {state}
                            </h3>

                            <ul className='list-disc pl-6'>
                            {recommendation.attractions.map((attraction, index) => (
                                <li key={index}> {attraction}</li>
                            ))}
                            </ul>
                        </div>
                    );
                case 'Foods':
                    return (
                        <div>
                            <h3 className='font-semibold text-lg'>
                                Recommended foods in {state}
                            </h3>
                            
                            <ul className='list-disc pl-6'>
                            {recommendation.foods.map((attraction, index) => (
                                <li key={index}> {attraction}</li>
                            ))}
                            </ul>
                        </div>
                    );
                case 'Hotels':
                    return (
                        <div>
                            <h3 className='font-semibold text-lg'>
                                Recommended hotels in {state}
                            </h3>
                            
                            <ul className='list-disc pl-6'>
                            {recommendation.hotels.map((attraction, index) => (
                                <li key={index}> {attraction}</li>
                            ))}
                            </ul>
                        </div>
                    );
            }
        } else {
            return (
                <div>
                    Currently no recommendation for this state.
                    (Available: Kuala Lumpur, Penang, Sarawak, Sabah)
                </div>
            )

        }
    }


  return (
    <div className='min-h-screen w-full m-auto bg-cover bg-center overflow-hidden relative pt-[6rem]' 
    style={{backgroundImage: "url('/header_img.jpg')"}} 
    id='Plan Journey'>

        <div className="absolute inset-0 bg-black bg-opacity-50"></div>  
        <div className='z-0 relative'>

            <div className='flex flex-row gap-5 text-3xl text-white font-bold py-4 px-6 sm:pt-0 md:px-20 lg:px-32 sm:text-4xl'>
                <Link to='/' onClick={scrollToTop} className='cursor-pointer'>
                    <img src={assets.logo} alt='logo' width={100} height={100} className='object-contain'/>
                </Link>
                <h3 className='mt-5'>
                    Plan Your Journey
                </h3>
            </div>

            
            <div className='grid grid-cols-1 md:grid-cols-2 p-6 mb-5'>
                {/* planning journey form */}
                <div className='w-1/2 lg:h-[600px] mx-auto bg-white bg-opacity-90 rounded-xl p-8 mt-5 '>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="from" className='text-sm text-gray-500 font-semibold'>
                                From
                            </label>
                            <input {...register('departure', 
                            { required: 'This field is required.'})}  
                            type="text" value={departure} onChange={(eventObj) => setDeparture(eventObj.target.value)} id='from' placeholder='Enter your location' className='border border-gray-200 p-2 rounded-lg'/>
                            {errors.departure && <p className='text-sm text-red-800'>*{errors.departure.message}</p>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            {/* destination always syncs with users' input */}
                            <label htmlFor="to" className='text-sm text-gray-500 font-semibold'>
                                To
                            </label>
                            <input {...register('destination', 
                            { required: 'This field is required.'})} 
                            type="text" value={destination} onChange={(eventObj) => setDestination(eventObj.target.value)} id='to' placeholder='Enter your destination (i.e. Kuala Lumpur)' className='border border-gray-200 p-2 rounded-lg'/>
                            {errors.destination && <p className='text-sm text-red-800'>*{errors.destination.message}</p>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="start_date" className='text-sm text-gray-500 font-semibold'>
                                 Start Date
                            </label>
                            <input {...register('start_date', 
                            { required: 'This field is required.'})} 
                            type="date" id='start_date' placeholder='Enter your date' className='border border-gray-200 p-2 rounded-lg'/>
                            {errors.start_date && <p className='text-sm text-red-800'>*{errors.start_date.message}</p>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="end_date" className='text-sm text-gray-500 font-semibold'>
                                 End Date
                            </label>
                            <input {...register('end_date', 
                            { required: 'This field is required.',
                                validate: (value) => // end date must be later or on the same day of start date
                                    !startDate || value >= startDate || 'End date must be after/equal to start date.',
                            })} 
                            type="date" id='end_date' placeholder='Enter your date' className='border border-gray-200 p-2 rounded-lg'/>
                            {errors.end_date && <p className='text-sm text-red-800'>*{errors.end_date.message}</p>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="num_people" className='text-sm text-gray-500 font-semibold'>
                                Number of people
                            </label>
                            <input {...register('num_people', 
                            { required: 'This field is required.'})} 
                            type="number" id='num_people' placeholder='Enter number of people' className='border border-gray-200 p-2 rounded-lg'/>
                            {errors.num_people && <p className='text-sm text-red-800'>*{errors.num_people.message}</p>}
                        </div>
                        
                        {/* hidden field to track action */}
                        <input type='hidden' {...register('action')}/>
                            <button type='submit' 
                            onClick={() => setValue('action', 'planJourney')} className='bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-700'>
                                Plan Journey
                            </button>

                            <button type='submit' 
                            onClick={() => setValue('action', 'save')} className='bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-700'>
                                Save
                            </button>

                        {/* show error message upon failed submission */}
                        {message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                            {message}
                            </div>
                        </div>
                        )}

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

                            <MapZoomer position={markerPosition}/>
                        </MapContainer>
                    </div>

                    {/* distance */}
                    <div className='text-white'>
                        Distance: {distance} km  <br/>
                        State:  {state}
                    </div>

                    <Menu as="div" className="relative inline-block text-left mt-3">
                        {/* Button */}
                        <MenuButton className="inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-slate-200 rounded-t-md hover:bg-slate-300">
                            {currentButton}
                        </MenuButton>

                        {/* Dropdown Menu */}
                        <MenuItems
                            className="absolute top-0 left-full ml-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            {/* Dropdown Items */}
                            <MenuItem>
                            {({ active }) => (<a 
                                onClick={() => handleButton('Attractions')}
                                className={`block px-4 py-2 text-sm ${
                                    active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                                }`}
                                >
                                Attractions
                                </a>
                            )}
                            </MenuItem>
                            <MenuItem>
                            {({ active }) => (<a
                                onClick={() => handleButton('Foods')}
                                className={`block px-4 py-2 text-sm ${
                                    active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                                }`}
                                >
                                Foods
                                </a>
                            )}
                            </MenuItem>
                            <MenuItem>
                            {({ active }) => (<a
                                onClick={() => handleButton('Hotels')}
                                className={`block px-4 py-2 text-sm ${
                                    active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                                }`}
                                >
                                Hotels
                                </a>
                            )}
                            </MenuItem>
                        </MenuItems>
                        </Menu>
                    
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