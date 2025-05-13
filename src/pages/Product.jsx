import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, isInStock, offers } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [stockError, setStockError] = useState(false);

  useEffect(() => {
    if (products && products.length > 0 && productId) {
      const foundProduct = products.find(item => 
        (item._id?.toString() === productId || item.id?.toString() === productId)
      );

      if (foundProduct) {
        setProductData(foundProduct);
        const firstImage = Array.isArray(foundProduct.image) 
          ? foundProduct.image[0] 
          : foundProduct.image;
        setSelectedImage(firstImage || '/placeholder.jpg');
        
        if (foundProduct.sizes?.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
      }
    }
  }, [productId, products]);

  console.log('Products:', products);

  if (!productId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Product ID is missing in URL</div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">
          {products ? 'Product not found' : 'Loading products...'}
        </div>
      </div>
    );
  }

  // Find an active offer for this product
  const applicableOffer = offers.find((offer) =>
    (offer.applyToAllProducts ?? false) || 
    offer.applicableProducts.some((product) => product._id?.toString() === productData._id?.toString())
  );

  // Calculate discounted price if an offer applies
  const discountedPrice = applicableOffer
    ? productData.price * (1 - applicableOffer.discountPercent / 100)
    : productData.price;

  // Debug log to verify offer data
  console.log(`Product ${productId}:`, {
    applicableOffer,
    discountPercent: applicableOffer?.discountPercent,
    discountedPrice,
    applyToAllProducts: applicableOffer?.applyToAllProducts ?? 'missing',
    offerProductIds: applicableOffer?.applicableProducts?.map(p => p._id),
  });

  const handleAddToCart = () => {
    if (!productData) return;

    if (productData.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }

    if (!isInStock(productData._id || productData.id, quantity)) {
      setStockError(true);
      return;
    }

    // Create cart item with the correct structure
    const cartItem = {
      id: productData._id || productData.id,
      name: productData.name,
      price: discountedPrice, // Use discounted price
      imageUrl: selectedImage,
      size: selectedSize || 'One Size',
      quantity: quantity,
    };

    addToCart(cartItem);
    setStockError(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-4 mb-4 h-96 relative">
            <img
              src={selectedImage}
              alt={productData.name}
              className="max-w-full max-h-full object-contain rounded-lg border-2 border-orange-500"
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
            {applicableOffer && productData.stock > 0 && (
              <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
                {applicableOffer.discountPercent}% Off
              </div>
            )}
          </div>

          {productData.image?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {(Array.isArray(productData.image) ? productData.image : [productData.image]).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-md overflow-hidden border-2 aspect-square flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 transition-all ${
                    selectedImage === img
                      ? 'border-orange-500 scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productData.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{productData.name}</h1>

          {/* Price and Stock Status */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              {applicableOffer && productData.stock > 0 ? (
                <>
                  <p className="text-2xl font-medium text-gray-600 line-through">
                    {currency}{productData.price.toFixed(2)}
                  </p>
                  <p className="text-2xl font-medium text-green-600">
                    {currency}{discountedPrice.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-medium text-gray-900">
                  {currency}{productData.price.toFixed(2)}
                </p>
              )}
            </div>
            {productData.stock <= 0 && (
              <div className="text-sm px-2 py-1 rounded text-red-800 bg-red-100">
                Out of stock
              </div>
            )}
          </div>

          {productData.description && (
            <p className="text-gray-600">{productData.description}</p>
          )}

          {/* Size Selection */}
          {productData.sizes?.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">SELECT SIZE</h3>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      selectedSize === size
                        ? 'bg-orange-500 text-white'
                        : 'border-gray-300 hover:border-orange-500'
                    }`}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-red-500 text-sm mt-1">Please select a size</p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 pt-2">
            <h3 className="text-sm font-medium text-gray-700">QUANTITY</h3>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
              <button
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= (productData.stock || 0)}
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Error */}
          {stockError && (
            <p className="text-red-500 text-sm">Not enough stock available</p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={productData.stock <= 0}
            className={`w-full py-3 rounded-md transition-colors mt-4 ${
              productData.stock > 0
                ? 'bg-gray-700 text-white hover:bg-orange-400'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {productData.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>

          {/* Product Details */}
          {productData.details && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">PRODUCT DETAILS</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {productData.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
// import React, { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency, addToCart, isInStock, offers } = useContext(ShopContext);
//   const [productData, setProductData] = useState(null);
//   const [selectedImage, setSelectedImage] = useState('');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [sizeError, setSizeError] = useState(false);
//   const [stockError, setStockError] = useState(false);

//   useEffect(() => {
//     if (products && products.length > 0 && productId) {
//       const foundProduct = products.find(item => 
//         (item._id?.toString() === productId || item.id?.toString() === productId)
//       );

//       if (foundProduct) {
//         setProductData(foundProduct);
//         const firstImage = Array.isArray(foundProduct.image) 
//           ? foundProduct.image[0] 
//           : foundProduct.image;
//         setSelectedImage(firstImage || '/placeholder.jpg');
        
//         if (foundProduct.sizes?.length > 0) {
//           setSelectedSize(foundProduct.sizes[0]);
//         }
//       }
//     }
//   }, [productId, products]);

//   if (!productId) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-lg text-red-500">Product ID is missing in URL</div>
//       </div>
//     );
//   }

//   if (!productData) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-lg text-gray-600">
//           {products ? 'Product not found' : 'Loading products...'}
//         </div>
//       </div>
//     );
//   }

//   // Find an active offer for this product
//   const applicableOffer = offers.find((offer) =>
//     offer.applicableProducts.some((product) => product._id === productData._id)
//   );

//   // Calculate discounted price if an offer applies
//   const discountedPrice = applicableOffer
//     ? productData.price * (1 - applicableOffer.discountPercent / 100)
//     : productData.price;

//   const handleAddToCart = () => {
//     if (!productData) return;

//     if (productData.sizes?.length > 0 && !selectedSize) {
//       setSizeError(true);
//       return;
//     }

//     if (!isInStock(productData._id || productData.id, quantity)) {
//       setStockError(true);
//       return;
//     }

//     // Create cart item with the correct structure
//     const cartItem = {
//       id: productData._id || productData.id,
//       name: productData.name,
//       price: discountedPrice, // Use discounted price
//       imageUrl: selectedImage,
//       size: selectedSize || 'One Size',
//       quantity: quantity,
//     };

//     addToCart(cartItem);
//     setStockError(false);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//       <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
//         {/* Image Gallery */}
//         <div className="lg:w-1/2">
//           <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-4 mb-4 h-96 relative">
//             <img
//               src={selectedImage}
//               alt={productData.name}
//               className="max-w-full max-h-full object-contain rounded-lg border-2 border-orange-500"
//               onError={(e) => {
//                 e.target.src = '/placeholder.jpg';
//               }}
//             />
//             {applicableOffer && productData.stock > 0 && (
//               <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
//                 {applicableOffer.discountPercent}% Off
//               </div>
//             )}
//           </div>

//           {productData.image?.length > 1 && (
//             <div className="flex gap-2 overflow-x-auto py-2">
//               {(Array.isArray(productData.image) ? productData.image : [productData.image]).map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(img)}
//                   className={`rounded-md overflow-hidden border-2 aspect-square flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 transition-all ${
//                     selectedImage === img
//                       ? 'border-orange-500 scale-105'
//                       : 'border-transparent hover:border-gray-300'
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`${productData.name} thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = '/placeholder.jpg';
//                     }}
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Product Details */}
//         <div className="lg:w-1/2 space-y-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{productData.name}</h1>

//           {/* Price and Stock Status */}
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               {applicableOffer && productData.stock > 0 ? (
//                 <>
//                   <p className="text-2xl font-medium text-gray-600 line-through">
//                     {currency}{productData.price.toFixed(2)}
//                   </p>
//                   <p className="text-2xl font-medium text-green-600">
//                     {currency}{discountedPrice.toFixed(2)}
//                   </p>
//                 </>
//               ) : (
//                 <p className="text-2xl font-medium text-gray-900">
//                   {currency}{productData.price.toFixed(2)}
//                 </p>
//               )}
//             </div>
//             {productData.stock <= 0 && (
//               <div className="text-sm px-2 py-1 rounded text-red-800 bg-red-100">
//                 Out of stock
//               </div>
//             )}
//           </div>

//           {productData.description && (
//             <p className="text-gray-600">{productData.description}</p>
//           )}

//           {/* Size Selection */}
//           {productData.sizes?.length > 0 && (
//             <div className="pt-2">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">SELECT SIZE</h3>
//               <div className="flex flex-wrap gap-2">
//                 {productData.sizes.map((size, index) => (
//                   <button
//                     key={index}
//                     className={`px-4 py-2 border rounded-md text-sm ${
//                       selectedSize === size
//                         ? 'bg-orange-500 text-white'
//                         : 'border-gray-300 hover:border-orange-500'
//                     }`}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       setSizeError(false);
//                     }}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//               {sizeError && (
//                 <p className="text-red-500 text-sm mt-1">Please select a size</p>
//               )}
//             </div>
//           )}

//           {/* Quantity Selector */}
//           <div className="flex items-center space-x-4 pt-2">
//             <h3 className="text-sm font-medium text-gray-700">QUANTITY</h3>
//             <div className="flex items-center border border-gray-300 rounded-md">
//               <button
//                 className="px-3 py-1 text-gray-600 hover:bg-gray-100"
//                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 disabled={quantity <= 1}
//               >
//                 -
//               </button>
//               <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
//               <button
//                 className="px-3 py-1 text-gray-600 hover:bg-gray-100"
//                 onClick={() => setQuantity(quantity + 1)}
//                 disabled={quantity >= (productData.stock || 0)}
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Stock Error */}
//           {stockError && (
//             <p className="text-red-500 text-sm">Not enough stock available</p>
//           )}

//           {/* Add to Cart Button */}
//           <button
//             onClick={handleAddToCart}
//             disabled={productData.stock <= 0}
//             className={`w-full py-3 rounded-md transition-colors mt-4 ${
//               productData.stock > 0
//                 ? 'bg-gray-700 text-white hover:bg-orange-400'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             {productData.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
//           </button>

//           {/* Product Details */}
//           {productData.details && (
//             <div className="pt-4 border-t border-gray-100">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">PRODUCT DETAILS</h3>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 {productData.details.map((detail, index) => (
//                   <li key={index}>• {detail}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Product;