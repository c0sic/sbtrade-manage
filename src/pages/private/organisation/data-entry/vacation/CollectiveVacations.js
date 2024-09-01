import React, { useState, useEffect } from "react";
import { firestore, auth } from "../../../../../firebase";
import { Link } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import APP_STRINGS from "../../../../../util/strings";
import CollectiveVacationItem from "./CollectiveVacationItem";

const CollectiveVacations = () => {
  const [collectiveVacations, setCollectiveVacations] = useState([]);
  const [error, setError] = useState("");

  const removeCollectiveVacation = (collectiveVacationId) => {
    setCollectiveVacations((prev) =>
      prev.filter((vacation) => vacation.id !== collectiveVacationId)
    );
  };

  useEffect(() => {
    const fetchCollectiveVacations = async () => {
      try {
        const collectiveVacationRef = firestore
          .collection("orgs")
          .doc(auth.currentUser.uid);

        const collectiveVacationDoc = await collectiveVacationRef.get();
        if (collectiveVacationDoc.exists) {
          const vacationSnapshot = await collectiveVacationRef
            .collection("collectiveVacations")
            .get();

          const vacations = vacationSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCollectiveVacations(vacations);
        } else {
          console.log("Collective vacations not found.");
        }
      } catch (error) {
        setError("Error fetching collective vacations.");
        console.error("Error fetching collective vacations:", error);
      }
    };

    fetchCollectiveVacations();
  }, []);

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center">
        <h3>{APP_STRINGS.VAC_COLLECTIVE_TITLE}</h3>
        <Link to="/org/enter-vacation">
          <Button variant="primary">{APP_STRINGS.VAC_ADD_NEW}</Button>
        </Link>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {collectiveVacations.length > 0 ? (
        <ul className="mt-3">
          {collectiveVacations.map((collectiveVacation) => (
            <CollectiveVacationItem
              key={collectiveVacation.id}
              vacation={collectiveVacation}
              onRemove={removeCollectiveVacation}
            />
          ))}
        </ul>
      ) : (
        <p>{APP_STRINGS.VAC_NO_COLLECTIVE_VACATOINS}</p>
      )}
    </div>
  );
};

export default CollectiveVacations;
