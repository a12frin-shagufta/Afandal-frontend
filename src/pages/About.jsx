import React from 'react';
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-20">
  <div className="inline-flex items-center gap-3 justify-center">
    <h1 
      style={{ fontFamily: 'var(--font-pacifico)' }}  
      className="text-2xl md:text-3xl text-gray-800"
    >
      Our <span className="text-orange-600">Story</span>
    </h1>
    <hr className="border-none h-[3px] w-12 bg-orange-500 rounded-full" />
  </div>
  <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-3">
    From humble beginnings to creating products that people love
  </p>
</div>

      {/* Founder Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-28">
      <div className="md:w-1/2 flex justify-center">
  <div className="w-64 h-64 md:w-80 md:h-80 relative">
    <img 
      src="https://i.pinimg.com/736x/f2/4c/9f/f24c9fec9624ea998324abababc476d5.jpg" 
      alt="Founder"
      className="rounded-full shadow-xl w-full h-full object-cover border-4 border-white"
    />
    {/* Optional decorative element */}
    <div className="absolute -inset-2 rounded-full border-2 border-orange-200 animate-pulse pointer-events-none"></div>
  </div>
</div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Founder</h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            "I started this company with a simple idea - to create products that solve real problems. 
            What began as a small project in my garage has now grown into a brand trusted by thousands."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <FaInstagram className="text-orange-600 text-xl" />
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <FaTwitter className="text-orange-600 text-xl" />
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <FaLinkedin className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-28">
        <div className="w-64 h-64 md:w-80 md:h-80 relative">
          <img 
            src="/assets/images/afandal.png" 
            alt="Our Team"
            className="rounded-xl shadow-xl w-full h-auto object-cover"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4 text-lg leading-relaxed">
            We believe in creating products that enhance everyday life. Our team of passionate designers, 
            engineers, and thinkers work tirelessly to bring you innovative solutions.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2 mt-1">•</span>
              <span className="text-gray-600">Quality craftsmanship in every product</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2 mt-1">•</span>
              <span className="text-gray-600">Sustainable and ethical manufacturing</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2 mt-1">•</span>
              <span className="text-gray-600">Customer satisfaction guaranteed</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Values Section */}
     
    </div>
  );
};

export default AboutUs;