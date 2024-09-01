import React, { useState } from "react";
import "../../../../../styles/EmployeeItem.css";
import { Button, Row, Col, Form } from "react-bootstrap";
import { firestore, auth } from "../../../../../firebase";
import APP_STRINGS from "../../../../../util/strings";

const EmployeeItem = ({ employee, updateEmployeeList }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(employee.name);
  const [editedSurname, setEditedSurname] = useState(employee.surname);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setEditedName(employee.name);
    setEditedSurname(employee.surname);
    setIsEditMode(false);
  };

  const handleApplyClick = async () => {
    try {
      const usersRef = firestore.collection("users").doc(employee.id);
      await usersRef.update({
        name: editedName,
        surname: editedSurname,
      });

      setIsEditMode(false);
      updateEmployeeList(employee.id, {
        name: editedName,
        surname: editedSurname,
      });
    } catch (error) {
      console.error("Error on apply click.", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const usersRef = firestore.collection("users").doc(employee.id);
      await usersRef.delete();

      const orgRef = firestore.collection("orgs").doc(auth.currentUser.uid);
      const orgSnapshot = await orgRef.get();
      if (!orgSnapshot.exists) {
        console.error("Organization document does not exist!");
        return;
      }
      const orgData = orgSnapshot.data();
      const employeesArray = orgData.employees || [];
      const updatedEmployeesArray = employeesArray.filter(
        (ref) => ref.id !== employee.id
      );
      await orgRef.update({ employees: updatedEmployeesArray });
    } catch (error) {
      console.error("Error on delete click.", error);
    }
  };

  return (
    <div
      key={employee.id}
      className={`w-100 employee-item ${isHovered ? "hovered" : ""}`}
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
                  placeholder={APP_STRINGS.EMP_ENTER_NAME}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col className="mr-2">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder={APP_STRINGS.EMP_ENTER_SURNAME}
                  value={editedSurname}
                  onChange={(e) => setEditedSurname(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col className="justify-content-end">
              <Form.Group>
                <Button variant="link" onClick={handleApplyClick}>
                  {APP_STRINGS.EMP_APPLY}
                </Button>
                <Button variant="link" onClick={handleCancelClick}>
                  {APP_STRINGS.EMP_CANCEL}
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      ) : (
        <div className="employee-details">
          {employee.name} {employee.surname}
        </div>
      )}

      {isHovered && !isEditMode && (
        <div className="action-buttons">
          <Button variant="link" onClick={handleDeleteClick}>
            {APP_STRINGS.EMP_DELETE}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeItem;
