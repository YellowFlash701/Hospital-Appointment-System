import React from 'react';
import Image from '../assets/image.png'

const Services = () => {
  return (
    <section id="services" className="p-10 bg-gray-100 scroll-mt-16">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='text-center mt-0 md:mt-10'>
          <h2 className='mb-4 text-3xl font-bold'>Our Services</h2>
          <ul>
            <li className='m-1 text-lg text-slate-700 font-semibold hover:text-cyan-500 transition-colors duration-300'>Emergency Care</li>
            <li className='m-1 text-lg text-slate-700 font-semibold hover:text-cyan-500 transition-colors duration-300'>Cardiology</li>
            <li className='m-1 text-lg text-slate-700 font-semibold hover:text-cyan-500 transition-colors duration-300'>Pediatrics</li>
            <li className='m-1 text-lg text-slate-700 font-semibold hover:text-cyan-500 transition-colors duration-300'>Neurology</li>
            <li className='m-1 text-lg text-slate-700 font-semibold hover:text-cyan-500 transition-colors duration-300'>And More!</li>
          </ul>
        </div>
        <div className='flex-1 hidden bg-no-repeat md:block h-[300px] w-full rounded-lg shadow-lg' style={{backgroundImage: `url(${Image})`, backgroundSize: 'cover', backgroundPosition: 'center',}}></div>
      </div>
    </section>
  );
};

export default Services;