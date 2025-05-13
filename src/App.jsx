import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import PlaceOrder from './pages/PlaceOrder';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import SmoothScroll from './utils/smoothScroll'; // Import the SmoothScroll component
import SearchBar from './component/SearchBar';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    
    <SmoothScroll> {/* Wrap your entire app with SmoothScroll */}
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        
        <Navbar/>
        <SearchBar/>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<Collection/>} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path='/product/:productId' element={<Product/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/place-order' element={<PlaceOrder/>}/>
          <Route path='/order' element={<Order/>}/>
        </Routes>
        <Footer/>
      </div>
    </SmoothScroll>
  )
}

export default App;