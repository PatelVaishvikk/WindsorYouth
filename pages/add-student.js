import { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';

export default function AddStudent() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mail_id: '',
    phone: '',
    address: '',
    date_of_birth: '',
    education: '',
    emergency_contact: '',
    notes: '',
    box_cricket: false,
    box_cricket_years: [],
    atmiya_cricket_tournament: false,
    atmiya_cricket_years: [],
    atmiya_youth_shibir: false,
    atmiya_youth_years: [],
    yuva_mahotsav: false,
    yuva_mahotsav_years: [],
    harimay: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Year range for year selection (e.g., last 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleYearChange = (event, fieldName) => {
    const { options } = event.target;
    const selectedYears = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedYears.push(Number(options[i].value));
      }
    }
    
    setFormData({ ...formData, [fieldName]: selectedYears });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit student details.');
      }
      
      setSuccess('Student added successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        mail_id: '',
        phone: '',
        address: '',
        date_of_birth: '',
        education: '',
        emergency_contact: '',
        notes: '',
        box_cricket: false,
        box_cricket_years: [],
        atmiya_cricket_tournament: false,
        atmiya_cricket_years: [],
        atmiya_youth_shibir: false,
        atmiya_youth_years: [],
        yuva_mahotsav: false,
        yuva_mahotsav_years: [],
        harimay: false
      });
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Add Student - HSAPSS Windsor</title>
      </Head>
      <Container className="mt-4">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Add New Student</span>
            <Link href="/login" passHref>
              <Button variant="outline-primary" size="sm">Login</Button>
            </Link>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="first_name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="last_name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="mail_id">
                    <Form.Label>Email (Optional)</Form.Label>
                    <Form.Control
                      name="mail_id"
                      type="email"
                      value={formData.mail_id}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      as="textarea"
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="date_of_birth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="education">
                    <Form.Label>Education</Form.Label>
                    <Form.Select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                    >
                      <option value="">Select Education</option>
                      <option value="masters">Masters</option>
                      <option value="pg_diploma">PG Diploma</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="emergency_contact">
                    <Form.Label>Emergency Contact</Form.Label>
                    <Form.Control
                      name="emergency_contact"
                      type="text"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Event Participation Section */}
              <h4 className="mt-4 mb-3">Event Participation</h4>
              
              {/* Box Cricket */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="box_cricket">
                    <Form.Check
                      type="checkbox"
                      name="box_cricket"
                      label="Box Cricket"
                      checked={formData.box_cricket}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group controlId="box_cricket_years">
                    <Form.Label>Participation Years</Form.Label>
                    <Form.Select
                      name="box_cricket_years"
                      multiple
                      disabled={!formData.box_cricket}
                      onChange={(e) => handleYearChange(e, 'box_cricket_years')}
                      value={formData.box_cricket_years}
                    >
                      {years.map(year => (
                        <option key={`box-${year}`} value={year}>{year}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Hold Ctrl/Cmd to select multiple years
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Atmiya Cricket Tournament */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="atmiya_cricket_tournament">
                    <Form.Check
                      type="checkbox"
                      name="atmiya_cricket_tournament"
                      label="Atmiya Cricket Tournament"
                      checked={formData.atmiya_cricket_tournament}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group controlId="atmiya_cricket_years">
                    <Form.Label>Participation Years</Form.Label>
                    <Form.Select
                      name="atmiya_cricket_years"
                      multiple
                      disabled={!formData.atmiya_cricket_tournament}
                      onChange={(e) => handleYearChange(e, 'atmiya_cricket_years')}
                      value={formData.atmiya_cricket_years}
                    >
                      {years.map(year => (
                        <option key={`atmiya-cricket-${year}`} value={year}>{year}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Hold Ctrl/Cmd to select multiple years
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Atmiya Youth Shibir */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="atmiya_youth_shibir">
                    <Form.Check
                      type="checkbox"
                      name="atmiya_youth_shibir"
                      label="Atmiya Youth Shibir"
                      checked={formData.atmiya_youth_shibir}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group controlId="atmiya_youth_years">
                    <Form.Label>Participation Years</Form.Label>
                    <Form.Select
                      name="atmiya_youth_years"
                      multiple
                      disabled={!formData.atmiya_youth_shibir}
                      onChange={(e) => handleYearChange(e, 'atmiya_youth_years')}
                      value={formData.atmiya_youth_years}
                    >
                      {years.map(year => (
                        <option key={`atmiya-youth-${year}`} value={year}>{year}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Hold Ctrl/Cmd to select multiple years
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Yuva Mahotsav */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="yuva_mahotsav">
                    <Form.Check
                      type="checkbox"
                      name="yuva_mahotsav"
                      label="Yuva Mahotsav"
                      checked={formData.yuva_mahotsav}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group controlId="yuva_mahotsav_years">
                    <Form.Label>Participation Years</Form.Label>
                    <Form.Select
                      name="yuva_mahotsav_years"
                      multiple
                      disabled={!formData.yuva_mahotsav}
                      onChange={(e) => handleYearChange(e, 'yuva_mahotsav_years')}
                      value={formData.yuva_mahotsav_years}
                    >
                      {years.map(year => (
                        <option key={`yuva-${year}`} value={year}>{year}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Hold Ctrl/Cmd to select multiple years
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Harimay */}
              <Form.Group className="mb-3" controlId="harimay">
                <Form.Check
                  type="checkbox"
                  name="harimay"
                  label="Harimay"
                  checked={formData.harimay}
                  onChange={handleChange}
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="notes">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  name="notes"
                  as="textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Form.Group>
              
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding Student...' : 'Add Student'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
