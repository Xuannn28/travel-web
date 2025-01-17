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
        </Routes>
        <Footer/>
      </div>
    </Router>
    

  )
}

export default App