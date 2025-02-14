import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { Link } from 'react-router-dom';

const Login = () => {
  
  // react hook form for validation
  const { register, handleSubmit, formState:{ errors },} = useForm();

  const [ message, setMessage ] = useState("");

  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/sign-up')
  }

  const scrollToTop = () => {
    window.scrollTo({
        top: 0
    })
  }

  const handleForgotPwd = () => {
    navigate('/forgot-password')
  }

  const handleLogin = (data) => {
    setMessage("");
    AuthService.login(data.email, data.password)
      .then(()=> {

        navigate('/profile');
        window.location.reload();
        alert('Login successfully.')
      })

      .catch((error) => {
        
        const res =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(res);
        alert('Login failed. Please try again.')
      });
      
  }

  return (
    <div className='min-h-screen w-full m-auto bg-cover bg-center overflow-hidden relative pt-[6rem]' 
    style={{backgroundImage: "url('/about_background.jpg')"}} 
    id='Login'>

        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0"></div>
        
        <div className='z-0 relative'>
            <div className='w-[400px] m-auto p-6 mt-3 mb-5 bg-white bg-opacity-70 rounded-lg text-black justify-center items-center'>
              <h3 className='font-semibold'>
                Login
              </h3>

              {/* login form */}
              <form 
              onSubmit={handleSubmit(handleLogin)}
              className='flex flex-col gap-2 p-2'>
                <div className='flex flex-col gap-2 mt-4'>
                  <label htmlFor="email" className='text-sm  font-semibold'>
                    Email
                  </label>
                  <input {...register('email', 
                  { required: 'This field is required.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address."
                    }
                   })} 
                  type="email" id='email' placeholder='email@address.com' className=' text-black p-2 rounded-lg'/>
                  {errors.email && <p className='text-sm text-red-800'>*{errors.email.message}</p>}
                </div>

                <div className='flex flex-col gap-2 mt-4'>
                  <label htmlFor="password" className='text-sm  font-semibold'>
                    Password <span className='text-sm text-slate-800'>(min 6 characters)</span>
                  </label>
                  <input {...register('password', 
                    { required: 'This field is required.',
                      minLength: {
                        value: 6,
                        message: 'This field required at least 6 characters.'
                      }

                    })} 
                    type="text" id='password' placeholder='Enter your password' className=' text-black p-2 rounded-lg'/>
                  {/* display error msg */}
                  {errors.password && <p className='text-sm text-red-800'>*{errors.password.message}</p>}
                </div>

                <button type='submit' className='bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-700'>
                    Login
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

              <button  onClick={handleForgotPwd} className='text-sm gap-2 p-2 hover:underline hover:text-blue-800'>
                Forgot Password?
              </button>

              {/* <div className='flex flex-col p-2'>
                <button type='submit' className='bg-white justify-center items-center px-5 py-2 rounded-full border border-black hover:bg-slate-200 flex'>
                  <img src={assets.google} alt='google icon' width={30} className='object-contain mr-2'/> 
                  <span>Continue with Google</span>
                </button>
              </div> */}

              <p className='text-sm p-2'>
                Need an account?
                <span>
                  <button onClick={handleSignUp} className='text-sm underline gap-2 p-2 hover:underline hover:text-blue-800'>
                    Sign Up
                  </button>
                </span>
              </p>
              
              <Link to='/' onClick={scrollToTop}  className='text-sm gap-2 p-2 hover:underline hover:text-blue-800'>
                 ⟵ Back to Home Page
              </Link>

            </div>
        </div>
    </div>
  )
}

export default Login