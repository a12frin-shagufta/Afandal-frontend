import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { Link } from 'react-router-dom';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      

      // Fallback to createdAt if dateAdded doesn't exist
      const sortedProducts = [...products].sort((a, b) => 
        new Date(b.dateAdded || b.createdAt || 0) - new Date(a.dateAdded || a.createdAt || 0)
      );
      
      setLatestProducts(sortedProducts.slice(0, 8));
    }
  }, [products]);

  return (
    <section className="my-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Title text1="LATEST" text2="COLLECTION" />
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-500 font-light">
            Discover our newest arrivals
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {latestProducts.map((item) => (
            item && item._id && (  // Changed from id to _id
              <ProductItem 
              key={item._id || item.id}
              _id={item._id || item.id} // Pass both possibilities
                name={item.name}
               
                price={item.price}
                image={item.image}
                
              />
            )
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/collections" 
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600 transition-colors"
          >
            View all products
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;