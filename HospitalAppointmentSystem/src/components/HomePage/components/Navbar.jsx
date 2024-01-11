import React from 'react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 bg-gray-700 p-5 text-white">
      <h1 className='inline font-bold text-sm sm:text-xl text-cyan-300'><a href="#hero">Duskwood</a></h1>
      <ul className='inline float-right'>
      <li className='inline'>
          <a className='mr-1 sm:mr-5 font-semibold text-xs sm:text-base transition duration-300 ease-in-out hover:text-cyan-300' href="#about">
            About
          </a>
        </li>
        <li className='inline'>
          <a className='ml-1 mr-1 sm:ml-5  sm:mr-5 font-semibold text-xs sm:text-base transition duration-300 ease-in-out hover:text-cyan-300' href="#services">
            Services
          </a>
        </li>
        <li className='inline'>
          <a className='ml-1 mr-1 sm:ml-5 sm:mr-5 font-semibold text-xs sm:text-base transition duration-300 ease-in-out hover:text-cyan-300' href="#doctors">
            Doctors
          </a>
        </li>
        <li className='inline'>
          <a className='ml-1 mr-1 sm:ml-5 sm:mr-10 font-semibold text-xs sm:text-base transition duration-300 ease-in-out hover:text-cyan-300' href="#contact">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
