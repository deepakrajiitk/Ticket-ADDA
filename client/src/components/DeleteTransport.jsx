import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";


const TransportDeleter = ({ onDelete }) => {
  const [transportID, setTransportID] = useState("");
  const [transporterID, setTransporterID] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    const data1 = {
      transportID: transportID,
      transporterID: transporterID,
    };
  
    try {
      const response = axios.get("http://localhost:5000/deleteModeOfTransport", {
        params: data1,
      });
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1> Delete Transport</h1>


      <Form.Group controlId="transporterID">
        <Form.Label>Provider ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Provider ID"
          value={transporterID}
          onChange={(e) => setTransporterID(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="transportID">
        <Form.Label>Transport ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Transport ID"
          value={transportID}
          onChange={(e) => setTransportID(e.target.value)}
        />
      </Form.Group>


      <Button variant="danger" type="submit">
        Delete
      </Button>
    </Form>
  );
};

export default TransportDeleter;
