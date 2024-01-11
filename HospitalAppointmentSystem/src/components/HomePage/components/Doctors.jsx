import React from 'react';
import Doc1 from '../assets/imgDoc1.jpeg'
import Doc2 from '../assets/imgDoc2.jpeg'
import Doc3 from '../assets/imgDoc3.jpeg'

const Doctors = () => {
  return (
    <section id="doctors" className="py-12 px-5 text-center scroll-mt-16">
      <h2 className="text-3xl font-bold mb-14">Meet Our Special Doctors</h2>
      <div className='flex justify-around flex-wrap mt-5'>
        <div className="text-center transition-transform sm:hover-scale-up">
          <div className='rounded-full bg-no-repeat mx-auto bg-cover h-[150px] w-[150px] hover:shadow-lg transition-shadow duration-300' style={{backgroundImage: `url(${Doc1})`, backgroundSize: 'cover', backgroundPosition: 'center',}}></div>
          <h3 className="mt-2 mb-1 text-lg font-medium">Dr. Smith</h3>
          <p className="text-base">Cardiologist</p>
        </div>
        <div className="text-center transition-transform sm:hover-scale-up">
          <div className='rounded-full bg-no-repeat mx-auto bg-cover h-[150px] w-[150px] hover:shadow-lg transition-shadow duration-300' style={{backgroundImage: `url(${Doc2})`, backgroundSize: 'cover', backgroundPosition: 'center',}}></div>
          <h3 className="mt-2 mb-1 text-lg font-medium">Dr. Williams</h3>
          <p className="text-base">Pediatrician</p>
        </div>
        <div className="text-center transition-transform sm:hover-scale-up">
          <div className='rounded-full bg-no-repeat mx-auto bg-cover h-[150px] w-[150px] hover:shadow-lg transition-shadow duration-300' style={{backgroundImage: `url(${Doc3})`, backgroundSize: 'cover', backgroundPosition: 'center',}}></div>
          <h3 className="mt-2 mb-1 text-lg font-medium">Dr. Johnson</h3>
          <p className="text-base">Neurologist</p>
        </div>
      </div>
    </section>
  );
};

export default Doctors;
