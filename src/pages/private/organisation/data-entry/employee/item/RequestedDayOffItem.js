import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import { firestore } from "../../../../../../firebase";

const RequestedDayOffItem = ({ item, onButtonClick }) => {
  const handleApproveClick = async () => {
    try {
      const ref = firestore
        .collection("users")
        .doc(item.employeeId)
        .collection("requestedDayOff")
        .doc(item.id);

      await ref.update({ status: "Approved" });

      const updatedDoc = await ref.get();

      if (updatedDoc.exists) {
        const { id, date, name } = updatedDoc.data();

        const sickLeaveRef = firestore
          .collection("users")
          .doc(item.employeeId)
          .collection("vacation")
          .doc(id);

        await sickLeaveRef.set({ id, startDate: date, endDate: date, name, totalDays: 1 });
      }

      onButtonClick(item.id);
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };
  const hadnleDenyClick = async () => {
    try {
      const ref = firestore
        .collection("users")
        .doc(item.employeeId)
        .collection("requestedDayOff")
        .doc(item.id);

      await ref.update({ status: "Denied" });
      onButtonClick(item.id);
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <Row className="align-items-center py-2 border-bottom">
      <Col>{item.name}</Col>
      <Col>{item.date}</Col>
      <Col>
        <Button variant="success" className="me-2" onClick={handleApproveClick}>
          Prihvati
        </Button>
        <Button variant="danger" onClick={hadnleDenyClick}>
          Odbij
        </Button>
      </Col>
    </Row>
  );
};

export default RequestedDayOffItem;
