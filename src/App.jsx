import React from 'react'
import Nav from './components/Nav'
import Header from './components/Header'
import About from './components/About'
import Destinations from './components/Destinations'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='w-full overflow-hidden'>
      <Nav/>
      <Header/>
      <About/>
      <Destinations/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </div>

  )
}

export default App