import React, { useEffect, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Effect to show/hide button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full shadow-md transition-opacity duration-200 opacity-90 hover:opacity-100"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <FaChevronUp className="text-2xl" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
