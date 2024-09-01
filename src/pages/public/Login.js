import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import APP_STRINGS from "../../util/strings";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  }

  return (
    <div style={{ height: "100vh", width: "40em", margin: "10em auto" }}>
      <h2 className="text-center mb-4">{APP_STRINGS.LOGIN_TITLE}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group id="email" style={{ marginBottom: "20px" }}>
          <Form.Label>{APP_STRINGS.LOGIN_EMAIL}</Form.Label>
          <Form.Control
            type="email"
            placeholder={APP_STRINGS.LOGIN_ENTER_EMAIL}
            ref={emailRef}
            required
          />
        </Form.Group>
        <Form.Group id="password" style={{ marginBottom: "20px" }}>
          <Form.Label>{APP_STRINGS.LOGIN_PASSWORD}</Form.Label>
          <Form.Control
            type="password"
            placeholder={APP_STRINGS.LOGIN_ENTER_PASSWORD}
            ref={passwordRef}
            required
          />
        </Form.Group>
        <Button disabled={loading} className="w-100 mt-3" type="submit">
          {APP_STRINGS.LOGIN_LOG_IN}
        </Button>
      </Form>
    </div>
  );
}
