import React, { useContext, useState, useEffect } from 'react';
import Title from '../component/Title';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'India 🇮🇳',
    phone: ''
  });

  const {
    currency,
    delivery_fee,
    navigate,
    backendUrl,
    token,
    setToken,
    cartItems,
    setCartItems,
    products,
    couponApplied // From ShopContext
  } = useContext(ShopContext);

  useEffect(() => {
    if (!navigator.cookieEnabled) {
      toast.warn("Please enable cookies in your browser to use Razorpay payments.");
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('Razorpay SDK loaded');
    script.onerror = () => toast.error('Failed to load Razorpay SDK');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      let orderItems = cartItems.map(item => {
        const product = products.find(p => p._id === item.id);
        return {
          ...product,
          size: item.size,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          price: item.price,
          finalPrice: item.finalPrice || product?.finalPrice || item.price
        };
      });

      const finalSubtotal = couponApplied ? subtotal * 0.9 : subtotal; // Apply 10% coupon discount
      const orderData = {
        userId,
        address: formData,
        items: orderItems,
        amount: finalSubtotal,
        paymentMethod: method,
        couponApplied,
        estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() // Default: 4 days
      };

      if (method === 'cod') {
        const response = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.success("Order placed successfully");
          setCartItems([]);
          navigate('/order');
        } else {
          toast.error(response.data.message);
          if (response.data.message === "Invalid token") {
            setToken("");
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      } else if (method === 'razorpay') {
  const response = await axios.post(
    `${backendUrl}/api/order/razorpay`,
    orderData,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (response.data.success) {
    const { order, key_id } = response.data;

    const options = {
      key: key_id,
      amount: order.amount,
      currency: order.currency,
      name: 'Afandal Clothing',
      description: 'Order Payment',
      order_id: order.id,
      handler: async function (rzpResponse) {
        try {
          const verifyResponse = await axios.post(
            `${backendUrl}/api/order/verify`,
            {
              orderId: order.id,
              paymentId: rzpResponse.razorpay_payment_id,
              signature: rzpResponse.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyResponse.data.success) {
            toast.success("Payment successful, order placed");
            setCartItems([]);
            navigate('/order');
          } else {
            toast.error(verifyResponse.data.message);
          }
        } catch (err) {
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#000",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } else {
    toast.error("Failed to create Razorpay order");
  }
}
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
      if (error.response?.status === 401) {
        setToken("");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find(p => p._id === item.id);
    const priceToUse = item.finalPrice || product?.finalPrice || product?.price || item.price || 0;
    return sum + (priceToUse * item.quantity);
  }, 0);
  const total = couponApplied ? subtotal * 0.9 : subtotal; // Apply coupon discount

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-1 min-h-[80vh] border-t">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className="flex gap-3">
          <input 
            required 
            name="firstName" 
            value={formData.firstName} 
            onChange={onChangeHandler} 
            type="text" 
            placeholder="First name" 
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
          />
          <input 
            required 
            name="lastName" 
            value={formData.lastName} 
            onChange={onChangeHandler} 
            type="text" 
            placeholder="Last name" 
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
          />
        </div>
        <input 
          required 
          name="email" 
          value={formData.email} 
          onChange={onChangeHandler} 
          type="email" 
          placeholder="Email" 
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
        />
        <input 
          required 
          name="street" 
          value={formData.street} 
          onChange={onChangeHandler} 
          type="text" 
          placeholder="Street" 
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
        />
        <div className="flex gap-3">
          <input 
            required 
            name="city" 
            value={formData.city} 
            onChange={onChangeHandler} 
            type="text" 
            placeholder="City" 
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
          />
          <input 
            required 
            name="state" 
            value={formData.state} 
            onChange={onChangeHandler} 
            type="text" 
            placeholder="State" 
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
          />
        </div>
        <div className="flex gap-3">
          <input 
            required 
            name="zipcode" 
            value={formData.zipcode} 
            onChange={onChangeHandler} 
            type="number" 
            placeholder="Zipcode" 
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
          />
          <input 
            required 
            name="country" 
            value={formData.country}
            onChange={onChangeHandler} 
            type="text" 
            placeholder="Country" 
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
          />
        </div>
        <input 
          required 
          name="phone" 
          value={formData.phone} 
          onChange={onChangeHandler} 
          type="number" 
          placeholder="+91" 
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full" 
        />
      </div>
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <div className="border border-orange-500 p-6 rounded-lg bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center mb-4">
                <img
                  src={item.imageUrl || '/default-product-image.jpg'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                  onError={(e) => {
                    e.target.src = '/default-product-image.jpg';
                  }}
                />
                <div>
                  <p>{item.name} ({item.size})</p>
                  <p>
                    {item.finalPrice && item.finalPrice < item.price ? (
                      <>
                        <span className="line-through text-gray-500">{currency}{item.price}</span>
                        <span className="ml-2 text-orange-500">{currency}{item.finalPrice} x {item.quantity}</span>
                      </>
                    ) : (
                      `${currency}${item.price} x ${item.quantity}`
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between mb-2">
                <span>Coupon Discount (AF2025)</span>
                <span className="text-green-600">-{currency}{(subtotal * 0.1).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-2">
              <span>Delivery Fee</span>
              <div className="flex items-center">
                <span className="line-through text-gray-400 mr-2">{currency}{delivery_fee.toFixed(2)}</span>
                <span className="text-green-600 font-medium">{currency}0.00</span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className="flex gap-3 flex-col lg:flex-row mt-2">
            <div 
              onClick={() => setMethod('razorpay')} 
              className={`flex items-center gap-3 p-2 px-3 cursor-pointer border ${
                method === 'razorpay' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <div className={`w-3.5 h-3.5 border rounded-full ${
                method === 'razorpay' ? 'bg-green-400 border-green-400' : 'border-gray-300'
              }`}></div>
              <img 
                src="https://episyche.com/_next/image?url=https%3A%2F%2Fepisyche-blog.s3.ap-south-1.amazonaws.com%2FDjango%2FPayments%2FRazorpay%2FSubscription%2F11%2Fthumbnail_image%2Fe3d32020-0cd6-4bf4-b610-e202be5bf270.png&w=1200&q=75" 
                alt="Razorpay" 
                className="mx-4 h-5" 
              />
            </div>
            <div 
              onClick={() => setMethod('cod')} 
              className={`flex items-center gap-3 p-2 px-3 cursor-pointer border ${
                method === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <div className={`w-3.5 h-3.5 border rounded-full ${
                method === 'cod' ? 'bg-green-400 border-green-400' : 'border-gray-300'
              }`}></div>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button 
              type="submit" 
              className="bg-gray-700 hover:bg-gray-800 text-white px-16 py-3 text-sm transition-colors disabled:opacity-50"
              disabled={!token || cartItems.length === 0}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

// import React, { useContext, useState } from 'react';
// import Title from '../component/Title';
// import { ShopContext } from '../context/ShopContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';

// const PlaceOrder = () => {
//   const [method, setMethod] = useState('cod');
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     street: '',
//     city: '',
//     state: '',
//     zipcode: '',
//     country: '',
//     phone: ''
//   });

//   const {
//     currency,
//     delivery_fee,
//     navigate,
//     backendUrl,
//     token,
//     setToken,
//     cartItems,
//     setCartItems,
//     getTotalCartAmount,
//     products
//   } = useContext(ShopContext);

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     if (!token) {
//       toast.error("Please log in to place an order");
//       navigate("/login");
//       return;
//     }

//     try {
//       // Decode token to get userId
//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken.id;

//       let orderItems = cartItems.map(item => ({
//         ...products.find(product => product._id === item.id),
//         size: item.size,
//         quantity: item.quantity,
//         imageUrl: item.imageUrl
//       }));

//       console.log("Order Items:", orderItems);

//       const orderData = {
//         userId,
//         address: formData,
//         items: orderItems,
//         amount: getTotalCartAmount() + delivery_fee,
//         paymentMethod: method
//       };

//       const response = await axios.post(
//         `${backendUrl}/api/order/place`,
//         orderData,
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success("Order placed successfully");
//         if (typeof setCartItems === 'function') {
//           setCartItems([]); // Should now work
//         } else {
//           console.warn("setCartItems is not a function. Cart not cleared in frontend.", {
//             contextValue: Object.keys(useContext(ShopContext))
//           });
//         }
//         navigate('/order');
//       } else {
//         toast.error(response.data.message);
//         if (response.data.message === "Invalid token") {
//           setToken("");
//           localStorage.removeItem("token");
//           navigate("/login");
//         }
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast.error(error.response?.data?.message || "Failed to place order");
//       if (error.response?.status === 401) {
//         setToken("");
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     }
//   };

//   const subtotal = cartItems.reduce((sum, item) => {
//     const product = products.find(p => p._id === item.id);
//     return sum + ((product?.price || item.price || 0) * item.quantity);
//   }, 0);
//   const total = subtotal + delivery_fee;

//   return (
//     <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-1 min-h-[80vh] border-t">
//       {/* --------- Left Side -------- */}
//       <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
//         <div className="text-xl sm:text-2xl my-3">
//           <Title text1={'DELIVERY'} text2={'INFORMATION'} />
//         </div>
//         <div className="flex gap-3">
//           <input
//             required
//             onChange={onChangeHandler}
//             name="firstName"
//             value={formData.firstName}
//             type="text"
//             placeholder="First name"
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//           />
//           <input
//             required
//             onChange={onChangeHandler}
//             name="lastName"
//             value={formData.lastName}
//             type="text"
//             placeholder="Last name"
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//           />
//         </div>
//         <input
//           required
//           onChange={onChangeHandler}
//           name="email"
//           value={formData.email}
//           type="email"
//           placeholder="Email address"
//           className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//         />
//         <input
//           required
//           onChange={onChangeHandler}
//           name="street"
//           value={formData.street}
//           type="text"
//           placeholder="Street"
//           className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//         />
//         <div className="flex gap-3">
//           <input
//             required
//             onChange={onChangeHandler}
//             name="city"
//             value={formData.city}
//             type="text"
//             placeholder="City"
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//           />
//           <input
//             required
//             onChange={onChangeHandler}
//             name="state"
//             value={formData.state}
//             type="text"
//             placeholder="State"
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//           />
//         </div>
//         <div className="flex gap-3">
//           <input
//             required
//             onChange={onChangeHandler}
//             name="zipcode"
//             value={formData.zipcode}
//             type="number"
//             placeholder="Zipcode"
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//           />
//           <input
//             required
//             onChange={onChangeHandler}
//             name="country"
//             value={formData.country}
//             type="text"
//             placeholder="Country"
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//           />
//         </div>
//         <input
//           required
//           onChange={onChangeHandler}
//           name="phone"
//           value={formData.phone}
//           type="number"
//           placeholder="Phone"
//           className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//         />
//       </div>

//       {/* ---------- Right Side ---------- */}
//       <div className="mt-8">
//         <div className="mt-8 min-w-80">
//           <div className="border border-orange-500 p-6 rounded-lg bg-gray-50">
//             <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
//             {cartItems.map((item, index) => (
//               <div key={index} className="flex items-center mb-4">
//                 <img
//                   src={item.imageUrl || '/default-product-image.jpg'}
//                   alt={item.name}
//                   className="w-16 h-16 object-cover rounded mr-4"
//                   onError={(e) => {
//                     console.log(`Image failed to load for ${item.name}: ${item.imageUrl}`);
//                     e.target.src = '/default-product-image.jpg';
//                   }}
//                 />
//                 <div>
//                   <p>{item.name} ({item.size})</p>
//                   <p>{currency}{item.price} x {item.quantity}</p>
//                 </div>
//               </div>
//             ))}
//             <div className="flex justify-between mb-2">
//               <span>Subtotal</span>
//               <span>{currency}{subtotal}.00</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span>Delivery Fee</span>
//               <span>{currency}{delivery_fee}.00</span>
//             </div>
//             <hr className="my-4" />
//             <div className="flex justify-between font-bold text-lg">
//               <span>Total</span>
//               <span>{currency}{total}</span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-12">
//           <Title text1={'PAYMENT'} text2={'METHOD'} />
//           <div className="flex gap-3 flex-col lg:flex-row mt-2">
//             <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 p-2 px-3 cursor-pointer border">
//               <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400 border-green-400' : ''}`}></p>
//               <img
//                 src="https://episyche.com/_next/image?url=https%3A%2F%2Fepisyche-blog.s3.ap-south-1.amazonaws.com%2FDjango%2FPayments%2FRazorpay%2FSubscription%2F11%2Fthumbnail_image%2Fe3d32020-0cd6-4bf4-b610-e202be5bf270.png&w=1200&q=75"
//                 alt="Razorpay"
//                 className="mx-4 h-5"
//               />
//             </div>
//             <div onClick={() => setMethod('cod')} className="flex items-center gap-3 p-2 px-3 cursor-pointer border">
//               <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400 border-green-400' : ''}`}></p>
//               <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
//             </div>
//           </div>
//           <div className="w-full text-end mt-8">
//             <button type="submit" className="bg-gray-700 text-white px-16 py-3 text-sm">PLACE ORDER</button>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;