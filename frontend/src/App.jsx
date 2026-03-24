import React from 'react';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="min-h-screen text-gray-900 transition-colors duration-300  pt-24">
      <Navbar />
      
      <main className="max-w-5xl  mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center mt-10">
        <h1 className="text-3xl md:text-7xl font-black  ">
          <span className="text-5xl text-gray-700  font-serif">
            IMG to PDF
          </span>
        </h1>
          <p className=" mt-3 text-xl text-gray-500 ">Convert your images to PDF in seconds easily with <i className="ri-arrow-right-up-line"></i>  flakes.pdf</p>
       <button className=" mt-8 rounded-3xl h-42 w-100  px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium text-2xl hover:shadow-lg hover:shadow-indigo-200/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">Upload image</button>
       <button className='text-5xl mt-5 bg-gradient-to-l from-red-600 to-pink-200 rounded-full p-3'  ><i class="ri-drive-line"></i></button>
      </main>
    </div>
  );
};

export default App; 