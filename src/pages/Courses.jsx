import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';
import CourseCard from '../components/Course/CourseCard';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">כל הקורסים</h2>
      {loading ? (
        <div>טוען...</div>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div key={course._id} className="col-md-4 mb-4">
              <Link to={`/course/${course._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CourseCard course={course} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;