import React from 'react';
import Image from '../assets/image2.jpg'

const About = () => {
  return (
    <section id="about" className="bg-gray-50 py-16 px-6 scroll-mt-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">About Duskwood Health Care</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8">
          <div className="flex-1 h-[350px] w-full bg-no-repeat bg-cover rounded-lg shadow-lg" style={{backgroundImage: `url(${Image})`, backgroundRepeat: `none`}}></div>

          <div className="flex-1">
            <p className="text-base lg:text-xl mb-6">
                Duskwood Health Care, established in 2018 in the serene Kandy district, is a dedicated medical center focused on delivering personalized and compassionate care. Despite being a smaller facility with a team of just three experienced doctors, we pride ourselves on providing high-quality healthcare services tailored to each patient's needs.
            </p>
            <p className="text-base lg:text-xl mb-6">
                Our medical center is equipped with the essential resources to offer comprehensive care in a warm and welcoming environment. We are committed to building lasting relationships with our patients and ensuring that each visit is met with the highest standards of professionalism and empathy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
