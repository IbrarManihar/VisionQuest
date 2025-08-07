import React from 'react';
import './Events.css';

const events = [
  {
    id: 1,
    title: 'Technical Symposium 2025',
    date: '2025-08-15',
    description: 'Annual technical symposium featuring workshops, competitions, and guest lectures from industry experts.',
    type: 'upcoming'
  },
  {
    id: 2,
    title: 'Alumni Meet 2025',
    date: '2025-08-05',
    description: 'Connect with alumni and build your professional network through interactive sessions and panel discussions.',
    type: 'upcoming'
  },
  {
    id: 3,
    title: 'Winter Hackathon',
    date: '2024-12-20',
    description: '24-hour coding challenge to solve real-world problems. Open to all departments and skill levels.',
    type: 'upcoming'
  },
  {
    id: 4,
    title: 'New Year Celebration',
    date: '2025-01-05',
    description: 'Ring in the new year with cultural performances, games, and an awards ceremony recognizing student achievements.',
    type: 'upcoming'
  },
  {
    id: 5,
    title: 'Republic Day Celebration',
    date: '2025-01-26',
    description: 'Flag hoisting ceremony followed by patriotic performances and a tech exhibition showcasing student innovations.',
    type: 'upcoming'
  },
  {
    id: 6,
    title: 'Autumn Coding Competition',
    date: '2024-10-28',
    description: 'Competitive programming contest with prizes for top performers across all branches.',
    type: 'upcoming'
  },
  {
    id: 7,
    title: 'Tech Career Fair 2024',
    date: '2024-11-15',
    description: 'Meet recruiters from top tech companies and explore internship and job opportunities.',
    type: 'upcoming'
  },
  {
    id: 8,
    title: 'AI Workshop Series',
    date: '2024-12-05',
    description: 'Three-day workshop on artificial intelligence, machine learning, and their applications in various fields.',
    type: 'upcoming'
  },
  {
    id: 9,
    title: 'Independence Day Celebration',
    date: '2024-08-15',
    description: 'Flag hoisting ceremony and cultural performances celebrating India\'s independence.',
    type: 'past'
  },
  {
    id: 10,
    title: 'Industrial Visit',
    date: '2024-07-12',
    description: 'Visit to leading tech companies to understand industrial applications and career opportunities.',
    type: 'past'
  },
  {
    id: 11,
    title: 'Fresher\'s Day',
    date: '2024-08-25',
    description: 'Welcome event for first-year students with fun activities and introductions to college clubs and societies.',
    type: 'past'
  },
  {
    id: 12,
    title: 'Teacher\'s Day Celebration',
    date: '2024-09-05',
    description: 'Special event honoring professors and teachers with cultural performances by students.',
    type: 'past'
  },
  {
    id: 13,
    title: 'Summer Internship Fair',
    date: '2024-04-15',
    description: 'Opportunity to connect with companies offering summer internships across various domains.',
    type: 'past'
  },
  {
    id: 14,
    title: 'Research Symposium',
    date: '2024-05-20',
    description: 'Student research presentations and poster sessions with feedback from faculty experts.',
    type: 'past'
  },
  {
    id: 15,
    title: 'College Annual Day',
    date: '2024-03-30',
    description: 'Celebration of the college\'s founding with awards, performances and alumni speeches.',
    type: 'past'
  }
];

const upcomingEvents = events.filter(event => event.type === 'upcoming');
const pastEvents = events.filter(event => event.type === 'past');

export const Events = () => {
  return (
    <div className="events-container">
      <h1>College Events</h1>
      <div className="events-section">
        <h2>Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <div key={event.id} className="event-item">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>
      <div className="events-section">
        <h2>Past Events</h2>
        {pastEvents.length > 0 ? (
          pastEvents.map(event => (
            <div key={event.id} className="event-item">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p>No past events.</p>
        )}
      </div>
    </div>
  );
};

export default Events;