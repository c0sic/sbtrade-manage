import React, { useState, useEffect } from "react";
import { firestore, auth } from "../../../../../firebase";
import ActionApprovalItem from "./ActionApprovalItem";
import { Row, Col } from "react-bootstrap";

const ActionApprovals = () => {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const fetchEmployeeIdsAndActions = async () => {
      try {
        const orgId = auth.currentUser?.uid;
        if (!orgId) {
          console.error("User is not authenticated");
          return;
        }

        const orgDocRef = firestore.collection("orgs").doc(orgId);
        const orgDoc = await orgDocRef.get();

        if (!orgDoc.exists) {
          console.error("No such document!");
          return;
        }

        const employees = orgDoc.data().employees;

        if (!employees || employees.length === 0) {
          console.log("No employees found.");
          return;
        }

        const actionsList = [];

        for (const empRef of employees) {
          const employeeDocRef = firestore.collection("users").doc(empRef.id);
          const employeeDoc = await employeeDocRef.get();

          if (!employeeDoc.exists) {
            console.error(`No such document for employee ID: ${empRef.id}`);
            continue;
          }

          const { name, surname } = employeeDoc.data();

          const actionsCollectionRef =
            employeeDocRef.collection("pendingReport");
          const actionsSnapshot = await actionsCollectionRef.get();

          actionsSnapshot.forEach((doc) => {
            actionsList.push({
              employeeId: empRef.id,
              id: doc.id,
              name,
              surname,
              ...doc.data(),
            });
          });
        }

        setActions(actionsList);
      } catch (error) {
        console.error("Error fetching employee data and actions:", error);
      }
    };

    fetchEmployeeIdsAndActions();
  }, []);

  const handleDelete = (id) => {
    setActions((prevActions) =>
      prevActions.filter((action) => action.id !== id)
    );
  };

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Odobravanje rada</h3>
      </div>

      <div>
        <Row className="align-items-center py-2 border-bottom">
          <Col>Ime i prezime</Col>
          <Col>Datum</Col>
          <Col>Radni sati</Col>
          <Col>Održavanje</Col>
          <Col>Lokacije</Col>
          <Col></Col>
        </Row>
      </div>

      <div>
        {actions.map((action) => (
          <ActionApprovalItem
            key={action.id}
            action={action}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ActionApprovals;
