import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cover from '../assets/image5.jpg'

const Hero = () => {
  const navigate = useNavigate();

  const addAppointment = (e) => {
    e.preventDefault();
    navigate(`/add-appointment`);
  };

  return (
    <section id="hero"
      className="text-center h-[250px] py-12 px-5 bg-center bg-cover opacity- scroll-mt-16 text-white"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Cover})` }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-white md:text-5xl">Welcome to <span className='text-cyan-400'>Duskwood</span> Hospital</h2>
      <p className="text-xl text-white md:text-2xl mt-4">Your health is our priority</p>
      <button
        className="mt-5 py-2 px-4 text-base bg-gray-800 rounded-lg text-white border-none cursor-pointer transition-colors duration-300 hover:bg-cyan-500"
        onClick={addAppointment}
      >
        Make an Appointment
      </button>
    </section>
  );
};

export default Hero;
