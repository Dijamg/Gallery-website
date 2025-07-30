import React, { useState, useContext, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import UploadModal from "./UploadModal";
import Footer from "./Footer";
import { AuthContext } from "../context/authContext";
import { useCookies } from "../hooks/useCookies";
import { useAuth } from "../hooks/useAuth";

const Layout = ({ fetchData }: { fetchData: () => void }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useContext(AuthContext);
  const { getItem } = useCookies();
  const { token, logout } = useAuth();
  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
    const username = getItem("USERNAME");
    if (username) {
      setUsername(username);
    }
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLoginToggle = () => {
    setLoginOpen(!loginOpen);
    setLogoutOpen(false); // Close logout dropdown when opening login dropdown
  };

  const handleLogoutToggle = () => {
    setLogoutOpen(!logoutOpen);
    setLoginOpen(false); // Close login dropdown when opening logout dropdown
  };

  const handleLogout = () => {
    logout();
    setLogoutOpen(false);
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="flex min-h-screen bg-black flex-col">
      {/* Left Navbar */}
      <div className="fixed left-0 top-0 h-screen w-18 bg-black flex flex-col items-center pt-24 text-white z-10">
        <Link 
          to="/videos" 
          className={`mb-10 cursor-pointer flex flex-col items-center transition-colors duration-200 ${
            isActive('/videos') ? 'text-purple-400' : 'text-white hover:text-purple-400'
          }`}
        >
          <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          <span className="text-xs">Videos</span>
        </Link>
        
        <Link 
          to="/images" 
          className={`mb-10 cursor-pointer flex flex-col items-center transition-colors duration-200 ${
            isActive('/images') ? 'text-purple-400' : 'text-white hover:text-purple-400'
          }`}
        >
          <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span className="text-xs">Images</span>
        </Link>
        
        <Link 
          to="/other" 
          className={`mb-10 cursor-pointer flex flex-col items-center transition-colors duration-200 ${
            isActive('/other') ? 'text-purple-400' : 'text-white hover:text-purple-400'
          }`}
        >
          <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-xs">Other</span>
        </Link>
        
        <a 
          href="/" 
          className="mb-10 cursor-pointer flex flex-col items-center transition-colors duration-200 text-white hover:text-purple-400"
        >
          <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className="text-xs">TPX Site</span>
        </a>
      </div>

      {/* Top Right Logo and Title */}
      <div className="fixed top-4 left-24 z-50 flex items-center space-x-4">
        <img 
          src="/assets/tpx_logo.webp" 
          alt="TPX Logo" 
          className="w-12 h-12"
        />
        <span className="text-white font-bold text-xl">TPX Gallery</span>
      </div>

      {/* Top Right Buttons */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        {/* Add Button - Only visible to authenticated admins */}
        {token && isAdmin && (
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors duration-200 cursor-pointer"
            aria-label="Add"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Add</span>
          </button>
        )}

        {/* Login/Logout Button */}
        <div className="relative">
          {token ? (
            // Logged in - show logout dropdown
            <>
              <button
                onClick={handleLogoutToggle}
                className="flex items-center justify-center p-3 group transition-colors duration-200 cursor-pointer"
                aria-label="User menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} className="w-6 h-6 transition-colors duration-200 stroke-purple-400 group-hover:stroke-purple-300" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
              
              {/* Logout Dropdown */}
              {logoutOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-50">
                  <div className="px-4 py-3 border-b border-gray-600">
                    <p className="text-sm text-gray-300">
                      Logged in as <span className="font-semibold text-white">{username}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            // Not logged in - show login button
            <>
              <button
                onClick={handleLoginToggle}
                className="flex items-center justify-center p-3 group transition-colors duration-200 cursor-pointer"
                aria-label="Login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} className="w-6 h-6 transition-colors duration-200 stroke-white group-hover:stroke-purple-400" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
              
              <LoginForm 
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
                onLoginSuccess={(username: string) => setUsername(username)}
              />
            </>
          )}
        </div>
      </div>

      {/* Main Content Area - This is where routes will render */}
      <div className='ml-18 mt-18 mr-4 bg-gray-900 min-h-[calc(100vh-4.5rem)] rounded-t-3xl flex-1 relative z-10 border border-gray-600 flex flex-col' style={{ backgroundColor: '#0e0e0e' }}>
        <div className="flex-1">
          <Outlet />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        fetchData={fetchData}
      />
    </div>
  );
}

export default Layout; 