// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';

// export const ShopContext = createContext();

// const ShopContextProvider = (props) => {
//   const currency = "₹";
//   const delivery_fee = 150;
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [search, setSearch] = useState('');
//   const [showSearch, setShowSearch] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const navigate = useNavigate();

//   // Fetch products from backend
//   const getProductsData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${backendUrl}/api/product/list`);
     
//       if (response.data.success) {
//         setProducts(response.data.product);
//       } else {
//         toast.error(response.data.message);
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       toast.error("Failed to fetch products");
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch user cart from backend
//   const fetchUserCart = async () => {
//     if (!token) return;

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/cart/get`,
//         {},
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         const fetchedCart = response.data.cardData; // Note: 'cardData' might be a typo
//         const cartItemsWithDetails = [];

//         for (const itemId in fetchedCart) {
//           const product = products.find(p => p._id === itemId);
//           if (product) {
//             for (const size in fetchedCart[itemId]) {
//               cartItemsWithDetails.push({
//                 id: itemId,
//                 name: product.name,
//                 price: product.price,
//                 imageUrl: product.image[0],
//                 size,
//                 quantity: fetchedCart[itemId][size]
//               });
//             }
//           }
//         }

//         setCartItems(cartItemsWithDetails);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       toast.error("Failed to fetch cart");
//     }
//   };

//   // Add to Cart
//   const addToCart = async (item) => {
//     const product = products.find(p => p._id === item.id);

//     if (!product) {
//       toast.error('Product not found');
//       return;
//     }

//     if (product.stock <= 0) {
//       toast.error('This product is out of stock');
//       return;
//     }

//     const existingCartItem = cartItems.find(
//       cartItem => cartItem.id === item.id && cartItem.size === item.size
//     );

//     const totalRequested = (existingCartItem?.quantity || 0) + item.quantity;
//     if (totalRequested > product.stock) {
//       toast.error(`Only ${product.stock} units available`);
//       return;
//     }

//     if (!token) {
//       toast.error("Please log in to add items to cart");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/cart/add`,
//         {
//           itemId: item.id,
//           size: item.size,
//           quantity: item.quantity
//         },
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success("Added to cart");
//         setCartItems(prevItems => {
//           const existingItemIndex = prevItems.findIndex(
//             cartItem => cartItem.id === item.id && cartItem.size === item.size
//           );

//           if (existingItemIndex >= 0) {
//             const updatedItems = [...prevItems];
//             updatedItems[existingItemIndex].quantity += item.quantity;
//             return updatedItems;
//           } else {
//             return [...prevItems, {
//               id: item.id,
//               name: product.name,
//               price: product.price,
//               imageUrl: product.image[0], // Fixed: Use product.image[0]
//               size: item.size,
//               quantity: item.quantity
//             }];
//           }
//         });

//         setProducts(prevProducts =>
//           prevProducts.map(p =>
//             p._id === item.id ? { ...p, stock: response.data.updatedStock } : p
//           )
//         );
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error("Failed to add to cart");
//     }
//   };

//   // Update cart item quantity
//   const updateCartItem = async (updatedItem) => {
//     const product = products.find(p => p._id === updatedItem.id);
//     if (!product) {
//       toast.error("Product not found");
//       return;
//     }

//     const currentCartItem = cartItems.find(
//       item => item.id === updatedItem.id && item.size === updatedItem.size
//     );
//     if (!currentCartItem) {
//       toast.error("Cart item not found");
//       return;
//     }

//     const quantityDifference = updatedItem.quantity - currentCartItem.quantity;
//     if (quantityDifference > 0 && product.stock < quantityDifference) {
//       toast.error(`Only ${product.stock + currentCartItem.quantity} units available`);
//       return;
//     }

//     if (!token) {
//       toast.error("Please log in to update cart");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/cart/update`,
//         {
//           itemId: updatedItem.id,
//           size: updatedItem.size,
//           quantity: updatedItem.quantity
//         },
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success("Cart updated successfully");
//         setCartItems(prevItems =>
//           prevItems.map(item =>
//             item.id === updatedItem.id && item.size === updatedItem.size
//               ? { ...item, quantity: updatedItem.quantity }
//               : item
//           )
//         );
//         setProducts(prevProducts =>
//           prevProducts.map(p =>
//             p._id === updatedItem.id
//               ? { ...p, stock: response.data.updatedStock }
//               : p
//           )
//         );
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error updating cart:", error);
//       toast.error("Failed to update cart");
//     }
//   };

//   // Remove from cart
//   const removeFromCart = async (itemToRemove) => {
//     if (!token) {
//       toast.error("Please log in to remove items");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/cart/update`,
//         {
//           itemId: itemToRemove.id,
//           size: itemToRemove.size,
//           quantity: 0
//         },
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success("Item removed from cart");
//         setCartItems(prev =>
//           prev.filter(
//             ci => !(ci.id === itemToRemove.id && ci.size === itemToRemove.size)
//           )
//         );
//         setProducts(prevProducts =>
//           prevProducts.map(p =>
//             p._id === itemToRemove.id
//               ? { ...p, stock: response.data.updatedStock }
//               : p
//           )
//         );
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error removing item:", error);
//       toast.error("Failed to remove item");
//     }
//   };

//   // Get total cart count
//   const getCartCount = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   // Get total cart amount
//   const getTotalCartAmount = () => {
//     return cartItems.reduce((total, item) => {
//       const product = products.find(p => p._id === item.id);
//       return total + (product?.price || 0) * item.quantity;
//     }, 0);
//   };

//   // Check if product is in stock
//   const isInStock = (productId, quantityNeeded = 1) => {
//     const productItem = products.find(p => p._id === productId);
//     return productItem ? productItem.stock >= quantityNeeded : false;
//   };

