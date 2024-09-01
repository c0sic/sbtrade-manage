import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../../../../../../styles/UserItem.css";
import APP_STRINGS from "../../../../../../util/strings";
import { firestore } from "../../../../../../firebase";

const SickLeaveItem = ({ sickLeave, employeeId, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("hr-HR", options);
  };

  const isBeforeStartDate = () => {
    return new Date() < new Date(sickLeave.startDate);
  };

  const handleDeleteClick = async () => {
    try {
      const vacationsDoc = firestore
        .collection("users")
        .doc(employeeId)
        .collection("sickLeave")
        .doc(sickLeave.id);
      await vacationsDoc.delete();
      onRemove(sickLeave.id);
    } catch (error) {
      console.error("Error on delete click.", error);
    }
  };

  return (
    <div
      key={sickLeave.id}
      className={`w-100 user-item ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="user-details">
        <span className="me-3">
          {APP_STRINGS.EMP_ITEM_SL_START_DATE}:{" "}
          <strong>{formatDate(sickLeave.startDate)}</strong>
        </span>
        <span className="me-3">
          {APP_STRINGS.EMP_ITEM_SL_END_DATE}:{" "}
          <strong>{formatDate(sickLeave.endDate)}</strong>
        </span>
      </div>
      <div className="action-buttons">
        {isHovered && isBeforeStartDate() && (
          <Button variant="link" className="mr-2" onClick={handleDeleteClick}>
            {APP_STRINGS.EMP_DELETE}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SickLeaveItem;
