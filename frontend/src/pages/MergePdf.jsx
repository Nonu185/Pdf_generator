import React, { useRef, useState } from 'react';
import axios from 'axios';

const MergePdf = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length < 2) {
        alert("Please select at least 2 PDF files to merge.");
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
    }

    try {
        setLoading(true);
        setPdfUrl(null);
        const response = await axios.post('http://localhost:5000/api/pdf/merge', formData, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        setPdfUrl(url);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'merged.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        
        e.target.value = null;
    } catch (error) {
        console.error("Error merging PDFs", error);
        alert("Failed to merge PDFs. Please ensure backend is running.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center mt-10">
      <h1 className="text-3xl md:text-7xl font-black">
        <span className="text-5xl text-gray-700 font-serif">
          Merge PDFs
        </span>
      </h1>
      <p className="mt-3 text-xl text-gray-500">Combine multiple PDF files into one single document seamlessly.</p>
      
      <input 
        type="file" 
        multiple 
        accept="application/pdf" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      
      <button 
        onClick={handleUploadClick}
        disabled={loading}
        className="cursor-pointer mt-8 rounded-3xl px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium text-2xl hover:shadow-lg hover:shadow-indigo-200/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-70"
      >
        {loading ? 'Merging...' : 'Select PDFs'}
      </button>

      {pdfUrl && (
        <a 
          href={pdfUrl}
          download="merged.pdf"
          className="mt-6 rounded-3xl px-8 py-3 bg-indigo-600 text-white font-medium text-xl hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2"
        >
          <i className="ri-download-2-line"></i> Download PDF
        </a>
      )}
    </main>
  );
};

export default MergePdf;
