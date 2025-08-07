import React from 'react';
import './Schedules.css';

const schedules = [
  {
    id: 1,
    title: 'Computer Engineering Semester 1',
    branch: 'Computer',
    semester: '1',
    href: 'https://example.com/schedules/computer-sem1.pdf',
  },
  {
    id: 2,
    title: 'Computer Engineering Semester 1',
    branch: 'Computer',
    semester: '2',
    href: 'https://example.com/schedules/computer-sem1.pdf',
  },
  {
    id: 3,
    title: 'Computer Engineering Semester 1',
    branch: 'Computer',
    semester: '3',
    href: 'https://example.com/schedules/computer-sem1.pdf',
  },
  {
    id: 4,
    title: 'Computer Engineering Semester 1',
    branch: 'Computer',
    semester: '4',
    href: 'https://www.gecdahod.ac.in/notices/4TH_SEM_T2024-12-20-17-39-38.pdf',
  },
  {
    id: 5,
    title: 'Computer Engineering Semester 1',
    branch: 'Computer',
    semester: '5',
    href: 'https://www.gecdahod.ac.in/notices/revised_5th_Sem_mid_exam_schedule_2024-25_odd2024-09-19-12-18-12.pdf',
  },
  {
    id: 6,
    title: 'Computer Engineering Semester 1',
    branch: 'Computer',
    semester: '6',
    href: 'https://example.com/schedules/computer-sem1.pdf',
  },
  {
    id: 7,
    title: 'Computer Engineering Semester 1',
    branch: 'Computer',
    semester: '7',
    href: 'https://example.com/schedules/computer-sem1.pdf',
  },
  {
    id: 8,
    title: 'Computer Engineering Semester 1',
    branch: 'Computer',
    semester: '8',
    href: 'https://example.com/schedules/computer-sem1.pdf',
  },
  {
    id: 3,
    title: 'Civil Engineering Semester 1',
    branch: 'Civil',
    semester: '1',
    href: 'https://example.com/schedules/civil-sem1.pdf',
  },
  {
    id: 4,
    title: 'Civil Engineering Semester 2',
    branch: 'Civil',
    semester: '2',
    href: 'https://example.com/schedules/civil-sem2.pdf',
  },
  {
    id: 4,
    title: 'Civil Engineering Semester 2',
    branch: 'Civil',
    semester: '3',
    href: 'https://example.com/schedules/civil-sem2.pdf',
  },
  {
    id: 4,
    title: 'Civil Engineering Semester 2',
    branch: 'Civil',
    semester: '4',
    href: 'https://example.com/schedules/civil-sem2.pdf',
  },
  {
    id: 4,
    title: 'Civil Engineering Semester 2',
    branch: 'Civil',
    semester: '5',
    href: 'https://example.com/schedules/civil-sem2.pdf',
  },
  {
    id: 4,
    title: 'Civil Engineering Semester 2',
    branch: 'Civil',
    semester: '6',
    href: 'https://example.com/schedules/civil-sem2.pdf',
  },
  {
    id: 4,
    title: 'Civil Engineering Semester 2',
    branch: 'Civil',
    semester: '7',
    href: 'https://example.com/schedules/civil-sem2.pdf',
  },
  {
    id: 4,
    title: 'Civil Engineering Semester 2',
    branch: 'Civil',
    semester: '8',
    href: 'https://example.com/schedules/civil-sem2.pdf',
  },
  {
    id: 5,
    title: 'Mechanical Engineering Semester 1',
    branch: 'Mechanical',
    semester: '1',
    href: 'https://example.com/schedules/mechanical-sem1.pdf',
  },
  {
    id: 6,
    title: 'Mechanical Engineering Semester 2',
    branch: 'Mechanical',
    semester: '2',
    href: 'https://example.com/schedules/mechanical-sem2.pdf',
  },
  {
    id: 6,
    title: 'Mechanical Engineering Semester 2',
    branch: 'Mechanical',
    semester: '3',
    href: 'https://example.com/schedules/mechanical-sem2.pdf',
  },
  {
    id: 6,
    title: 'Mechanical Engineering Semester 2',
    branch: 'Mechanical',
    semester: '4',
    href: 'https://example.com/schedules/mechanical-sem2.pdf',
  },
  {
    id: 6,
    title: 'Mechanical Engineering Semester 2',
    branch: 'Mechanical',
    semester: '5',
    href: 'https://example.com/schedules/mechanical-sem2.pdf',
  },
  {
    id: 6,
    title: 'Mechanical Engineering Semester 2',
    branch: 'Mechanical',
    semester: '6',
    href: 'https://example.com/schedules/mechanical-sem2.pdf',
  },
  {
    id: 6,
    title: 'Mechanical Engineering Semester 2',
    branch: 'Mechanical',
    semester: '7',
    href: 'https://example.com/schedules/mechanical-sem2.pdf',
  },
  {
    id: 6,
    title: 'Mechanical Engineering Semester 2',
    branch: 'Mechanical',
    semester: '8',
    href: 'https://example.com/schedules/mechanical-sem2.pdf',
  },

  // Add more schedules as needed
];

const groupedSchedules = schedules.reduce((acc, schedule) => {
  if (!acc[schedule.branch]) {
    acc[schedule.branch] = [];
  }
  acc[schedule.branch].push(schedule);
  return acc;
}, {});

export const Schedules = () => {
  return (
    <div className="schedules-container">
      <h1 style={{display:'flex',justifyContent:'center'}}>Download Latest TimeTable</h1>
      {Object.keys(groupedSchedules).map(branch => (
        <div key={branch} className="branch-section">
          <h2>{branch} Engineering</h2>
          <div className="schedule-list">
            {groupedSchedules[branch].map(schedule => (
              <div key={schedule.id} className="schedule-item">
                <h3>Semester {schedule.semester}</h3>
                <a href={schedule.href} target="_blank" rel="noopener noreferrer" className="download-button">Download</a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Schedules;