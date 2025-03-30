import { useState, useEffect } from 'react';
import { Modal, Button, Form, Badge, Toast } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Head from 'next/head';
import { debounce } from 'lodash';

// Dynamically import DataTable for client-side rendering
const DataTable = dynamic(() => import('react-data-table-component').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="mt-3 text-muted">Loading table...</div>
    </div>
  )
});

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCallLogModal, setShowCallLogModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [editForm, setEditForm] = useState({
    first_name: '', last_name: '', mail_id: '', phone: '', address: '',
    date_of_birth: '', gender: '', education: '', emergency_contact: '', notes: ''
  });
  const [callLog, setCallLog] = useState({
    status: 'Completed', notes: '', needs_follow_up: false, follow_up_date: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  // Toast helper
  const showToastMessage = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch students from API with current filters
  const fetchStudents = async (page = 1, limit = perPage) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/students?page=${page}&limit=${limit}&search=${searchTerm}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch students');
      }
      setStudents(data.students);
      setTotalRows(data.total);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching students:', error);
      showToastMessage(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler
  const handleSearch = debounce(term => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchStudents(1, perPage);
  }, 500);

  // Pagination handlers
  const handlePageChange = page => {
    setCurrentPage(page);
    fetchStudents(page, perPage);
  };
  const handlePerRowsChange = newPerPage => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    fetchStudents(1, newPerPage);
  };

  // Student actions
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      mail_id: student.mail_id || '',
      phone: student.phone || '',
      address: student.address || '',
      date_of_birth: student.date_of_birth ? new Date(student.date_of_birth).toISOString().split('T')[0] : '',
      gender: student.gender || '',
      education: student.education || '',
      emergency_contact: student.emergency_contact || '',
      notes: student.notes || ''
    });
    setShowEditModal(true);
  };

  const saveEditChanges = async () => {
    try {
      const response = await fetch(`/api/students?id=${selectedStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update student');
      }
      setShowEditModal(false);
      showToastMessage('Student updated successfully');
      fetchStudents(currentPage, perPage);
    } catch (error) {
      console.error('Error updating student:', error);
      showToastMessage(error.message, 'danger');
    }
  };

  const handleDelete = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      const response = await fetch(`/api/students?id=${studentId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student');
      }
      showToastMessage('Student deleted successfully');
      fetchStudents(currentPage, perPage);
    } catch (error) {
      console.error('Error deleting student:', error);
      showToastMessage(error.message, 'danger');
    }
  };

  // Call log actions from Students table
  const handleAddCallLog = (student) => {
    setSelectedStudent(student);
    setCallLog({ status: 'Completed', notes: '', needs_follow_up: false, follow_up_date: '' });
    setShowCallLogModal(true);
  };

  const saveCallLog = async () => {
    try {
      const response = await fetch('/api/call-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: selectedStudent._id, ...callLog }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save call log');
      }
      setShowCallLogModal(false);
      showToastMessage('Call log added successfully');
      // (Optional) Could refresh call logs page or data if needed
    } catch (error) {
      console.error('Error saving call log:', error);
      showToastMessage(error.message, 'danger');
    }
  };

  // Table columns definition
  const columns = [
    {
      name: 'Student',
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
      cell: row => (
        <div className="d-flex align-items-center">
          <div className="avatar-circle me-2">
            {row.first_name ? row.first_name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <div className="fw-bold">{row.first_name} {row.last_name}</div>
            <div className="text-muted small">{row.mail_id}</div>
          </div>
        </div>
      ),
    },
    {
      name: 'Phone',
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: 'Education',
      selector: row => row.education,
      sortable: true,
      cell: row => (
        <Badge bg="info">
          {row.education ? row.education.replace('_', ' ').toUpperCase() : 'N/A'}
        </Badge>
      ),
    },
    {
      name: 'Actions',
      allowOverflow: true,
      cell: row => (
        <div className="d-flex gap-2">
          <Button variant="primary" size="sm" onClick={() => handleAddCallLog(row)} title="Add Call Log">
            <i className="fas fa-phone"></i>
          </Button>
          <Button variant="warning" size="sm" onClick={() => handleEdit(row)} title="Edit">
            <i className="fas fa-edit"></i>
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)} title="Delete">
            <i className="fas fa-trash"></i>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Students - HSAPSS Windsor</title>
      </Head>

      <Navbar />

      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Students</h1>
          <Button variant="primary" href="/add-student">
            <i className="fas fa-plus me-2"></i>Add Student
          </Button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search students..."
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={students}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              responsive
            />
          </div>
        </div>
      </div>

      {/* Edit Student Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={editForm.mail_id}
                    onChange={(e) => setEditForm({ ...editForm, mail_id: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </Form.Group>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={editForm.date_of_birth}
                    onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Education</Form.Label>
              <Form.Select
                value={editForm.education}
                onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
              >
                <option value="">Select Education</option>
                <option value="high_school">High School</option>
                <option value="bachelors">Bachelors</option>
                <option value="masters">Masters</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Emergency Contact</Form.Label>
              <Form.Control
                type="tel"
                value={editForm.emergency_contact}
                onChange={(e) => setEditForm({ ...editForm, emergency_contact: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEditChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Call Log Modal */}
      <Modal show={showCallLogModal} onHide={() => setShowCallLogModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Call Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Student</Form.Label>
              <Form.Control type="text" readOnly value={selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : ''} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={callLog.status}
                onChange={(e) => setCallLog({ ...callLog, status: e.target.value })}
                required
              >
                <option value="Completed">Completed</option>
                <option value="No Answer">No Answer</option>
                <option value="Left Message">Left Message</option>
                <option value="Rescheduled">Rescheduled</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={callLog.notes}
                onChange={(e) => setCallLog({ ...callLog, notes: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Needs Follow-up"
                checked={callLog.needs_follow_up}
                onChange={(e) => setCallLog({ ...callLog, needs_follow_up: e.target.checked, follow_up_date: e.target.checked ? callLog.follow_up_date : '' })}
              />
            </Form.Group>
            {callLog.needs_follow_up && (
              <Form.Group className="mb-3">
                <Form.Label>Follow-up Date</Form.Label>
                <Form.Control
                  type="date"
                  value={callLog.follow_up_date}
                  onChange={(e) => setCallLog({ ...callLog, follow_up_date: e.target.value })}
                  required={callLog.needs_follow_up}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCallLogModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveCallLog}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        bg={toastVariant === 'success' ? 'success' : 'danger'} 
        delay={3000} autohide 
        className="position-fixed bottom-0 end-0 m-3"
      >
        <Toast.Header closeButton>
          <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
        </Toast.Header>
        <Toast.Body className={toastVariant === 'success' ? 'text-success' : 'text-danger'}>
          {toastMessage}
        </Toast.Body>
      </Toast>
    </>
  );
}
