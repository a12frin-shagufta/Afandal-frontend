import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!otpSent) {
        // Send OTP
        const response = await axios.post(`${backendUrl}/api/user/send-otp`, { email });

        if (response.data.success) {
          setOtpSent(true);
          toast.success('OTP sent to your email!');
        } else {
          toast.error(response.data.message || 'Failed to send OTP');
        }
      } else {
        // Verify OTP
        const response = await axios.post(`${backendUrl}/api/user/verify-otp`, { email, otp });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Login successful! Redirecting...');
          navigate('/');
        } else {
          toast.error(response.data.message || 'Invalid OTP');
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden p-8 transition-all duration-300 hover:shadow-lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <p
              style={{ fontFamily: 'var(--font-pacifico)' }}
              className="text-3xl text-gray-800 font-medium"
            >
              OTP Login
            </p>
            <hr className="border-none h-[3px] w-12 bg-orange-500 rounded-full" />
          </div>
          <h3 className="text-2xl font-serif font-light">
            <span className="text-orange-500 font-medium">AFANDAL |</span> Elevate Your Style
          </h3>
        </div>

        <div className="space-y-5">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            placeholder="Enter your email"
          />

          {otpSent && (
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              type="text"
              required
              className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder="Enter OTP"
            />
          )}

          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 mt-6"
            disabled={isLoading}
          >
            {isLoading
              ? 'Please wait...'
              : otpSent
              ? 'Verify OTP & Login'
              : 'Send OTP to Email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
