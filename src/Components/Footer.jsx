import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto flex flex-wrap justify-between items-start">

        {/* Logo and Description Section */}
        <div className="w-full md:w-1/3 mb-8 md:mb-0">
          <h3 className="text-2xl font-bold mb-2">VibeTribe</h3>
          <p className="text-sm mb-4 text-gray-300">
            Elevating Travel Experiences & Community Connections Worldwide.
          </p>
          <p className="text-xs text-gray-500">© FundInc. 2023 All Rights Reserved.</p>
        </div>


        <div className="w-full md:w-1/5 mb-8 md:mb-0">
          <h4 className="text-lg font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-yellow-400">FAQ</a></li>
            <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-yellow-400">Accessibility</a></li>
            <li><a href="#" className="hover:text-yellow-400">Contact Us</a></li>
          </ul>
        </div>

        <div className="w-full md:w-1/5 mb-8 md:mb-0">
          <h4 className="text-lg font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
            <li><a href="#" className="hover:text-yellow-400">Careers</a></li>
            <li><a href="#" className="hover:text-yellow-400">Services</a></li>
            <li><a href="#" className="hover:text-yellow-400">Pricing</a></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="w-full md:w-1/5 flex justify-start md:justify-end items-center space-x-4 mt-8 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-yellow-400 text-2xl transition duration-300">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-400 text-2xl transition duration-300">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-400 text-2xl transition duration-300">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-400 text-2xl transition duration-300">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <p className="text-center text-sm text-gray-500">
        Empowering Global Travel through Community-Driven Solutions.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
