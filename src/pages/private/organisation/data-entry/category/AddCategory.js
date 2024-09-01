import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { firestore, auth } from "../../../../../firebase";
import { useNavigate } from "react-router-dom";
import APP_STRINGS from "../../../../../util/strings";

const AddCategory = () => {
  const [text, setText] = useState("");
  const [showAlertError, setShowAlertError] = useState(false);

  const navigate = useNavigate();

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    if (text === "") {
      return;
    }
    try {
      const categoriesRef = firestore
        .collection("orgs")
        .doc(auth.currentUser.uid)
        .collection("activityDescriptions");

      const addedCategory = categoriesRef.add({
        text: text,
      });
      const id = (await addedCategory).id;
      await categoriesRef.doc(id).update({
        id: id,
      });
      navigate("/org/categories");
    } catch (error) {
      console.error("There is an error: ", error);
      setShowAlertError(true);
    }
  };

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/org/categories">
          <Button variant="secondary">{APP_STRINGS.CAT_BACK}</Button>
        </Link>
        <h2 className="text-center">{APP_STRINGS.CAT_ADD_NEW}</h2>
        <div style={{ width: "110px" }}></div>
      </div>

      <Form onSubmit={handleSubmitCategory}>
        <Form.Group controlId="formCategory">
          <Form.Label>{APP_STRINGS.CAT_IME}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.CAT_ENTER_NAME}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="mt-3">
          {APP_STRINGS.CAT_SAVE}
          </Button>
        </div>
      </Form>

      <Alert
        show={showAlertError}
        key={"danger"}
        variant={"danger"}
        className="text-center mt-3"
      >
        {APP_STRINGS.CAT_THERE_IS_AN_ERROR}
      </Alert>
    </div>
  );
};

export default AddCategory;