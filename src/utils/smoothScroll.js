import { useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    smoothscroll.polyfill();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return children;
};

export default SmoothScroll;