import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import { firestore, realtTimeDatabase, auth } from "../../../../../firebase";
import { doc, deleteDoc } from "firebase/firestore";

const ActionApprovalItem = ({ action, onDelete }) => {
  const handleCheckmarkClick = async () => {
    try {
      let orgId = auth.currentUser.uid;
      var [day, month, year] = action.date
        .trim()
        .split(".")
        .map((part) => part.trim());

      day = parseInt(day, 10);
      month = parseInt(month, 10);
      year = parseInt(year, 10);

      const actionRef = realtTimeDatabase.ref(
        `reports//${orgId}//${year}//${month}//${action.employeeId}//${day}//${action.id}`
      );
      await actionRef.set({
        employee: {
          id: action.employeeId,
          name: action.name,
          surname: action.surname,
        },
        id: action.id,
        workingHours: action.workingHours,
        maintenanceHours: action.maintenanceHours,
        location: action.locations,
      });
      handleXClick();
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const handleXClick = async () => {
    try {
      const docRef = doc(
        firestore,
        `users/${action.employeeId}/pendingReport/${action.id}`
      );
      await deleteDoc(docRef);
      onDelete(action.id);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const locationText = action.locations
    .map((location) => location.text)
    .join(", ");

  return (
    <Row className="align-items-center py-2 border-bottom">
      <Col>
        {action.name} {action.surname}
      </Col>
      <Col>{action.date}</Col>
      <Col>{action.workingHours}</Col>
      <Col>{action.maintenanceHours}</Col>
      <Col>{locationText}</Col>
      <Col>
        <Button
          variant="success"
          className="me-2"
          onClick={handleCheckmarkClick}
        >
          Spremi
        </Button>
        <Button variant="danger" onClick={handleXClick}>
          Izbriši
        </Button>
      </Col>
    </Row>
  );
};

export default ActionApprovalItem;
