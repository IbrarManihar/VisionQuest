import React from 'react';
import './Home.css';

export const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Vision Quest – Empowering Your Learning Journey!</h1>
      <p>
        At Vision Quest, we are dedicated to making education more accessible, collaborative, and organized. Whether you're a student looking for the perfect textbook, a teacher seeking a platform to share study materials, or someone looking to keep track of your classes and events, we have everything you need!
      </p>
      <div className="features">
        <div className="card">
          <img src="../src/assets/book.jpg" alt="Book Exchange" />
          <h2>Book Exchange</h2>
          <p>Explore a vast collection of books available for borrowing or lending.</p>
        </div>
        <div className="card">
          <img src="../src/assets/smm.avif" alt="Study Materials" />
          <h2>Study Materials</h2>
          <p>Access a wide range of study materials across various subjects.</p>
        </div>
        <div className="card">
          <img src="../src/assets/schedules.jpeg" alt="Class Schedules" />
          <h2>Class Schedules</h2>
          <p>Stay organized with our intuitive class schedule feature.</p>
        </div>
        <div className="card">
          <img src="../src/assets/events.avif" alt="College Events" />
          <h2>College Events</h2>
          <p>Keep track of upcoming college events and activities.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;