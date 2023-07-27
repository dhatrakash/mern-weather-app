// src/App.tsx

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import WeatherData from './components/WeatherChart';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedCity(city);
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-md-center mb-3">
        <Col md="auto">
          <h1>Weather App</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center mb-3">
        <Col md="auto">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text" 
                placeholder="Enter city name" 
                value={city}
                onChange={handleCityChange}
              />
            </Form.Group>
            <br></br>
            <Button type="submit">Submit</Button>
          </Form>
        </Col>
      </Row>
      {submittedCity && (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <WeatherData city={submittedCity} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