//   // useEffect for fetching products and cart
//   useEffect(() => {
//     getProductsData();
//   }, []);
  
//   useEffect(() => {
//     if (token && products.length > 0) {
//       fetchUserCart();
//     }
//   }, [token, products]);

//   const value = {
//     products,
//     setProducts,
//     isLoading,
//     error,
//     currency,
//     delivery_fee,
//     search,
//     setSearch,
//     showSearch,
//     setShowSearch,
//     cartItems,
//     setCartItems, // Added here
//     addToCart,
//     updateCartItem,
//     removeFromCart,
//     getCartCount,
//     getTotalCartAmount,
//     navigate,
//     isInStock,
//     backendUrl,
//     token,
//     setToken
//   };

//   return (
//     <ShopContext.Provider value={value}>
//       {props.children}
//     </ShopContext.Provider>
//   );
// };

// export default ShopContextProvider;


import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 150;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Fetch products from backend
  const getProductsData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.product);
      } else {
        toast.error(response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch products");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active offers from backend
  const getOffersData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/offer/active`);
      if (response.data.success) {
        setOffers(response.data.offers || []);
      } else {
        toast.error(response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch offers");
      setError(error.message);
    }
  };

  // Fetch user cart from backend
  const fetchUserCart = async () => {
  if (!token) return;

  try {
    const response = await axios.post(
      `${backendUrl}/api/cart/get`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      const fetchedCart = response.data.cardData;
      const cartItemsWithDetails = [];

      for (const itemId in fetchedCart) {
        const product = products.find(p => p._id === itemId);
        if (product) {
          // Find applicable offer
          const activeOffer = offers.find(
            offer =>
              (offer.applyToAllProducts || offer.applicableProducts.some(p => p._id === itemId)) &&
              new Date(offer.validTill) > new Date()
          );
          const discountPercentage = activeOffer?.discountPercent || 0;
          const originalPrice = product.price;
          const finalPrice = discountPercentage > 0 
            ? Math.round(originalPrice * (1 - discountPercentage / 100)) 
            : originalPrice;

          for (const size in fetchedCart[itemId]) {
            cartItemsWithDetails.push({
              id: itemId,
              name: product.name,
              price: originalPrice,
              finalPrice: finalPrice,
              imageUrl: product.image[0],
              size,
              quantity: fetchedCart[itemId][size],
            });
          }
        }
      }

      setCartItems(cartItemsWithDetails);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    toast.error("Failed to fetch cart");
  }
};

  // Add to Cart
  const addToCart = async (item) => {
    const product = products.find(p => p._id === item.id);

    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (product.stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    const existingCartItem = cartItems.find(
      cartItem => cartItem.id === item.id && cartItem.size === item.size
    );

    const totalRequested = (existingCartItem?.quantity || 0) + item.quantity;
    if (totalRequested > product.stock) {
      toast.error(`Only ${product.stock} units available`);
      return;
    }

    if (!token) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        {
          itemId: item.id,
          size: item.size,
          quantity: item.quantity
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Added to cart");
        setCartItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(
            cartItem => cartItem.id === item.id && cartItem.size === item.size
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return updatedItems;
          } else {
            return [...prevItems, {
              id: item.id,
              name: product.name,
              price: product.price,
              imageUrl: product.image[0],
              size: item.size,
              quantity: item.quantity
            }];
          }
        });

        setProducts(prevProducts =>
          prevProducts.map(p =>
            p._id === item.id ? { ...p, stock: response.data.updatedStock } : p
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  // Update cart item quantity
  const updateCartItem = async (updatedItem) => {
    const product = products.find(p => p._id === updatedItem.id);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    const currentCartItem = cartItems.find(
      item => item.id === updatedItem.id && item.size === updatedItem.size
    );
    if (!currentCartItem) {
      toast.error("Cart item not found");
      return;
    }

    const quantityDifference = updatedItem.quantity - currentCartItem.quantity;
    if (quantityDifference > 0 && product.stock < quantityDifference) {
      toast.error(`Only ${product.stock + currentCartItem.quantity} units available`);
      return;
    }

    if (!token) {
      toast.error("Please log in to update cart");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/update`,
        {
          itemId: updatedItem.id,
          size: updatedItem.size,
          quantity: updatedItem.quantity
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Cart updated successfully");
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === updatedItem.id && item.size === updatedItem.size
              ? { ...item, quantity: updatedItem.quantity }
              : item
          )
        );
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p._id === updatedItem.id
              ? { ...p, stock: response.data.updatedStock }
              : p
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  // Remove from cart
  const removeFromCart = async (itemToRemove) => {
    if (!token) {
      toast.error("Please log in to remove items");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/update`,
        {
          itemId: itemToRemove.id,
          size: itemToRemove.size,
          quantity: 0
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Item removed from cart");
        setCartItems(prev =>
          prev.filter(
            ci => !(ci.id === itemToRemove.id && ci.size === itemToRemove.size)
          )
        );
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p._id === itemToRemove.id
              ? { ...p, stock: response.data.updatedStock }
              : p
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  // Get total cart count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p._id === item.id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  // Check if product is in stock
  const isInStock = (productId, quantityNeeded = 1) => {
    const productItem = products.find(p => p._id === productId);
    return productItem ? productItem.stock >= quantityNeeded : false;
  };

  // useEffect for fetching products and offers
  useEffect(() => {
    getProductsData();
    getOffersData();
  }, []);

  // useEffect for fetching cart
  useEffect(() => {
    if (token && products.length > 0) {
      fetchUserCart();
    }
  }, [token, products]);

  const value = {
    products,
    setProducts,
    offers,
    isLoading,
    error,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getTotalCartAmount,
    navigate,
    isInStock,
    backendUrl,
    token,
    setToken
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
