import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  CiSearch,
  CiUser,
  CiShoppingCart,
  CiMenuFries,
  CiCircleRemove,
} from 'react-icons/ci';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount } = useContext(ShopContext);

  const token = localStorage.getItem('token');
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown

  const handleUserClick = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setShowLogout(!showLogout);
  };

  const handleOrderPageClick = () => {
    navigate('/order');
    setShowLogout(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setShowLogout(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setVisible(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);

  return (
    <nav className="flex items-center justify-between py-5 px-5 sm:px-10">
      {/* Logo */}
      <Link to="/">
        <img
          src="/assets/images/afandal.png"
          alt="Afandal Logo"
          className="h-12 w-auto"
        />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden sm:flex gap-8 text-gray-700 text-lg font-medium">
        {['Home', 'Collections', 'About', 'Contact'].map((item) => (
          <NavLink
            key={item}
            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
            className={({ isActive }) =>
              `relative py-2 px-4 transition-colors duration-300 group ${
                isActive ? 'text-orange-500' : 'hover:text-orange-500'
              }`
            }
          >
            {item}
            <span
              className={`absolute left-1/2 bottom-0 h-0.5 bg-orange-500 transition-all duration-300 transform -translate-x-1/2 
              ${
                location.pathname ===
                (item === 'Home' ? '/' : `/${item.toLowerCase()}`)
                  ? 'w-10'
                  : 'w-0 group-hover:w-10'
              }`}
            ></span>
          </NavLink>
        ))}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6 text-gray-700 relative">
        <CiSearch
          className="text-2xl cursor-pointer hover:text-orange-500 transition-colors"
          onClick={() => setShowSearch(true)}
        />

        <div className="relative" ref={dropdownRef}>
          <CiUser
            className="text-2xl cursor-pointer hover:text-orange-500 transition-colors"
            onClick={handleUserClick}
          />
          {token && showLogout && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10">
              <button
                onClick={handleOrderPageClick}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                My Orders
              </button>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <CiShoppingCart className="text-2xl cursor-pointer hover:text-orange-500 transition-colors" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {getCartCount()}
          </span>
        </Link>

        <button
          onClick={() => setVisible(true)}
          className="text-2xl cursor-pointer hover:text-orange-500 transition-colors sm:hidden"
          aria-label="Open menu"
        >
          <CiMenuFries />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 flex justify-end sm:hidden ${
          visible ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setVisible(false)}
        />
        {/* Sidebar */}
        <div
          className={`relative w-80 max-w-full h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            visible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-orange-500">AFANDAL</h2>
            <button
              onClick={() => setVisible(false)}
              className="text-2xl text-gray-700 hover:text-orange-500 transition-colors"
              aria-label="Close menu"
            >
              <CiCircleRemove />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4">
            <ul className="space-y-2">
              {['Home', 'Collections', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <NavLink
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className={({ isActive }) =>
                      `block py-4 px-6 rounded-lg text-lg font-medium transition-colors ${
                        isActive
                          ? 'text-orange-500 bg-orange-50'
                          : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                      }`
                    }
                    onClick={() => setVisible(false)}
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Section */}
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;