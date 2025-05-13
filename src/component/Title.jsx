import React from 'react';

const Title = ({ text1, text2, className = '' }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-800">
          {text1} <span className="text-orange-500 font-medium">{text2}</span>
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-orange-400 to-orange-200"></div>
      </div>
    
    </div>
  );
};

export default Title;