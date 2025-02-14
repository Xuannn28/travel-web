import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const forgotPwd = () => {

    const { register, handleSubmit, formState:{ errors },} = useForm();

    const [ message, setMessage ] = useState("");

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login')
      }
    
    const handleResetPwd = (data) => {
        setMessage("");
        AuthService.forgotPassword(data.email)
        .then(()=> {
            alert('Send reset link successfully.')
            navigate('/login')
          })
    
          .catch((error) => {
            
            const res =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
    
            setMessage(res);
            alert('Failed to send reset link. Please try again.')
          });
    }

  return (
    <div className='min-h-screen w-full m-auto bg-cover bg-center overflow-hidden relative pt-[6rem]' 
    style={{backgroundImage: "url('/about_background.jpg')"}} 
    id='ForgotPwd'>
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0"></div>
        
        <div className='z-0 relative'>
            <div className='w-[400px] m-auto p-6 mt-3 mb-5 bg-white bg-opacity-70 rounded-lg text-black justify-center items-center'>
                <h3 className='font-semibold'>
                    Forgot Password
                </h3>

                {/* request user's email form */}
                <form onSubmit={handleSubmit(handleResetPwd)} className='flex flex-col gap-2 p-2'>
                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="email" className='text-sm  font-semibold'>
                            Email address
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

                    <button type='submit' className='bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-700 mt-5'>
                        Send Reset Password Link
                    </button>

                    {/* show error message upon failed submission */}
                  {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                  )}

                    <button onClick={handleLogin} className='text-sm gap-2 p-2 hover:underline hover:text-blue-800'>
                    ⟵ Back to Login Page
                    </button>

                </form>
            </div>
        </div>

    </div>
  )
}

export default forgotPwd