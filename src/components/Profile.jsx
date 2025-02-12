import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { assets } from '../assets/assets';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router-dom';
import UserService from '../services/user.service';

const Profile = () => {

  // check if user is logged in
  const navigate = useNavigate();

  // state to track user email 
  const [ email, setEmail ] = useState('');

  // state to track user username 
  const [ username, setUsername ] = useState('User');

  // state to track no. saved plans
  const [ numPlan, setNumPlan ] = useState(0);

  // state to track no. review history
  const [ numReview, setNumReview ] = useState(0);

  // state to track saved plan
  const [ arrayPlan, setArrayPlan ] = useState([]);

  // state to track start date ordering
  const [ sortOrder, setSortOrder ] = useState('asc');

  // state to track review history
  const [ arrayReview, setArrayReview ] = useState([]);

  // function to handle sorting
  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }

  // function to sort saved plan based on start date
  const sortedPlans = [...arrayPlan].sort((a,b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // state to track selected dropdown menu 
  const [ selectedButton, setSelectedButton ] = useState('Account');

  // function to updated selected button
  const handleButton = (selectedButton) => {
    setSelectedButton(selectedButton);
  };

  const scrollToTop = () => {
    window.scrollTo({
        top: 0
    })
  }

    // function to navigate to plan journey page
    const handlePlanJourney = () => {
      navigate('/plan-journey');
      window.scrollTo({
        top: 0,
        behavior:'smooth'
      })
    }

    // function to navigate to leave review page
    const handleMakeReview = () => {
      navigate('/make-review');
      window.scrollTo({
        top: 0,
        behavior:'smooth'
      })
    }

    // function to handle delete button on saved plans page
    const handleDeletePlan = async (tripId) => {
      try {
        // delete plan from backend
        await UserService.deletePlan(tripId);

        // update state to remove trip on the frontend
        setArrayPlan(arrayPlan.filter(plan => plan._id !== tripId ));

      } catch (err) {
        console.log('Failed to delete plan: ', err);
      }
    }

    
    // function to handle delete button on saved plans page
    const handleDeleteReview = async (reviewId) => {
      try {
        // delete plan from backend
        await UserService.deleteReview(reviewId);

        // update state to remove trip on the frontend
        setArrayReview(arrayReview.filter(review => review._id !== reviewId ));

      } catch (err) {
        console.log('Failed to delete review: ', err);
      }
    }

    useEffect(() => {
      const getUserData = async () => {
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
              const res = await fetch('/api/profile', {
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
              });
              
              // handle res
              if (res.ok) {

                // get User object from backend
                const data = await res.json();
                console.log('Received data: ', data)
                const profileName = data.email.split('@')[0];
                const plans = data.saved_trip || [];
                const reviews = data.reviews || [];
 
                setEmail(data.email);
                setUsername(profileName);
                setNumPlan(plans.length);
                setArrayPlan(plans);
                setArrayReview(reviews);

              } else if (!res.ok) {
                if (res.status === 401  || res.status === 403) {  // JWT expired or invalid
                  console.log('expired/invalid JWT');
                  localStorage.removeItem('user');
                  navigate('/login');  
                }
              }
          } catch (err) {
              console.log("Login authorisation error: ", err);
          }
      };

      getUserData();
      
  }, [navigate]);

  // function to show content based on respective button
  const content = () => {
    switch (selectedButton) {
      case 'Account':
        return (
          <div>
            <div className='text-sm md:text-xl font-semibold justify-center items-center text-center'>
              User's Account
            </div>

            <ul className=' flex flex-col mt-5 font-semibold pl-6 space-y-4 text-sm md:text-lg'>
              <li>Username: {username} </li>
              <li>Email: {email} </li>
              <li>No. of Saved Plans: {numPlan} </li>
              <li>No. of Review History: {numReview} </li>
            </ul>
          </div>
        )
      case 'Saved-Plans': 
        return (
          <div>
            <div className='text-sm md:text-xl font-semibold justify-center items-center text-center'>
              Saved Plans
            </div>

            {/* table showing trip saved by user */}
            <div className='w-full overflow-x-auto mt-5 flex justify-center'>  
              <div className='w-full inline-block'>
                <table className='w-full text-sm shadow-md sm:rounded-lg overflow-auto'>
                  <thead className='text-xs uppercase bg-purple-200 text-gray-600'>
                    <tr>
                      <th scope='col' className='px-6 py-3'>Departure</th>
                      <th scope='col' className='px-6 py-3'>Destination</th>
                      <th scope='col' className='px-6 py-3 cursor-pointer' onClick={handleSort}>
                        Start Date
                        {sortOrder === 'asc' ? ' ▲' : ' ▼'}
                      </th>
                      <th scope='col' className='px-6 py-3'>End Date</th>
                      <th scope='col' className='px-6 py-3'>Num of People</th>
                      <th scope='col' className='px-6 py-3'>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlans.length > 0 ? (
                      sortedPlans.map((trip, index) => (
                        <tr key={trip._id} className='bg-white text-black text-center border-b border-gray-700 '>
                          <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                            {trip.departure}
                          </td>
                          <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                            {trip.destination}
                          </td>
                          <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                            {trip.start_date.split('T')[0]}
                          </td>
                          <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                            {trip.end_date.split('T')[0]}
                          </td>
                          <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                            {trip.num_people}
                          </td>
                          <td scope="row" className="px-6 py-3 font-medium whitespace-nowrap">
                            <button onClick={() => handleDeletePlan(trip._id)} className='bg-red-800 text-sm p-1 rounded-lg text-white'>D</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 bg-white text-gray-900">No saved trips found.</td>
                      </tr>
                    )}
                    
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        );
      case 'Review-History':
        return (
          <div>
            <div className='text-sm md:text-xl font-semibold justify-center items-center text-center'>
              Review History
            </div>

            {/* table showing trip saved by user */}
            <div className='w-full overflow-x-auto mt-5 flex justify-center'>  
              <div className='w-full inline-block'>
                <table className='w-full text-sm shadow-md sm:rounded-lg overflow-auto'>
                  <thead className='text-xs uppercase bg-purple-200 text-gray-600'>
                    <tr>
                      <th scope='col' className='px-6 py-3'>Rating</th>
                      <th scope='col' className='px-6 py-3'>Review</th>
                      <th scope='col' className='px-6 py-3'>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrayReview.length > 0 ? (
                      arrayReview.map((review, index) => (
                        <tr key={review._id} className='bg-white text-black text-center border-b border-gray-700 '>
                          <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                            {review.rating}
                          </td>
                          <td scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                            {review.review}
                          </td>
                          <td scope="row" className="px-6 py-3 font-medium whitespace-nowrap">
                            <button onClick={() => handleDeleteReview(review._id)} className='bg-red-800 text-sm p-1 rounded-lg text-white'>D</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4 bg-white text-gray-900">No reviews found.</td>
                      </tr>
                    )}
                  
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        );
      default:
        return (
          <div className='text-lg justify-center items-center text-center'>
            No content available.
          </div>
        )
    }
  }



  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-slate-700 to-slate-600 text-white mx-auto' id='Profile'>
      <div className='relative z-10'>

        {/* header bar */}
        <div className='w-full h-18 bg-white'>
            {/* sidebar menu */}
            <div className='flex flex-row text-gray-700 gap-3'>
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-slate-200 rounded-t-md hover:bg-slate-300">
                  <img src={assets.profile_menu} alt='menu' width={40} height={40} className='top-0 left-0 object-cover'/>
                </MenuButton>

                <MenuItems className="absolute w-56 h-screen origin-top-left bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  {/* Dropdown Items */}
                  <MenuItem>
                  {({ active }) => (<Link 
                      to='/' onClick={scrollToTop}
                      className={`block px-4 py-2 text-sm ${
                          active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      }`}
                      >
                      Home
                      </Link>
                  )}
                  </MenuItem>

                  <MenuItem>
                  {({ active }) => (<a 
                      onClick={() => handleButton('Account')}
                      className={`block px-4 py-2 text-sm cursor-pointer ${
                          active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      }`}
                      >
                      Account
                      </a>
                  )}
                  </MenuItem>

                  <MenuItem>
                  {({ active }) => (<a 
                      onClick={() => handleButton('Saved-Plans')}
                      className={`block px-4 py-2 text-sm cursor-pointer ${
                          active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      }`}
                      >
                      Saved Plans
                      </a>
                  )}
                  </MenuItem>

                  <MenuItem>
                  {({ active }) => (<a 
                      onClick={() => handleButton('Review-History')}
                      className={`block px-4 py-2 text-sm cursor-pointer ${
                          active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      }`}
                      >
                      Review History
                      </a>
                  )}
                  </MenuItem>

                  <MenuItem>
                  {({ active }) => (<a 
                      onClick={AuthService.logout}
                      className={`block px-4 py-2 text-sm cursor-pointer ${
                          active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      }`}
                      >
                      Log Out
                      </a>
                  )}
                  </MenuItem>

                </MenuItems>
              </Menu>
              
              <h3 className='font-bold text-lg mt-3'>
                User's Profile
              </h3>

              <div className='flex gap-2 p-3 sm:text-sm'>
                <button onClick={handlePlanJourney} className='bg-green-200 border border-green-800 text-green-950 px-2 rounded-full hover:bg-green-300'>
                  Plan Journey
                </button>
                <button onClick={handleMakeReview} className='bg-green-200 border border-green-800 text-green-950 px-2 rounded-full hover:bg-green-300'>
                  Make Review
                </button>
              </div>
            </div>
        </div>

        {/* content */}
        <div className='p-10'>
          <div className='w-full h-screen mx-auto border-2 border-white border-dashed p-5 justify-center items-center rounded-lg overflow-auto'>
              {content()}
          </div>
        </div>


      </div>
    </div>
  )
}

export default Profile