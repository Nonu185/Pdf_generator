import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-5 cursor-pointer group">
          <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
            flakes.pdf
          </span>
        </div>

        {/* Links Section */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="relative font-medium text-gray-700 hover:text-red-600 transition-colors group py-2">
            Compress PDF
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </a>
          <a href="#" className="relative font-medium text-gray-700 hover:text-red-600 transition-colors group py-2">
            Merge PDF
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </a>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
        <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium hover:shadow-lg hover:shadow-indigo-200/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
            Log in
          </button>
          
          <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium hover:shadow-lg hover:shadow-indigo-200/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
            Sign up
          </button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
