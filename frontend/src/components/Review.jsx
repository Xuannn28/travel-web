import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import UserService from '../services/user.service';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Review = () => {

    const { register, handleSubmit, formState:{ errors }, setValue} = useForm();

    // state for rating attribute
    const [ rating, setRating ] = useState(0);

    // state for selecting stars
    const [ hoverValue, setHoverValue ] = useState(null);

    // colors of stars 
    const colors = {
        orange: '#F2C265',
        grey: 'a9a9a9'
    };

    const stars = Array(5).fill(0);

    // when rating, hover over the stars and filled with orange color before clicking on final rating
    const handleMouseOverStar = value => {
        setHoverValue(value);
    };

    // when user moves away from stars, remove the orange color from the stars
    const handleMouseLeaveStar = () => {
        setHoverValue(null);
    };

    // take the ratin value user choses
    const handleClickStar = value => {
        setRating(value);
        setValue('rating', value);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0
        })
    }

    // function to handle submit button
    const handleSubmitReview = (data) => {
        console.log(data.rating, data.review)
        UserService.submitReview(data.rating, data.review)
        .then(() => {
            alert('Review submitted successfully. Thank you !')
        })
        .catch((error) => {
            console.log(error)
            alert('Failed to submit review. Please try again.')
          });
    };

    // check for user authorization to access this page
    const navigate = useNavigate();
    useEffect(() => {
        const getReviewPage = async () => {
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
                const res = await fetch('/api/make-review', {
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

        getReviewPage();
        
    }, [navigate]);

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-slate-700 to-slate-600 text-white mx-auto py-20' id='Review'>
        <div className='relative z-10'>

            {/* header */}
            <div className='flex flex-row gap-5 text-3xl text-white font-bold py-4 px-6 sm:pt-0 md:px-20 lg:px-32 sm:text-4xl'>
                <Link to='/' onClick={scrollToTop} className='cursor-pointer'>
                    <img src={assets.logo} alt='logo' width={100} height={100} className='object-contain'/>
                </Link>
                <h3 className='mt-5'>
                    Leave a Review
                </h3>
            </div>

            <div className='mt-9'>
                <form onSubmit={handleSubmit(handleSubmitReview)} className='flex flex-col justify-center items-center text-center'>
                    
                    {/* rating stars */}
                    <div className='space-y-3'>
                        <label htmlFor="rating" className='text-sm md:text-xl text-white font-semibold'>
                            Click stars to rate us !
                        </label>
                        <div className="flex space-x-2 cursor-pointer"> 
                            {stars.map((_, index) => (
                                <FaStar
                                    key={index}
                                    size={45}
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    color={(hoverValue || rating) > index ? colors.orange : colors.grey}
                                    onClick={() => handleClickStar(index + 1)}
                                    onMouseOver={() => handleMouseOverStar(index + 1)}
                                    onMouseLeave={() => handleMouseLeaveStar}
                                />
                            ))}
                        </div>
                        {/* Hidden input field to store rating value */}
                        <input {...register('rating', 
                            { required: 'This field is required.'})} 
                        type='hidden' id='rating' value={rating}/>
                        {errors.rating && <p className='text-sm text-red-800'>*{errors.rating.message}</p>}
                    </div>

                    {/* feedback message */}
                    <div className='space-y-3 mt-10'>
                        <label htmlFor="review" className='text-sm md:text-xl text-white font-semibold'>
                            Share your review about our website
                        </label>
                        <textarea className='w-full border border-gray-300 text-black rounded py-3 px-4 mt-2 h-48 resize-none' placeholder='Message' name='Review'
                        {...register("review")}></textarea>
                        {errors.review && <p className='text-sm text-red-800'>*{errors.review.message}</p>}
                    </div>
                    
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                        Submit Review
                    </button>
                </form>
            </div>


        </div>
    </div>
  )
}

export default Review