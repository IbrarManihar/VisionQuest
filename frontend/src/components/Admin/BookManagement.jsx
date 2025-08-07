import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const BookManagement = () => {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/books', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [token]);
  
  const toggleBookAvailability = async (bookId, currentAvailability) => {
    try {
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ available: !currentAvailability })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update book availability');
      }
      
      const updatedBook = await response.json();
      
      // Update the books state
      setBooks(books.map(book => 
        book._id === bookId ? updatedBook : book
      ));
      
      toast.success(`Book is now ${updatedBook.available ? 'available' : 'unavailable'}`);
    } catch (error) {
      console.error('Error updating book availability:', error);
      toast.error('Failed to update book availability');
    }
  };
  
  return (
    <div className="book-management">
      <h2>Book Management</h2>
      
      {loading ? (
        <div className="loading">Loading books...</div>
      ) : books.length > 0 ? (
        <div className="books-table-container">
          <table className="books-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id}>
                  <td>
                    <img 
                      src={book.photo} 
                      alt={book.name} 
                      className="book-thumbnail" 
                    />
                  </td>
                  <td>{book.name}</td>
                  <td>{book.branch}</td>
                  <td>{book.semester}</td>
                  <td>₹{book.price}</td>
                  <td>
                    <span className={`status-badge ${book.available ? 'available' : 'unavailable'}`}>
                      {book.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={book.available ? 'disable-button' : 'enable-button'}
                      onClick={() => toggleBookAvailability(book._id, book.available)}
                    >
                      {book.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No books found</div>
      )}
    </div>
  );
};

export default BookManagement;
