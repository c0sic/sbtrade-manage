import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { firestore, auth } from "../../../../../firebase";
import { useNavigate } from "react-router-dom";
import APP_STRINGS from "../../../../../util/strings";

const AddUser = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [oib, setOib] = useState("");

  const navigate = useNavigate();

  const [showAlertError, setShowAlertError] = useState(false);

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    if (name === "" || surname === "" || oib === "") {
      return;
    }
    try {
      const endUserRef = firestore
        .collection("orgs")
        .doc(auth.currentUser.uid)
        .collection("endUsers");

      const addedEndUser = endUserRef.add({
        name: name,
        surname: surname,
        oib: oib
      });
      const id = (await addedEndUser).id;
      await endUserRef.doc(id).update({
        id: id,
      });
      navigate("/org/users");
    } catch (error) {
      console.error("There is an error: ", error);
      setShowAlertError(true);
    }
  };

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/org/users">
          <Button variant="secondary">{APP_STRINGS.EU_BACK}</Button>
        </Link>
        <h2 className="text-center">{APP_STRINGS.EU_ADD_NEW}</h2>
        <div style={{ width: "110px" }}></div>
      </div>

      <Form onSubmit={handleSubmitUser}>
        <Form.Group controlId="formName">
          <Form.Label>{APP_STRINGS.EU_NAME}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.EU_ENTER_NAME}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formSurname">
          <Form.Label>{APP_STRINGS.EU_SURNAME}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.EU_ENTER_SURNAME}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formOib">
          <Form.Label>{APP_STRINGS.EU_OIB}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.EU_ENTER_OIB}
            value={oib}
            onChange={(e) => setOib(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-100 mt-3">
            {APP_STRINGS.EU_SAVE}
          </Button>
        </div>
      </Form>

      <Alert
        show={showAlertError}
        key={"danger"}
        variant={"danger"}
        className="text-center mt-3"
      >
        {APP_STRINGS.EU_THERE_IS_AN_ERROR}
      </Alert>
    </div>
  );
};

export default AddUser;
