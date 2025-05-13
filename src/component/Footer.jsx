import React, { useState, useEffect,useContext } from 'react';
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShopContext } from '../context/ShopContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubscribe = async () => {
    if (!email) {
      setMessage('Please enter an email');
      toast.error('Please enter an email');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email');
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendUrl }/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Subscribed successfully!');
        toast.success('Subscribed successfully!');
        setEmail('');
      } else {
        setMessage(data.message || 'Something went wrong');
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage('Server error, please try again later');
      toast.error('Server error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  // Auto-clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <footer className="border-gray-200 pt-30 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-light">
              <span className="text-orange-500 font-medium">AFANDAL | </span> Elevate Your Style
            </h3>
            <p className="text-gray-600 max-w-xs">Premium streetwear that makes a statement</p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Collections', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`/${item.toLowerCase()}`} className="text-gray-600 hover:text-orange-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-800">Join Our Community</h4>
            <p className="text-gray-600 mb-4">Get updates on new drops and exclusive offers</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-orange-500"
                disabled={loading}
              />
              <button
                onClick={handleSubscribe}
                className="bg-gray-700 hover:bg-orange-600 text-white px-4 py-2 rounded-r transition-colors"
                disabled={loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {message && (
              <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
              <FaInstagram className="text-orange-600 text-xl" />
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
              <FaTwitter className="text-orange-600 text-xl" />
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
              <FaLinkedin className="text-orange-600 text-xl" />
            </a>
          </div>
          <p className="text-gray-500 text-sm">© 2025 Afandal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;