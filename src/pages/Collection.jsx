import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../component/Title';
import ProductItem from '../component/ProductItem';

const Collection = () => {
  const { products, search, showSearch, isLoading, error, offers } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);

  const applyFilter = () => {
    let productsCopy = [...(products || [])];
    
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    if (products && products.length >= 0) {
      applyFilter();
    }
  }, [search, showSearch, products]);

  // Debug log for offers and product IDs
  useEffect(() => {
    console.log('Collection Offers:', offers);
    console.log('Collection Product IDs:', products.map(p => p._id));
  }, [offers, products]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-8 sm:pt-10 px-4 sm:px-6 border-gray-300">
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {error ? (
            <p className="col-span-full text-center py-10 text-red-500">
              Error loading products: {error}
            </p>
          ) : isLoading ? (
            <p className="col-span-full text-center py-10 text-gray-500">
              Loading products...
            </p>
          ) : filterProducts.length > 0 ? (
            filterProducts.map((item) => (
              <ProductItem
                key={item._id || item.id}
                _id={item._id || item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                bestseller={item.bestseller}
                stock={item.stock}
              />
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-gray-500">
              {products?.length === 0 ? 'No products available' : 'No products match your search'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;



// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../component/Title';
// import ProductItem from '../component/ProductItem';

// const Collection = () => {
//   const { products, search, showSearch, isInStock, isLoading, error } = useContext(ShopContext);  // Changed product to products
//   const [filterProducts, setFilterProducts] = useState([]);

//   const applyFilter = () => {
//     let productsCopy = [...(products || [])];  // Changed product to products
    
//     if (showSearch && search) {
//       productsCopy = productsCopy.filter(item =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }
    
//     setFilterProducts(productsCopy);
//   };

//   useEffect(() => {
//     if (products && products.length >= 0) {  // Changed product to products
//       applyFilter();
//     }
//   }, [search, showSearch, products]);  // Changed product to products

//   return (
//     <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-8 sm:pt-10 px-4 sm:px-6 border-gray-300">
//       <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <Title text1={'ALL'} text2={'COLLECTIONS'} />
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
//           {error ? (
//             <p className="col-span-full text-center py-10 text-red-500">
//               Error loading products: {error}
//             </p>
//           ) : isLoading ? (
//             <p className="col-span-full text-center py-10 text-gray-500">
//               Loading products...
//             </p>
//           ) : filterProducts.length > 0 ? (
//             filterProducts.map((item) => (
//               <ProductItem
//               key={item._id || item.id}
//               _id={item._id || item.id} // Pass both possibilities
//                 name={item.name}
               
//                 price={item.price}
//                 image={item.image}
//                 bestseller={item.bestseller}
//                 stock={item.stock}
//                 isInStock={isInStock(item._id)}
//               />
//             ))
//           ) : (
//             <p className="col-span-full text-center py-10 text-gray-500">
//               {products?.length === 0 ? 'No products available' : 'No products match your search'}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;
