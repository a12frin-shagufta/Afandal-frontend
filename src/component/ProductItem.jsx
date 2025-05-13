import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const ProductItem = ({ _id, image, name, price, bestseller, stock }) => {
  const { currency, offers } = useContext(ShopContext);
  const outOfStock = stock === 0;
  const imageSrc = Array.isArray(image) ? 
    (image.length > 0 ? image[0] : '/placeholder.jpg') : 
    (image || '/placeholder.jpg');

  // Find an active offer for this product
  const applicableOffer = offers.find((offer) =>
    (offer.applyToAllProducts ?? false) || 
    offer.applicableProducts.some((product) => product._id?.toString() === _id?.toString())
  );

  // Calculate discounted price if an offer applies
  const discountedPrice = applicableOffer
    ? price * (1 - applicableOffer.discountPercent / 100)
    : price;

  // Debug log to verify offer data
  console.log(`ProductItem ${_id}:`, {
    applicableOffer,
    discountPercent: applicableOffer?.discountPercent,
    discountedPrice,
    applyToAllProducts: applicableOffer?.applyToAllProducts ?? 'missing',
    offerProductIds: applicableOffer?.applicableProducts?.map(p => p._id),
  });

  return (
    <Link
      to={`/product/${_id}`}
      className="group block border border-gray-300 rounded-md overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="relative bg-gray-50 p-2 flex items-center justify-center h-64">
        <img
          src={imageSrc}
          alt={name}
          className="h-full object-contain"
        />
        {bestseller && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Bestseller
          </div>
        )}
        {outOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of stock
          </div>
        )}
        {applicableOffer && !outOfStock && (
          <div className="absolute top-2 left-16 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {applicableOffer.discountPercent}% Off
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
        <div className="text-sm mt-1 flex flex-col gap-1">
          {applicableOffer && !outOfStock ? (
            <>
              <p className="text-gray-600 line-through">
                {currency}{price.toFixed(2)}
              </p>
              <p className="text-green-600 font-medium">
                {currency}{discountedPrice.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-gray-600">
              {currency}{price.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;

// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';

// const ProductItem = ({ _id, image, name, price, bestseller, stock }) => {
//   const { currency, offers } = useContext(ShopContext);
//   const outOfStock = stock === 0;
//   const imageSrc = Array.isArray(image) ? 
//     (image.length > 0 ? image[0] : '/placeholder.jpg') : 
//     (image || '/placeholder.jpg');

//   // Find an active offer for this product
//   const applicableOffer = offers.find((offer) =>
//     offer.applicableProducts.some((product) => product._id === _id)
//   );

//   // Calculate discounted price if an offer applies
//   const discountedPrice = applicableOffer
//     ? price * (1 - applicableOffer.discountPercent / 100)
//     : price;

//   return (
//     <Link
//       to={`/product/${_id}`}
//       className="group block border border-gray-300 rounded-md overflow-hidden transition-shadow hover:shadow-md"
//     >
//       <div className="relative bg-gray-50 p-2 flex items-center justify-center h-64">
//         <img
//           src={imageSrc}
//           alt={name}
//           className="h-full object-contain"
//         />
//         {bestseller && (
//           <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
//             Bestseller
//           </div>
//         )}
//         {outOfStock && (
//           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
//             Out of stock
//           </div>
//         )}
//         {applicableOffer && !outOfStock && (
//           <div className="absolute top-2 left-16 bg-green-500 text-white text-xs px-2 py-1 rounded">
//             {applicableOffer.discountPercent}% Off
//           </div>
//         )}
//       </div>
//       <div className="p-4">
//         <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
//         <div className="text-sm mt-1 flex items-center gap-2">
//           {applicableOffer && !outOfStock ? (
//             <>
//               <p className="text-gray-600 line-through">
//                 {currency}{price.toFixed(2)}
//               </p>
//               <p className="text-green-600 font-medium">
//                 {currency}{discountedPrice.toFixed(2)}
//               </p>
//             </>
//           ) : (
//             <p className="text-gray-600">
//               {currency}{price.toFixed(2)}
//             </p>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductItem;