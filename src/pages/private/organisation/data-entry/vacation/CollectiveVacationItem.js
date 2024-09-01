import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../../../../../styles/UserItem.css";
import APP_STRINGS from "../../../../../util/strings";
import { firestore, auth } from "../../../../../firebase";

const CollectiveVacationItem = ({ vacation, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("hr-HR", options);
  };

  const handleDeleteClick = async () => {
    try {
      const vacationsDoc = firestore
        .collection("orgs")
        .doc(auth.currentUser.uid)
        .collection("collectiveVacations")
        .doc(vacation.id);
      await vacationsDoc.delete();
      onRemove(vacation.id);
    } catch (error) {
      console.error("Error on delete click.", error);
    }
  };

  return (
    <div
      key={vacation.id}
      className={`w-100 user-item ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="user-details">
        <span className="me-3 mb-2 d-inline-block">
          {APP_STRINGS.EMP_ITEM_VAC_NAME}: <strong>{vacation.name}</strong>
        </span>
        <span className="me-3 mb-2 d-inline-block">
          {APP_STRINGS.EMP_ITEM_VAC_START_DATE}:{" "}
          <strong>{formatDate(vacation.startDate)}</strong>
        </span>
        <span className="mb-2 d-inline-block">
          {APP_STRINGS.EMP_ITEM_VAC_END_DATE}:{" "}
          <strong>{formatDate(vacation.endDate)}</strong>
        </span>
      </div>
      <div className="action-buttons">
        {isHovered && (
          <Button variant="link" className="mr-2" onClick={handleDeleteClick}>
            {APP_STRINGS.EMP_DELETE}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CollectiveVacationItem;
