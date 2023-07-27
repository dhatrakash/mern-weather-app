// src/components/InputCity.tsx

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const InputCity = ({ onCityChange }: { onCityChange: (city: string) => void }) => {
  const [city, setCity] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCityChange(city);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formCity">
        <Form.Label>City</Form.Label>
        <Form.Control type="text" placeholder="Enter city" value={city} onChange={handleInputChange} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Fetch Weather Data
      </Button>
    </Form>
  );
};

export default InputCity;
