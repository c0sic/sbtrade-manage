import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { firestore, auth } from "../../../../../firebase";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import APP_STRINGS from "../../../../../util/strings";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [orgEmail, setOrgEmail] = useState("");
  const [orgPassword, setOrgPassword] = useState("");

  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState(true);
  const [showAlertError, setShowAlertError] = useState(false);

  const handleSubmitOrgPassword = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated!");
        return;
      }

      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        orgPassword
      );
      await user.reauthenticateWithCredential(credential);
      setOrgEmail(user.email);
      setShowDialog(false);
    } catch (error) {
      console.error("handleSubmitOrgPassword error: ", error);
    }
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();

    if (orgPassword === "") {
      setShowDialog(true);
      return;
    }

    if (name === "" || surname === "" || email === "" || password === "") {
      return;
    }

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await firestore.collection("users").doc(user.uid).set({
        isOrg: false,
        name: name,
        surname: surname,
        id: user.uid,
      });

      await auth.signInWithEmailAndPassword(orgEmail, orgPassword);

      const orgRef = firestore.collection("orgs").doc(auth.currentUser.uid);
      const orgSnapshot = await orgRef.get();
      if (!orgSnapshot.exists) {
        console.error("Path does not exist!");
        return;
      }

      const batch = firestore.batch();
      const userRef = firestore.collection("users").doc(user.uid);
      const employees = orgSnapshot.data().employees || [];
      batch.update(orgRef, { employees: [...employees, userRef] });
      await batch.commit();
      navigate("/org/employees");
    } catch (error) {
      setShowAlertError(true);
      console.error("Error adding employee:", error.message);
    }
  };

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/org/employees">
          <Button variant="secondary">{APP_STRINGS.EMP_BACK}</Button>
        </Link>
        <h2 className="text-center">{APP_STRINGS.EMP_ADD_NEW}</h2>
        <div style={{ width: "110px" }}></div>
      </div>

      <Form onSubmit={handleSubmitEmployee}>
        <Form.Group controlId="formName">
          <Form.Label>{APP_STRINGS.EMP_NAME}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.EMP_ENTER_NAME}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formSurname">
          <Form.Label>{APP_STRINGS.EMP_SURNAME}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.EMP_ENTER_SURNAME}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formEmail">
          <Form.Label>{APP_STRINGS.EMP_EMAIL}</Form.Label>
          <Form.Control
            type="email"
            placeholder={APP_STRINGS.EMP_ENTER_EMAIL}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formPassword">
          <Form.Label>{APP_STRINGS.EMP_PASSWORD}</Form.Label>
          <Form.Control
            type="password"
            placeholder={APP_STRINGS.EMP_ENTER_PASSWORD}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-100 mt-3">
            {APP_STRINGS.EMP_SAVE}
          </Button>
        </div>
      </Form>

      <Alert
        show={showAlertError}
        key={"danger"}
        variant={"danger"}
        className="text-center mt-3"
      >
        {APP_STRINGS.EMP_THERE_IS_AN_ERROR}
      </Alert>

      <Modal show={showDialog} onHide={() => setShowDialog(false)}>
        <Form onSubmit={handleSubmitOrgPassword}>
          <Modal.Header closeButton>
            <Modal.Title> {APP_STRINGS.EMP_ENTER_ORG_PASSWORD}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formOrgPassword">
              <Form.Label>{APP_STRINGS.EMP_IN_ORDER_TO}</Form.Label>
              <div className="mb-1" />
              <Form.Control
                type="password"
                placeholder={APP_STRINGS.EMP_ENTER_ORG_PASSWORD}
                value={orgPassword}
                onChange={(e) => setOrgPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              {APP_STRINGS.EMP_CLOSE}
            </Button>
            <Button variant="primary" type="submit">
              {APP_STRINGS.EMP_SAVE}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AddEmployee;
