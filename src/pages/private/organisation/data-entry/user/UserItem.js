import React, { useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { firestore, auth } from "../../../../../firebase";
import "../../../../../styles/UserItem.css";
import APP_STRINGS from "../../../../../util/strings";

const UserItem = ({ user, updateUserList }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedSurname, setEditedSurname] = useState(user.surname);
  const [editedOib, setEditedOib] = useState(user.oib);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setEditedName(user.name);
    setEditedSurname(user.surname);
    setIsEditMode(false);
  };

  const handleApplyClick = async () => {
    try {
      const endUserDoc = firestore
        .collection("orgs")
        .doc(auth.currentUser.uid)
        .collection("endUsers")
        .doc(user.id);

      await endUserDoc.update({
        name: editedName,
        surname: editedSurname,
        oib: editedOib,
      });

      setIsEditMode(false);
      updateUserList(user.id, {
        name: editedName,
        surname: editedSurname,
        oib: editedOib,
      });
    } catch (error) {
      console.error("Error on apply click.", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const endUserDoc = firestore
        .collection("orgs")
        .doc(auth.currentUser.uid)
        .collection("endUsers")
        .doc(user.id);
      await endUserDoc.delete();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error on delete click.", error);
    }
  };

  return (
    <div
      key={user.id}
      className={`w-100 user-item ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditMode ? (
        <Form className="w-100">
          <Row className="align-items-center justify-content-between">
            <Col className="mr-2">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder={APP_STRINGS.EU_ENTER_NAME}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col className="mr-2">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder={APP_STRINGS.EU_ENTER_SURNAME}
                  value={editedSurname}
                  onChange={(e) => setEditedSurname(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col className="mr-2">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder={APP_STRINGS.EU_ENTER_OIB}
                  value={editedOib}
                  onChange={(e) => setEditedOib(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col className="justify-content-end">
              <Form.Group>
                <Button variant="link" onClick={handleApplyClick}>
                  {APP_STRINGS.EU_APPLY}
                </Button>
                <Button variant="link" onClick={handleCancelClick}>
                  {APP_STRINGS.EU_CANCEL}
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      ) : (
        <div className="user-details">
          {user.name} {user.surname} {"OIB: "} {user.oib}
        </div>
      )}
      {isHovered && !isEditMode && (
        <div className="action-buttons">
          <Button variant="link" className="mr-2" onClick={handleEditClick}>
            {APP_STRINGS.EU_EDIT}
          </Button>
          <Button variant="link" onClick={handleDeleteClick}>
            {APP_STRINGS.EU_DELETE}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserItem;
