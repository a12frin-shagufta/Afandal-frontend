// import React from 'react';

// const Hero = () => {
//   return (
//     <div className="flex flex-col md:flex-row bg-white text-gray-800 overflow-hidden border-2 border-gray-200">
//       {/* Left Side - Image */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 ">
//         <div className="relative p-1 rounded-lg  shadow-xl">
//           <img
//             src="https://i.pinimg.com/736x/dc/96/b6/dc96b62bc974936a2a16201810553bd8.jpg"
//             alt="Luxury Fashion"
//             className="w-full h-auto max-h-[80vh] object-cover object-center rounded-lg"
//           />
//           <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
//         </div>
//       </div>

//       {/* Right Side - Text Content */}
//       <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-8 md:p-16 lg:p-24">
//         {/* Accent line - Orange */}
//         <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-300 mb-6"></div>

//         {/* Main Heading with Orange accent */}
//         <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide mb-6 leading-tight">
//           <span className="font-semibold text-orange-500">AFANDAL</span>  CLOTHING
//         </h1>

//         {/* Subheading with Orange highlights */}
//         <p className="text-lg md:text-xl font-light leading-relaxed mb-10 text-gray-600 max-w-lg">
//           Where <span className="text-orange-500">timeless elegance</span> meets modern sophistication. Our exclusive collections redefine luxury.
//         </p>

//         {/* Button Group */}
//         <div className="flex flex-col sm:flex-row gap-5">
//           <button
//             onClick={() => window.location.href = '/collections'}
//             className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-medium py-3 px-10 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-300/30"
//           >
//             Explore Collections
//           </button>
//           <button
//             onClick={() => window.location.href = '/contact'}
//             className="border-2 border-gray-300 hover:border-orange-400 text-gray-700 font-medium py-3 px-10 rounded-sm transition-all duration-300 hover:text-orange-500"
//           >
//             Contact Us,
//           </button>
//         </div>

//         {/* Royal Seal with Orange accent */}
//         <div className="mt-12 flex items-center gap-3 text-sm text-gray-500">
//           <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
//           </svg>
//           <span>Wear the mood Daily</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Hero = () => {
  const { offers } = useContext(ShopContext);

  // Select Diwali Sale offer if available, else fallback to highest discount
  const diwaliOffer = offers.find(offer => offer.title.toLowerCase().includes('diwali')) || 
    (offers.length > 0 ? offers.reduce((max, offer) => 
      offer.discountPercent > max.discountPercent ? offer : max, offers[0]) : null);

  return (
    <div className="flex flex-col md:flex-row bg-white text-gray-800 overflow-hidden border-2 border-gray-200">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="relative p-1 rounded-lg shadow-xl">
          <img
            src="https://i.pinimg.com/736x/dc/96/b6/dc96b62bc974936a2a16201810553bd8.jpg"
            alt="Luxury Fashion"
            className="w-full h-auto max-h-[80vh] object-cover object-center rounded-lg"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Right Side - Text Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-8 md:p-16 lg:p-24">
        {/* Diwali Sale Banner */}
        {diwaliOffer && (
          <div className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white text-center py-3 mb-6 rounded-md shadow-lg">
            <p className="text-lg font-bold">
              {diwaliOffer.title}: {diwaliOffer.discountPercent}% OFF! 
              <span className="block text-sm font-medium mt-1">
                Hurry, Ends {new Date(diwaliOffer.validTill).toLocaleDateString()}!
              </span>
            </p>
          </div>
        )}

        {/* Accent line - Orange */}
        <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-300 mb-6"></div>

        {/* Main Heading with Orange accent */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide mb-6 leading-tight">
          <span className="font-semibold text-orange-500">AFANDAL</span> CLOTHING
        </h1>

        {/* Subheading with Orange highlights */}
        <p className="text-lg md:text-xl font-light leading-relaxed mb-10 text-gray-600 max-w-lg">
          Where <span className="text-orange-500">timeless elegance</span> meets modern sophistication. Our exclusive collections redefine luxury.
        </p>

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row gap-5">
          <Link
            to={diwaliOffer ? '/collections?offer=true' : '/collections'}
            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-medium py-3 px-10 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-300/30"
          >
            Collection
          </Link>
          <Link
            to="/contact"
            className="border-2 border-gray-300 hover:border-orange-400 text-gray-700 font-medium py-3 px-10 rounded-sm transition-all duration-300 hover:text-orange-500"
          >
            Contact Us
          </Link>
        </div>

        {/* Royal Seal with Orange accent */}
        <div className="mt-12 flex items-center gap-3 text-sm text-gray-500">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>Wear the mood Daily</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;