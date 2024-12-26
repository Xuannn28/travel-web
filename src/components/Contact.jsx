import React, { useEffect } from 'react'
import { motion } from "framer-motion";

const Contact = () => {

  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");  // show Sending... when form is submitted
    const formData = new FormData(event.target);

    formData.append("access_key", import.meta.env.VITE_WEB3FORM_KEY);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("");  // clear the result when form is submitted successfully
      alert("Form Submitted Successfully");  // show alert on window
      event.target.reset();
    } else {
      console.log("Error", data);
      alert(data.message)
      setResult("");
    }
  };

  return (
    <div className='w-full mx-auto' id='Contact'>
        <motion.div initial={{ opacity: 0, y:100 }} whileInView={{ opacity: 1, y:0}} transition={{ duration: 1 }} viewport={{ once:true }}
        className='z-10 relative grid grid-cols-1 md:grid-cols-2' >
            
            {/* header */}
            <div className='flex flex-col justify-center items-center text-center p-6 md:p-15'
            style={{
                backgroundImage: `url('/contact_background.jpg')`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
              }} >
                <h3 className='text-white text-3xl font-bold py-4 px-6 pt-20 sm:pt-0 md:px-20 lg:px-32 sm:text-4xl inline-block'>
                        Contact Us
                </h3>
                <p className='text-lg text-gray-300 px-6 pt-4 md:px-20 lg:px-32'>
                    We'd love to hear from you! Fill out the form and our team will get back
                    to you as soon as possible.
                </p>
            </div>

            {/* form */}
            <form onSubmit={onSubmit} className='gap-4 flex flex-col w-[70%] m-auto p-6 md:p-15'>
                    <div className='w-full text-left '>
                        Your Name
                        <input type='text' placeholder='Your Name' name='Name' required
                        className='w-full border border-gray-400 rounded py-3 px-4 mt-2'/>
                    </div>

                    <div className='w-full text-left py-4'>
                        Your Email
                        <input type='email' placeholder='email@address.com' name='Email' required
                        className='w-full border border-gray-400 rounded py-3 px-4 mt-2'/>
                    </div>

                    <div className='w-full text-left py-4'>
                        Your Message
                        <textarea className='w-full border border-gray-300 rounded py-3 px-4 mt-2 h-48 resize-none' placeholder='Message' name='Message' required></textarea>
                    </div>
                    
                    <button className='w-full text-center py-4 bg-slate-300 border border-slate-500 px-8 rounded-full hover:bg-slate-500 hover:text-slate-100'>
                            {result ? result : "Send Message"}  
                            {/* if result is not Sending..., display send message */}
                        
                    </button>
            </form>

        </motion.div>
    </div>
  )
}

export default Contact