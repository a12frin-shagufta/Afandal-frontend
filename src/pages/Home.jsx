import React from 'react';
import Hero from '../component/Hero';
import LattestCollection from '../component/LatestCollection';

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      <Hero/>
      <LattestCollection/>
    </div>
  )
}

export default Home;