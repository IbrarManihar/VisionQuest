import React, { useState, useEffect } from 'react';
import './StudyMaterial.css';


export const initialStudyMaterials = [
  {
    id: 1,
    title: 'Digital Fundamentals (3130704)',
    type: 'TextBooks',
    semester: '3',
    branch: 'Computer',
    href: 'https://drive.google.com/file/d/1aYbKSkALeXyaHaYy1LDlbcYNfS6ALkzj/view',
    image: '../public/DF.jpg',
  },
  {
    id: 2,
    title: 'Data Structure (3130702)',
    type: 'TextBooks',
    semester: '3',
    branch: 'Computer',
    href: 'https://drive.google.com/file/d/1cJkCuEm0TbLwCrfuFDp9bIklOZBNgEB-/view',
    image: '../public/DS.png',
  },
  {
    id: 3,
    title: 'Database Management System (3130703)',
    type: 'TextBooks',
    semester: '3',
    branch: 'Computer',
    href: 'https://example.com/downloads/database-management-system.pdf',
    image: '../public/DBMS.png',
  },
  {
    id: 4,
    title: 'Probability & Stats (3130006)',
    type: 'TextBooks',
    semester: '3',
    branch: 'Computer',
    href: 'https://example.com/downloads/probability-stats.pdf',
    image: '../public/PS.jpeg',
  },
  {
    id: 5,
    title: 'Effective Technical Communication (3130004)',
    type: 'TextBooks',
    semester: '3',
    branch: 'Computer',
    href: 'https://example.com/downloads/effective-technical-communication.pdf',
    image: '../public/ETC.png',
  },
  {
    id: 6,
    title: 'Indian Constitution (3130007)',
    type: 'TextBooks',
    semester: '3',
    branch: 'Computer',
    href: 'https://example.com/downloads/indian-constitution.pdf',
    image: '../public/IC.jpeg',
  },
  {
    id: 7,
    title: 'Advance Java (3160707)',
    type: 'TextBooks',
    semester: '6',
    branch: 'Computer',
    href: 'https://drive.google.com/file/d/1cWjnxeYtMQuhVced-UaB6EsIybSgn4wN/view',
    image: '../public/AJ.webp',
  },
  {
    id: 8,
    title: 'Data Mining (3160714)',
    type: 'TextBooks',
    semester: '6',
    branch: 'Computer',
    href: 'https://drive.google.com/file/d/11-z_J0dFk2IYiMJ4eGOpXkBSL_3jGC6m/view',
    image: '../public/DataMining.jpg',
  },
  {
    id: 9,
    title: 'Web Programming (3160713)',
    type: 'TextBooks',
    semester: '6',
    branch: 'Computer',
    href: 'https://drive.google.com/file/d/1TGnZpw16wPa6viUBugHsSIcJ-Wsr-HQH/view',
    image: '../public/WP.jpg',
  },
  {
    id: 10,
    title: 'Theory of Computation (3160704)',
    type: 'TextBooks',
    semester: '6',
    branch: 'Computer',
    href: 'https://drive.google.com/file/d/1Uy9BIgl4JTFm5IM8_q1LWO3VyeUazsxE/view',
    image: '../public/toc.jpeg',
  },
  {
    id: 11,
    title: 'Data Visualization (3160717)',
    type: 'TextBooks',
    semester: '6',
    branch: 'Computer',
    href: 'https://drive.google.com/file/d/1kBGr8LqEzbseIavLQptddNKwgMMaHhRG/view',
    image: '../public/DV.jpg',
  },
  {
    id: 12,
    title: 'IOT & Application (3160716)',
    type: 'TextBooks',
    semester: '6',
    branch: 'Computer',
    href: 'https://drive.google.com/file/d/1LPqCyFNWFq4MGJwVukP7q1wAmikfVO7S/view',
    image: '../public/IOT.png',
  },

];

export const StudyMaterial = () => {
  const [studyMaterials, setStudyMaterials] = useState(initialStudyMaterials);
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  
    setLoading(true);
    
    const fetchStudyMaterials = async () => {
      try {
      
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching study materials:', error);
        setLoading(false);
      }
    };

    fetchStudyMaterials();
  }, []);

  const filteredMaterials = studyMaterials.filter(material => {
    return (semesterFilter === 'ALL' || material.semester === semesterFilter) &&
           (branchFilter === 'ALL' || material.branch === branchFilter) &&
           (typeFilter === 'ALL' || material.type === typeFilter);
  });
  
  return (
    <div className="study-material-container">
      <h1>Study Materials</h1>
      <div className="filter-container">
        <label htmlFor="semesterFilter">Semester: </label>
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
        <label htmlFor="branchFilter">Branch: </label>
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
        <label htmlFor="typeFilter">Type: </label>
        <select
          id="typeFilter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">ALL</option>
          <option value="TextBooks">TextBooks</option>
          <option value="Syllabus">Syllabus</option>
          <option value="Previous Year Papers">Previous Year Papers</option>
          <option value="Mid-Sem Papers">Mid-Sem Papers</option>
          <option value="Notes">Notes</option>
        </select>
      </div>
      
      {loading ? (
        <div className="loading">Loading study materials...</div>
      ) : filteredMaterials.length > 0 ? (
        <div className="material-list">
          {filteredMaterials.map(material => (
            <div key={material.id} className="material-item">
              <img src={material.image} alt={material.title} className="material-image" />
              <h2>{material.title}</h2>
              <a href={material.href} target="_blank" rel="noopener noreferrer" className="download-button">Download</a>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-materials">No study materials found matching your filters.</div>
      )}
    </div>
  );
};

export default StudyMaterial;
