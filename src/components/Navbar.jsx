// Navbar.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Auth/AuthProvider"; // Import the useAuth hook from your AuthProvider
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase";


const Navbar = () => {
  const { currentUser } = useAuth();
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // No need to pass the auth instance since we're using the default instance
      navigate("/login"); // Navigate to the login page after signing out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleUserDatabaseClick = () => {
    navigate('/users'); // Navigate to the UserTable component
    setShowOverlay(false); // Close the overlay if it's open
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <header className=" bg-white shadow-md">
      <div className="mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="text-xl font-bold text-gray-800 block">
          Weather App
        </a>
        <div className="lg:flex items-center space-x-4 cursor-pointer" onClick={toggleOverlay}>
          <FontAwesomeIcon
            icon={faUserCircle}
            size="lg"
            className="cursor-pointer"
          />
          {currentUser && (
            <span className="hidden lg:block text-gray-800">
              {currentUser?.displayName || currentUser?.email}
            </span>
          )}
        </div>
        {showOverlay && (
          <div className="absolute mt-[150px] right-0 lg:right-0 lg:mt-[100px] w-48 bg-[#393131] rounded-lg shadow-md overflow-hidden">
            <div className="py-2">
              <span className="lg:hidden block text-white">
                {currentUser?.displayName || currentUser?.email}
              </span>
            </div>
            <div className="py-2">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[red]"
              >
                Sign Out
              </button>
            </div>
            <div className="py-2">
              <button
                onClick={handleUserDatabaseClick}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[red]"
              >
                User Database
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
