import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Contri", href: "/DonationPage", current: false },
  { name: "How It Works", href: "/HowItWorks", current: false },
  { name: "About us", href: "/AboutUs", current: false },
  { name: "Favorites", href: "/Favorites", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const handleLogout = async () => {
  try {
    await signOut(auth);
    setIsLoggedIn(false);
    navigate("/");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Apply effect after 50px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* This div prevents content from being hidden under navbar */}
      <div className="h-20"></div>

      <Disclosure
        as="nav"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0F181F] bg-opacity-85 backdrop-blur-sm shadow-lg shadow-gray-700"
            : "bg-[#0F181F] bg-opacity-100"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="relative flex h-20 items-center justify-between drop-shadow-md">
            {/* Logo */}
            <div className="flex items-center text-white text-3xl font-bold">
              VibeTribe
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "text-lg text-gray-300 hover:text-white relative group"
                      : "text-lg text-gray-300 hover:text-white relative group",
                    "px-4 py-2 rounded-lg font-medium transition duration-300"
                  )}
                >
                  {item.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#22c55e] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Notification and Profile */}
            <div className="flex items-center space-x-4">
              <button className="relative rounded-full bg-gray-800 p-2 text-gray-400 shadow-md hover:scale-105 transition">
                <i
                  className="fa-solid fa-bell"
                  style={{ fontSize: "24px", color: "#fff", padding: "4px" }}
                ></i>
              </button>

              <Menu as="div" className="relative z-auto">
                <MenuButton className="flex items-center bg-gray-800 rounded-full p-2 shadow-md hover:scale-105 transition">
                  <i
                    className="fa-solid fa-user"
                    style={{ fontSize: "24px", color: "#fff", padding: "4px" }}
                  ></i>
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/Profile"
                        className={`block px-4 py-2 text-sm text-gray-700 ${
                          active && "bg-gray-200"
                        }`}
                      >
                        Your Profile
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="#"
                        className={`block px-4 py-2 text-sm text-gray-700 ${
                          active && "bg-gray-200"
                        }`}
                      >
                        Settings
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                          active && "bg-gray-200"
                        }`}
                      >
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <DisclosureButton className="text-white focus:outline-none">
                <Bars3Icon className="h-6 w-6" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <DisclosurePanel className="sm:hidden bg-white shadow-md rounded-lg p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block px-3 py-2 rounded-lg text-gray-900 hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}
        </DisclosurePanel>
      </Disclosure>
    </>
  );
}
