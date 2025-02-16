import React, { useEffect } from 'react'
import Nav from './components/Nav'
import Header from './components/Header'
import About from './components/About'
import Destinations from './components/Destinations'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlanJourney from './components/PlanJourney'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile';
import Review from './components/Review';
import ResetPwd from './components/ResetPwd'
import LeaveReset from './components/LeaveReset'
import ForgotPwd from './components/ForgotPwd'

const App = () => {
  return (
    <Router>
      <div className='w-full overflow-hidden'>
        
        <Routes>
          {/* Define routes for components */}
          <Route path='/' element={
            <>
              <Nav/>
              <Header/>
              <About/>
              <Destinations/>
              <Testimonials/>
              <Contact/>
              
            </>
          } />
          
          {/* Route for plan journey button on destination page */}
          <Route path='/plan-journey' element={<PlanJourney/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/make-review' element={<Review/>} />
          <Route path='/forgot-password' element={<ForgotPwd/>} />
          <Route path='/reset-password' element={<ResetPwd/>} />
          <Route path='/leave-reset' element={<LeaveReset/>} />
        </Routes>
        <Footer/>
      </div>
    </Router>
    

  )
}

export default App