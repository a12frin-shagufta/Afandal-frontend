import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { IoTrashBin } from "react-icons/io5";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Title from '../component/Title';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateCartItem,
    currency,
    delivery_fee,
    navigate,
    products
  } = useContext(ShopContext);

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Calculate totals using finalPrice from cartItems
  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find(p => p._id === item.id);
    const priceToUse = item.finalPrice || product?.finalPrice || product?.price || item.price || 0;
    return sum + (priceToUse * item.quantity);
  }, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem({ ...item, quantity: newQuantity });
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'AF2025') {
      setCouponApplied(true);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } else {
      alert('Invalid Coupon Code!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-black py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center w-full">
            <div className="w-full mr-4">
              <Title text1={"YOUR"} text2={"CART"}/>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-800 hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              <FiArrowLeft className="mr-2 text-black" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Success Notification */}
        {showSuccessPopup && (
          <div className="fixed top-6 right-6 z-50 animate-fade-in">
            <div className="bg-white p-4 rounded-lg shadow-xl border-l-4 border-orange-500 flex items-center">
              <FiCheckCircle className="text-orange-500 text-xl mr-3" />
              <div>
                <p className="font-medium text-gray-900">Discount Applied</p>
                <p className="text-sm text-gray-600">Enjoy 10% off your order</p>
              </div>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
              <button
                onClick={() => navigate("/")}
                className="bg-black hover:bg-gray-800 text-white py-3 px-8 rounded-md font-medium transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {cartItems.map((item, index) => {
                  const product = products.find(p => p._id === item.id);
                  const priceToShow = item.finalPrice || product?.finalPrice || product?.price || item.price || 0;
                  return (
                    <div key={`${item.id}-${item.size}`} className="p-5 border-b border-gray-100 last:border-0 flex flex-col sm:flex-row">
                      <div className="flex items-start mb-4 sm:mb-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/default-product-image.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                          <p className="font-medium mt-2 sm:hidden">
                            {item.finalPrice && item.finalPrice < item.price ? (
                              <>
                                <span className="line-through text-gray-500">{currency}{item.price}</span>
                                <span className="ml-2 text-orange-500">{currency}{(couponApplied ? priceToShow * 0.9 : priceToShow) * item.quantity}</span>
                              </>
                            ) : (
                              `${currency}${(couponApplied ? priceToShow * 0.9 : priceToShow) * item.quantity}`
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end sm:flex-1">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center ml-6">
                          <p className="font-medium hidden sm:block mr-6">
                            {item.finalPrice && item.finalPrice < item.price ? (
                              <>
                                <span className="line-through text-gray-500">{currency}{item.price}</span>
                                <span className="ml-2 text-orange-500">{currency}{(couponApplied ? priceToShow * 0.9 : priceToShow) * item.quantity}</span>
                              </>
                            ) : (
                              `${currency}${(couponApplied ? priceToShow * 0.9 : priceToShow) * item.quantity}`
                            )}
                          </p>
                          <button
                            onClick={() => removeFromCart(item)}
                            className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                          >
                            <IoTrashBin className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery</span>
                    <div className="flex items-center">
                      <span className="line-through text-gray-400 mr-2">{currency}{delivery_fee}</span>
                      <span className="text-green-600 font-medium">{currency}0.00</span>
                    </div>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-orange-500">
                      <span>Discount (10%)</span>
                      <span>-{currency}{discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold text-orange-500">{currency}{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Apply Coupon</h3>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-grow px-4 py-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponApplied}
                      className={`px-6 py-3 font-medium ${couponApplied ? 'bg-gray-200 text-gray-500' : 'bg-black text-white hover:bg-gray-800'} transition-colors rounded-r-lg`}
                    >
                      {couponApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/place-order")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition-colors shadow-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;