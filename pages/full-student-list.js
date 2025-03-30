import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const FullStudentList = () => {
  const [students, setStudents] = useState([]);

  // Fetch all students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch students');
        }
        // Expect data.students array from API
        setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  // Delete a student and update list
  const deleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      const response = await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student');
      }
      // Remove deleted student from local state
      setStudents(prevStudents => prevStudents.filter(student => student._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // (Optional) Placeholder for future edit functionality
  const showEditModal = (student) => {
    console.log('Edit student:', student);
    // Implement edit modal if needed
  };

  return (
    <>
      <Head>
        <title>Full Student List</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Navbar />

      <div className="container my-4">
        <h1 className="text-center mb-4">📋 Full Student List</h1>
        <div className="card shadow">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Student Details</h5>
          </div>
          <div className="card-body p-0">
            <table className="table table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student._id}</td>
                    <td>{student.first_name}</td>
                    <td>{student.last_name}</td>
                    <td>{student.mail_id}</td>
                    <td>
                      <a href={`tel:${student.phone}`} className="text-primary">
                        {student.phone}
                      </a>
                    </td>
                    <td>{student.address || 'N/A'}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => showEditModal(student)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(student._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-3 text-muted">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullStudentList;
