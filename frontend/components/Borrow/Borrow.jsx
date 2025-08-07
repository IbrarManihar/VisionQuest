import React, { useState, useEffect } from 'react';
import './Borrow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RazorpayPayment from '../../src/components/Payment/RazorpayPayment';
import API_BASE_URL from '../config/api.js'; // Add this import

export const Borrow = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [priceFilter, setPriceFilter] = useState('NONE');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [userName, setUserName] = useState(user?.name || '');
  const [userSemester, setUserSemester] = useState('');
  const [userBranch, setUserBranch] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [orderStep, setOrderStep] = useState(1); 
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    
    if (user) {
      setUserName(user.name);
    }
  }, [user]);

  useEffect(() => {
 
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/books', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Error fetching books');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBooks();
    }
  }, [token]);

  useEffect(() => {

    let filtered = [...books];
    if (semesterFilter !== 'ALL') {
      filtered = filtered.filter(book => book.semester === semesterFilter);
    }
    if (branchFilter !== 'ALL') {
      filtered = filtered.filter(book => book.branch === branchFilter);
    }
    if (priceFilter === 'LOW_TO_HIGH') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceFilter === 'HIGH_TO_LOW') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilteredBooks(filtered);
  }, [semesterFilter,priceFilter, branchFilter, books]);

  const handleBorrow = (book) => {
    setSelectedBook(book);
    setShowForm(true);
  };

  const handlePaymentSuccess = (paymentResult) => {
  
    setShowRazorpay(false);
    

    setPaymentData(paymentResult);
    setPaymentMethod('razorpay');
    
   
    submitOrder(paymentResult);
  };

  
  const submitOrder = async (paymentResult = null) => {
    try {
      setLoading(true);
      
      const orderData = {
        bookId: selectedBook._id,
        userName: userName || user?.name || 'Anonymous',
        userSemester: selectedBook.semester, 
        userBranch: selectedBook.branch,
        contactNumber,
        shippingAddress,
        paymentMethod,
        paymentDetails: paymentMethod === 'razorpay' ? paymentData || paymentResult : null,
        buyerNotes,
        userId: user?._id
      };
      
      console.log('Submitting order:', orderData);
      
      const response = await fetch(`${API_BASE_URL}/api/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }
      
      console.log('Order created successfully:', data);
      
     
      if (data.order) {
        const recentOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
        recentOrders.unshift(data.order);
        localStorage.setItem('recentOrders', JSON.stringify(recentOrders.slice(0, 5)));
        
        
        sessionStorage.setItem('orderSuccess', 'true');
        sessionStorage.setItem('orderBookName', selectedBook.name);
      }
      
    
      toast.success('Order placed successfully!');
      
      
      const updatedBooks = books.filter(book => book._id !== selectedBook._id);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      
      
      setShowForm(false);
      setOrderStep(1);
      
      
      setTimeout(() => {
        navigate('/my-orders?newOrder=true&timestamp=' + Date.now());
      }, 1500);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMessage) => {
    toast.error(`Payment failed: ${errorMessage}`);
    setShowRazorpay(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (orderStep === 1) {
     
      if (!contactNumber || !shippingAddress) {
        toast.error('Please provide contact number and shipping address');
        return;
      }
      setOrderStep(2);
      return;
    }
    
    if (orderStep === 2) {
      if (paymentMethod === 'razorpay') {
        setShowRazorpay(true);
        return;
      }
      
      
      setOrderStep(3);
      return;
    }
    
   
    if (orderStep === 3) {
      submitOrder();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBook(null);
  };


  const CheckoutSteps = ({ currentStep }) => {

    let progressWidth = '0%';
    if (currentStep === 2) progressWidth = '50%';
    if (currentStep >= 3) progressWidth = '100%';
    
    return (
      <div className="checkout-steps">
        {}
        <div 
          className="step-progress"
          style={{ width: progressWidth }}
        ></div>
        
        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
          <div className="step-label">Shipping Details</div>
        </div>
        
        <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
          <div className="step-label">Payment Method</div>
        </div>
        
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>
    );
  };

  
  const renderFormStep = () => {
    switch (orderStep) {
      case 1:
        return (
          <>
            <h2>Shipping Details</h2>
            <div className="form-group">
              <label htmlFor="userName">Name:</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number:</label>
              <input
                type="tel"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="shippingAddress">Delivery Address:</label>
              <textarea
                id="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="buyerNotes">Additional Notes (Optional):</label>
              <textarea
                id="buyerNotes"
                value={buyerNotes}
                onChange={(e) => setBuyerNotes(e.target.value)}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2>Select Payment Method</h2>
            <div className="payment-methods">
              <div 
                className={`payment-method ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="payment-method-icon">💵</div>
                <div className="payment-method-details">
                  <div className="payment-method-title">
                    Cash on Delivery
                    <span className="payment-method-badge">No Fees</span>
                  </div>
                  <div className="payment-method-description">
                    Pay with cash when your book is delivered to your doorstep
                  </div>
                </div>
                <input 
                  type="radio" 
                  id="cash" 
                  name="paymentMethod" 
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  style={{ marginLeft: '10px' }}
                />
              </div>
              
              <div 
                className={`payment-method ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('razorpay')}
              >
                <div className="payment-method-icon">💳</div>
                <div className="payment-method-details">
                  <div className="payment-method-title">
                    Pay Online
                    <span className="payment-method-badge">Secure</span>
                  </div>
                  <div className="payment-method-description">
                    Credit/Debit cards, UPI, Net Banking & more via Razorpay
                  </div>
                </div>
                <input 
                  type="radio" 
                  id="razorpay" 
                  name="paymentMethod" 
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  style={{ marginLeft: '10px' }}
                />
              </div>
            </div>
            
            {paymentMethod === 'razorpay' && paymentData && (
              <div className="payment-success-message">
                <div className="success-icon">✓</div>
                <p><strong>Payment Successful!</strong></p>
                <p className="payment-id">Transaction ID: {paymentData.paymentId}</p>
              </div>
            )}
            
            <div className="payment-security-note">
              <div style={{ fontSize: '24px', marginRight: '10px' }}>🔒</div>
              <p>All transactions are secure and encrypted. Your payment information is never stored on our servers.</p>
            </div>
          </>
        );
      case 3:
        return (
          <div className="order-confirmation">
            <div className="confirmation-icon">✓</div>
            <h3>Order Summary</h3>
            
            <div className="book-preview">
              <img 
                src={selectedBook.photo} 
                alt={selectedBook.name}
                className="book-image" 
              />
              <div className="book-details">
                <h4>{selectedBook.name}</h4>
                <p>Branch: {selectedBook.branch}</p>
                <p>Semester: {selectedBook.semester}</p>
              </div>
            </div>
            
            <div className="order-details">
              <div className="detail-row">
                <span>Price:</span>
                <span className="price">₹{selectedBook.price}</span>
              </div>
              <div className="detail-row">
                <span>Payment Method:</span>
                <span className={`payment-badge ${paymentMethod}`}>
                  {paymentMethod === 'cash' ? 'Cash on Delivery' : 
                   paymentMethod === 'razorpay' ? 'Paid via Razorpay' : 'Other'}
                </span>
              </div>
              {paymentMethod === 'razorpay' && paymentData && (
                <div className="detail-row">
                  <span>Payment ID:</span>
                  <span className="payment-id">{paymentData.paymentId}</span>
                </div>
              )}
              <div className="detail-row">
                <span>Delivery Address:</span>
                <span className="address">{shippingAddress || 'Not provided'}</span>
              </div>
              <div className="detail-row">
                <span>Contact:</span>
                <span>{contactNumber || 'Not provided'}</span>
              </div>
              
              <div className="estimated-delivery">
                <div className="delivery-icon">🚚</div>
                <div className="delivery-info">
                  <span>Estimated Delivery:</span>
                  <span className="delivery-date">
                    {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="confirmation-notes">
              <p>Please keep your order information handy. You'll be notified when your order is processed.</p>
              {paymentMethod === 'cash' && (
                <div className="cash-instructions">
                  <p><strong>Note:</strong> Please have the exact amount ready for the delivery person.</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (showRazorpay) {
      document.body.classList.add('razorpay-payment-active');
    } else {
      document.body.classList.remove('razorpay-payment-active');
    }
    
    return () => {
      document.body.classList.remove('razorpay-payment-active');
    };
  }, [showRazorpay]);
  
  return (
    <div className="borrow-container">
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="semesterFilter">Semester:</label>
          <select
            id="semesterFilter"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="ALL">ALL</option>
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
        
        <div className="filter-group">
          <label htmlFor="branchFilter">Branch:</label>
          <select
            id="branchFilter"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="ALL">ALL</option>
            <option value="Computer">Computer</option>
            <option value="Civil">Civil</option>
            <option value="Mechanical">Mechanical</option>
            <option value="EC">EC</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="priceFilter">Price:</label>
          <select
            id="priceFilter"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="NONE">None</option>
            <option value="LOW_TO_HIGH">Low to High</option>
            <option value="HIGH_TO_LOW">High to Low</option>
          </select>
        </div>
      </div>
      <div className="book-list">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-item">
            {book.photo && <img src={book.photo} alt={book.name} />}
            <h2>{book.name}</h2>
            <p>Semester: {book.semester}</p>
            <p>Branch: {book.branch}</p>
            <p className='price'>Price: ₹{book.price}</p>
            <button onClick={() => handleBorrow(book)}>Buy Now</button>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="borrow-form-container">
          <form onSubmit={handleSubmit} className="borrow-form">
            <button type="button" className="close-button" onClick={handleCloseForm}>X</button>
            <h2>Buy Book: {selectedBook.name}</h2>
            
            <CheckoutSteps currentStep={orderStep} /> {}
            
            {renderFormStep()}
            
            <div className="form-navigation">
              {orderStep > 1 && (
                <button 
                  type="button" 
                  onClick={() => setOrderStep(orderStep - 1)}
                  className="back-button"
                >
                  Back
                </button>
              )}
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 
                 orderStep === 3 ? 'Confirm Order' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      )}
      {showRazorpay && (
        <div className="razorpay-overlay">
          <RazorpayPayment 
            bookId={selectedBook._id}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={() => setShowRazorpay(false)}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};



