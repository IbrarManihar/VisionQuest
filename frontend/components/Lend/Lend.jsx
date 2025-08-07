import React, { useState } from 'react';
import './Lend.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../src/context/AuthContext';

export const Lend = () => {
  const { token, user } = useAuth();
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLend = async (e) => {
    e.preventDefault();
    setLoading(true);
    
 
    console.log('Form data before submission:', {
      name, semester, branch, price, photo
    });
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('semester', semester);
    formData.append('branch', branch);
    formData.append('price', price);
    
    if (photo) {
      formData.append('photo', photo);
    } else {
      toast.warning('No image selected. A default image will be used.');
    }
    
    formData.append('userId', user?._id || 'anonymous'); 

    try {
     
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await fetch('/api/lend', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok) {
        setMessage('Book listed for sale successfully!');
        toast.success('Book listed for sale successfully!');
     
        setName('');
        setSemester('');
        setBranch('');
        setPrice('');
        setPhoto(null);
        
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        setMessage(`Failed to list book for sale: ${data.message}`);
        toast.error(`Failed to list book: ${data.message || 'Unknown error'}`);
        
        if (data.error && data.error.includes('Cloudinary')) {
          toast.error('Image upload service is currently unavailable. Please try again later or contact support.');
        }
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setMessage(`An error occurred: ${error.message}`);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="lend-container">
        <h1>List a Book for Sale</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleLend} className="lend-form">
          <div className="form-group">
            <label>Book Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Semester:</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
          <div className="form-group">
            <label>Branch:</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            >
              <option value="">Select Branch</option>
              <option value="Computer">Computer</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
              <option value="EC">EC</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price in Rupees:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Photo:</label>
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              required
            />
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'List Book'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};


