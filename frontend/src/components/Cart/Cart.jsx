// This file can be safely deleted as it's no longer needed
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { token, user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    semester: '',
    branch: '',
    address: ''
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCart();
  }, [token]);
  
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };
  
  const removeFromCart = async (bookId) => {
    try {
      const response = await fetch(`/api/cart/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      const data = await response.json();
      setCart(data);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };
  
  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      const data = await response.json();
      setCart(data);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckout = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ shippingDetails })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }
      
      const data = await response.json();
      toast.success(`Checkout successful! ${data.orderCount} order(s) placed.`);
  
      setCart({ items: [] });
      setShowCheckout(false);
      setShippingDetails({
        semester: '',
        branch: '',
        address: ''
      });
      
   
      navigate('/my-orders');
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error.message || 'Checkout failed');
    }
  };
  
  if (loading) {
    return <div className="cart-loading">Loading your cart...</div>;
  }
  
  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any books to your cart yet.</p>
        <button onClick={() => navigate('/borrow')} className="browse-books-btn">
          Browse Books
        </button>
      </div>
    );
  }
  
  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      {showCheckout ? (
        <div className="checkout-form-container">
          <h2>Complete Your Order</h2>
          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="form-group">
              <label htmlFor="semester">Semester:</label>
              <select
                id="semester"
                name="semester"
                value={shippingDetails.semester}
                onChange={handleInputChange}
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
              <label htmlFor="branch">Branch:</label>
              <select
                id="branch"
                name="branch"
                value={shippingDetails.branch}
                onChange={handleInputChange}
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
              <label htmlFor="address">Delivery Address:</label>
              <textarea
                id="address"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
                rows="3"
              ></textarea>
            </div>
            
            <div className="checkout-buttons">
              <button 
                type="button" 
                onClick={() => setShowCheckout(false)}
                className="back-button"
              >
                Back to Cart
              </button>
              <button 
                type="submit" 
                className="place-order-button"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img src={item.bookId.photo} alt={item.bookId.name} />
                </div>
                <div className="item-details">
                  <h3>{item.bookId.name}</h3>
                  <p>Branch: {item.bookId.branch}</p>
                  <p>Semester: {item.bookId.semester}</p>
                  <p className="item-price">₹{item.bookId.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.bookId._id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total ({cart.items.length} items):</span>
              <span>₹{cart.items.reduce((total, item) => total + item.bookId.price, 0)}</span>
            </div>
            
            <div className="cart-actions">
              <button 
                onClick={clearCart}
                className="clear-cart-button"
              >
                Clear Cart
              </button>
              <button 
                onClick={() => setShowCheckout(true)}
                className="checkout-button"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
