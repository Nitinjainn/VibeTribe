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
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { debugAuth } from "../utils/debugAuth";

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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, loading, authMethod, logout, getUserDisplayName, getUserAddress, getUserEmail } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate("/");
      } else {
        console.error("Logout error:", result.error);
      }
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  // Debug function
  // const handleDebugAuth = () => {
  //   debugAuth();
  // };

  // Get user display info
  const getUserDisplayInfo = () => {
    if (!user) return { name: 'User', method: null };
    
    return {
      name: getUserDisplayName(),
      method: authMethod,
      address: getUserAddress(),
      email: getUserEmail()
    };
  };

  const userInfo = getUserDisplayInfo();

  return (
    <Disclosure
      as="nav"
      className={`w-full fixed top-0 z-50 ${
        isScrolled
          ? "bg-[#0F181F] bg-opacity-85 border-b border-gray-800 backdrop-blur-md"
          : "bg-[#0F181F] bg-opacity-100"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between py-2">
          {/* Logo */}
          <div className="flex items-center text-white text-xl sm:text-2xl font-bold tracking-tight rounded-lg px-1 py-0.5">
            VibeTribe
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? "text-base text-gray-300 hover:text-white relative group"
                    : "text-base text-gray-300 hover:text-white relative group",
                  "px-3 py-1.5 rounded-md font-medium transition duration-200 hover:bg-gray-800/60 focus:outline-none"
                )}
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#22c55e] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  // Show when user is logged in
                  <>
                    <button className="relative rounded-full bg-gray-800 p-1.5 text-gray-400 hover:bg-gray-700 transition">
                      <i
                        className="fa-solid fa-bell"
                        style={{ fontSize: "20px", color: "#fff", padding: "2px" }}
                      ></i>
                    </button>

                    <Menu as="div" className="relative">
                      <MenuButton className="flex items-center bg-gray-800 rounded-full p-1.5 hover:bg-gray-700 transition">
                        <i
                          className="fa-solid fa-user"
                          style={{ fontSize: "20px", color: "#fff", padding: "2px" }}
                        ></i>
                      </MenuButton>
                      <MenuItems className="absolute right-0 mt-2 w-64 origin-top-right bg-[#0F181F]/95 backdrop-blur-lg border border-gray-700 shadow-lg rounded-xl py-2 z-[100]">
                        {/* User Info */}
                        <div className="px-4 py-2 border-b border-gray-700">
                          <div className="text-sm text-gray-300 font-medium">{userInfo.name}</div>
                          <div className="text-xs text-gray-500">
                            {userInfo.method === 'metamask' ? (
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="#f6851b">
                                  <path d="M21.49 4.27c-.32-.73-.84-1.35-1.49-1.8L12.5.5c-.73-.32-1.54-.32-2.27 0L3.5 2.47c-.65.45-1.17 1.07-1.49 1.8L.5 6.5c-.32.73-.32 1.54 0 2.27l1.51 2.23c.32.73.84 1.35 1.49 1.8l6.73 3.97c.73.32 1.54.32 2.27 0l6.73-3.97c.65-.45 1.17-1.07 1.49-1.8L23.5 6.5c.32-.73.32-1.54 0-2.27l-1.51-2.23z"/>
                                </svg>
                                MetaMask
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <i className="fa-solid fa-envelope mr-1"></i>
                                Email
                              </span>
                            )}
                          </div>
                          {userInfo.address && (
                            <div className="text-xs text-gray-500 font-mono">
                              {userInfo.address.slice(0, 6)}...{userInfo.address.slice(-4)}
                            </div>
                          )}
                        </div>
                        
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              to="/Profile"
                              className={`flex items-center px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors ${
                                active && "bg-gray-800"
                              }`}
                            >
                              <i className="fa-solid fa-user-circle mr-2"></i>
                              Your Profile
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              to="#"
                              className={`flex items-center px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors ${
                                active && "bg-gray-800"
                              }`}
                            >
                              <i className="fa-solid fa-cog mr-2"></i>
                              Settings
                            </Link>
                          )}
                        </MenuItem>
                        <div className="border-t border-gray-700 my-1"></div>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`flex items-center w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors ${
                                active && "bg-gray-800"
                              }`}
                            >
                              <i className="fa-solid fa-sign-out-alt mr-2"></i>
                              Sign out
                            </button>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </>
                ) : (
                  // Show when user is not logged in
                  <>
                    <button
                      onClick={handleLogin}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors hover:bg-gray-800/60 rounded-md"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleSignup}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#22c55e] hover:bg-[#16a34a] transition-colors rounded-md"
                    >
                      Sign Up
                    </button>
                  </>
                )}
                
                {/* Debug button (only in development)
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={handleDebugAuth}
                    className="px-2 py-1 text-xs font-medium text-gray-400 hover:text-white transition-colors hover:bg-gray-800/60 rounded-md"
                    title="Debug Authentication"
                  >
                    🐛
                  </button>
                )} */}
              </>
            )}
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
      <DisclosurePanel className="sm:hidden bg-[#0F181F]/95 backdrop-blur-lg border-t border-gray-800 p-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {item.name}
          </Link>
        ))}
        
        {/* Mobile Authentication Buttons */}
        {!loading && !user && (
          <div className="border-t border-gray-700 mt-2 pt-2 space-y-1">
            <button
              onClick={handleLogin}
              className="block w-full text-left px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="block w-full text-left px-3 py-2 rounded-md text-white bg-[#22c55e] hover:bg-[#16a34a] transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}