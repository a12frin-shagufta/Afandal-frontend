import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../component/Title';
import { FiTruck, FiClock, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Order = () => {
  const { backendUrl, token, currency, delivery_fee } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Status mapping: backend -> frontend
  const statusMap = {
    pending: 'Order Placed',
    packing: 'Packing',
    'out for delivery': 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  // Status colors
  const statusColors = {
    'Order Placed': 'bg-yellow-500',
    Packing: 'bg-orange-500',
    'Out for Delivery': 'bg-blue-500',
    Delivered: 'bg-green-500',
    Cancelled: 'bg-red-500'
  };

  // Status order for stepper
  const statusOrder = [
    'Order Placed',
    'Packing',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  const loadOrderData = async () => {
    try {
      if (!token) {
        console.log("No token found, skipping order fetch");
        setOrderData([]);
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        let allOrdersItem = [];
        if (response.data.orders && Array.isArray(response.data.orders)) {
          response.data.orders.forEach((order) => {
            order.items.forEach((item) => {
              allOrdersItem.push({
                ...item,
                status: statusMap[order.status.toLowerCase()] || 'Order Placed',
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date,
                orderId: order._id,
                couponApplied: order.couponApplied || false // Coupon flag
              });
            });
          });
          setOrderData(allOrdersItem.reverse());
        } else {
          console.warn("No orders found in response:", response.data);
          setOrderData([]);
        }
      } else {
        console.error("API Error:", response.data.message);
        toast.error(response.data.message);
        setOrderData([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      setOrderData([]);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Handle Track Order click
  const handleTrackOrder = async (item) => {
    try {
      if (!token) {
        toast.error("Please log in to track order");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.orders) {
        const order = response.data.orders.find((o) => o._id === item.orderId);
        if (order) {
          const updatedItem = {
            ...item,
            status: statusMap[order.status.toLowerCase()] || 'Order Placed',
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            orderId: order._id,
            couponApplied: order.couponApplied || false
          };
          setTrackingOrder(updatedItem);
        } else {
          console.warn("Order not found:", item.orderId);
          toast.error("Order not found");
          setTrackingOrder(item);
        }
      } else {
        console.error("API Error:", response.data.message);
        toast.error(response.data.message || "Failed to fetch order");
        setTrackingOrder(item);
      }
    } catch (error) {
      console.error("Error fetching order:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch order");
      setTrackingOrder(item);
    }
  };

  // Close tracking modal
  const closeTrackingModal = () => {
    setTrackingOrder(null);
  };

  // Handle Refresh Orders
  const handleRefreshOrders = async () => {
    await loadOrderData();
    toast.success("Orders refreshed");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-7xl">
      <div className="mb-12 flex justify-between items-center">
        <Title text1={'MY'} text2={'ORDERS'} />
        <button
          onClick={handleRefreshOrders}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <FiRefreshCw />
          Refresh Orders
        </button>
      </div>

      {orderData.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orderData.map((item, index) => {
            const priceToShow = item.couponApplied ? (item.finalPrice || item.price) * 0.9 : (item.finalPrice || item.price);
            const subtotal = priceToShow * item.quantity;
            return (
              <div
                key={`order-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Product Image and Details */}
                  <div className="flex flex-1 gap-6">
                    <img
                      src={item.imageUrl || '/default-product-image.jpg'}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border border-gray-100"
                      onError={(e) => (e.target.src = '/default-product-image.jpg')}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-700">
                        <p className="text-lg font-semibold text-gray-800">
                          {item.finalPrice && item.finalPrice < item.price ? (
                            <>
                              <span className="line-through text-gray-500">{currency}{item.price}</span>
                              <span className="ml-2 text-orange-500">{currency}{priceToShow.toFixed(2)}</span>
                            </>
                          ) : (
                            `${currency}${priceToShow.toFixed(2)}`
                          )}
                        </p>
                        <span className="text-gray-400 hidden sm:inline">|</span>
                        <p>Quantity: {item.quantity}</p>
                        <span className="text-gray-400 hidden sm:inline">|</span>
                        <p>Size: {item.size}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <FiClock className="text-gray-400" />
                        <span>Ordered on </span>
                        <span className="font-medium">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span>Payment: {item.paymentMethod}</span>
                        {item.couponApplied && (
                          <span className="text-orange-500">Coupon Applied (10% off)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Status and Actions */}
                  <div className="md:w-64 flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-3 h-3 rounded-full ${statusColors[item.status]} animate-pulse`}
                        ></div>
                        <div
                          className={`w-3 h-3 rounded-full ${statusColors[item.status]} absolute top-0 opacity-75 animate-ping`}
                        ></div>
                      </div>
                      <p className="text-sm md:text-base font-medium text-gray-700">{item.status}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleTrackOrder(item)}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <FiTruck />
                        Track Order
                      </button>
                     
                    </div>
                  </div>
                </div>

                {/* Delivery Progress */}
                <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 text-sm text-gray-500">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                      <FiTruck className="text-gray-400" />
                      <span>
                        Estimated delivery:{' '}
                        <span className="font-medium">
                          {new Date(new Date(item.date).setDate(new Date(item.date).getDate() + 8)).toLocaleDateString(
                            'en-US',
                            { day: 'numeric', month: 'long', year: 'numeric' }
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Subtotal: {currency}{subtotal.toFixed(2)}</span>
                      <span>|</span>
                      <span>
                        Delivery Fee:{' '}
                        <span className="line-through text-gray-400">{currency}{delivery_fee.toFixed(2)}</span>
                        <span className="text-green-600 font-medium"> {currency}0.00</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Track Order: {trackingOrder.name}</h3>
            <div className="relative">
              {/* Stepper */}
              <div className="flex justify-between items-center mb-4">
                {statusOrder.map((status, index) => {
                  const isCancelled = trackingOrder.status === 'Cancelled';
                  const currentStatusIndex = statusOrder.indexOf(trackingOrder.status);
                  const isActive = isCancelled
                    ? status === 'Cancelled'
                    : index <= currentStatusIndex && status !== 'Cancelled';
                  const isCompleted = isCancelled
                    ? status === 'Cancelled'
                    : index < currentStatusIndex && status !== 'Cancelled';

                  return (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                          isActive ? statusColors[status] : 'bg-gray-300'
                        } ${isCompleted ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
                      >
                        {isCompleted ? '✔' : index + 1}
                      </div>
                      <p className={`text-xs mt-2 text-center ${isActive ? 'font-medium' : 'text-gray-500'}`}>
                        {status}
                      </p>
                      {/* Connector Line */}
                      {index < statusOrder.length - 1 && (
                        <div
                          className={`absolute top-3 h-1 ${
                            isCompleted || (isActive && index === currentStatusIndex)
                              ? statusColors[status]
                              : 'bg-gray-300'
                          }`}
                          style={{
                            left: `${(index * 100) / (statusOrder.length - 1) + 10}%`,
                            width: `${100 / (statusOrder.length - 1) - 20}%`
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeTrackingModal}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 text-center">
        <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default Order;