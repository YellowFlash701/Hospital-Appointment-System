import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Doctors from './components/Doctors';
import Contact from './components/Contact';
import Footer from './components/Footer';
import About from './components/About';

const HomePage = () => {
  return (
    <div className='scroll-smooth cursor-default'>
      <Navbar />
      <Hero />
      <About/>
      <Services />
      <Doctors />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
