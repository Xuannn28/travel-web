import React, { useState }  from 'react'
import { useForm } from 'react-hook-form';
import AuthService from '../services/auth.service';
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const ResetPwd = () => {

    const [searchParams] = useSearchParams();

    const id = searchParams.get('id');

    const token = searchParams.get('token');

    const { register, handleSubmit, formState:{ errors },} = useForm();

    const [ message, setMessage ] = useState("");

    const navigate = useNavigate();

    const handleResetPwd = (data) => {
        setMessage("");
        AuthService.resetPassword(id, token, data.password)
        .then(()=> {
            alert('Reset password successfully.')
            navigate('/leave-reset')
          })
    
          .catch((error) => {
            
            const res =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
    
            setMessage(res);
            alert('Failed to reset password. Please try again.')
          });
    }

  return (
    <div className='min-h-screen w-full m-auto bg-cover bg-center overflow-hidden relative pt-[6rem]' 
    style={{backgroundImage: "url('/about_background.jpg')"}} 
    id='ResetPwd'>
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0"></div>
        
        <div className='z-0 relative'>
            <div className='w-[400px] m-auto p-6 mt-3 mb-5 bg-white bg-opacity-70 rounded-lg text-black justify-center items-center'>
                <h3 className='font-semibold'>
                    Reset Password
                </h3>

                {/* request user's email form */}
                <form onSubmit={handleSubmit(handleResetPwd)} className='flex flex-col gap-2 p-2'>
                    
                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="password" className='text-sm  font-semibold'>
                            New Password <span className='text-sm text-slate-800'>(min 6 characters)</span>
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

                    <button type='submit' className='bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-700 mt-5'>
                        Reset Password
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
        </div>

    </div>
  )
}

export default ResetPwd