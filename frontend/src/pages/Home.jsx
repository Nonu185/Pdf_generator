import React, { useRef, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    try {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/api/pdf/convert', formData, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        setPdfUrl(url); // Save URL for the manual download button
        
        // Keep auto-download for convenience, but now they also have a button
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'converted.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        
        e.target.value = null;
    } catch (error) {
        console.error("Error converting images", error);
        alert("Failed to convert images. Please ensure backend is running.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center mt-10">
      <h1 className="text-3xl md:text-7xl font-black">
        <span className="text-5xl text-gray-700 font-serif">
          IMG to PDF
        </span>
      </h1>
      <p className="mt-3 text-xl text-gray-500">Convert your images to PDF in seconds easily with <i className="ri-arrow-right-up-line"></i> flakes.pdf</p>
      
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      
      <button 
        onClick={handleUploadClick}
        disabled={loading}
        className="cursor-pointer mt-8 rounded-3xl px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium text-2xl hover:shadow-lg hover:shadow-indigo-200/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-70"
      >
        {loading ? 'Converting...' : 'Upload image'}
      </button>

      {pdfUrl && (
        <a 
          href={pdfUrl}
          download="converted.pdf"
          className="mt-6 rounded-3xl px-8 py-3 bg-indigo-600 text-white font-medium text-xl hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2"
        >
          <i className="ri-download-2-line"></i> Download PDF
        </a>
      )}

      <button 
        onClick={() => window.open('https://drive.google.com/', '_blank')}
        className='cursor-pointer text-5xl mt-5 bg-gradient-to-l from-red-600 to-pink-200 rounded-full p-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
        title="Open Google Drive"
      >
        <i className="ri-drive-line text-white"></i>
      </button>
    </main>
  );
};

export default Home;
