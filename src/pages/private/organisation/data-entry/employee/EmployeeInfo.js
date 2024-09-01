import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { firestore } from "../../../../../firebase";
import SickLeaveItem from "./item/SickLeaveItem";
import VacationItem from "./item/VacationItem";
import RequestedVacationItem from "./item/RequestedVacationItem";
import RequestedSickDaysItem from "./item/RequestedSickDaysItem";
import RequestedDayOffItem from "./item/RequestedDayOffItem";
import APP_STRINGS from "../../../../../util/strings";

const EmployeeInfo = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [sickLeaves, setSickLeaves] = useState([]);
  const [vacations, setVacations] = useState([]);

  const [requestedVacations, setRequestedVacations] = useState([]);
  const [requestedDayOff, setRequestedDayOff] = useState([]);
  const [requestedSickDays, setRequestedSickDays] = useState([]);

  const removeVacation = (vacationId) => {
    setVacations((prevVacations) =>
      prevVacations.filter((vacation) => vacation.id !== vacationId)
    );
  };

  const removeSickLeave = (sickLeaveId) => {
    setSickLeaves((prevSickLeaves) =>
      prevSickLeaves.filter((sickLeave) => sickLeave.id !== sickLeaveId)
    );
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const userRef = firestore.collection("users").doc(employeeId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          setEmployee(userDoc.data());
          const sickLeavesSnap = await userRef.collection("sickLeave").get();
          setSickLeaves(sickLeavesSnap.docs.map((doc) => doc.data()));

          const vacationsSnap = await userRef.collection("vacation").get();
          setVacations(vacationsSnap.docs.map((doc) => doc.data()));
        } else {
          console.log("Employee not found");
        }
      } catch (error) {
        console.error("Error fetching employee data: ", error);
      }
    };

    const fetchRequestedVacations = async () => {
      try {
        const ref = firestore
          .collection("users")
          .doc(employeeId)
          .collection("requestedVacation")
          .where("status", "==", "InWaiting"); // Add where clause to filter by status
        const requestedVacationsSnap = await ref.get();
        setRequestedVacations(
          requestedVacationsSnap.docs.map((doc) => ({
            ...doc.data(),
            employeeId, // Add employeeId to each item
          }))
        );
      } catch (error) {
        console.error("Error fetching requested vacations: ", error);
      }
    };

    const fetchRequestedDayOff = async () => {
      try {
        const ref = firestore
          .collection("users")
          .doc(employeeId)
          .collection("requestedDayOff")
          .where("status", "==", "InWaiting"); // Add where clause to filter by status
        const requestedDayOffSnap = await ref.get();
        setRequestedDayOff(
          requestedDayOffSnap.docs.map((doc) => ({
            ...doc.data(),
            employeeId, // Add employeeId to each item
          }))
        );
      } catch (error) {
        console.error("Error fetching requested day off: ", error);
      }
    };

    const fetchRequestedSickDays = async () => {
      try {
        const ref = firestore
          .collection("users")
          .doc(employeeId)
          .collection("requestedSickLeave")
          .where("status", "==", "InWaiting"); // Add where clause to filter by status
        const requestedSickDaysSnap = await ref.get();
        setRequestedSickDays(
          requestedSickDaysSnap.docs.map((doc) => ({
            ...doc.data(),
            employeeId, // Add employeeId to each item
          }))
        );
      } catch (error) {
        console.error("Error fetching requested sick days: ", error);
      }
    };

    const fetchAllData = async () => {
      await fetchEmployeeData();
      await fetchRequestedVacations();
      await fetchRequestedDayOff();
      await fetchRequestedSickDays();
    };

    fetchAllData();

    return () => {};
  }, [employeeId]);

  const handleRequestedVacationButtonClick = (id) => {
    setRequestedVacations((prevVac) =>
      prevVac.filter((vac) => vac.id !== id || vac.status !== "InWaiting")
    );
  };

  const handleRequestedSickLeaveButtonClick = (id) => {
    setRequestedSickDays((prevVac) =>
      prevVac.filter((vac) => vac.id !== id || vac.status !== "InWaiting")
    );
  };

  const handleRequestedDayOffButtonClick = (id) => {
    setRequestedDayOff((prevVac) =>
      prevVac.filter((vac) => vac.id !== id || vac.status !== "InWaiting")
    );
  };

  return (
    <div className="content p-2">
      {employee ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Link to="/org/employees">
              <Button variant="secondary">{APP_STRINGS.EMP_BACK}</Button>
            </Link>
            <h2 className="text-center">{APP_STRINGS.EMP_INFO}</h2>
            <div style={{ width: "110px" }}></div>
          </div>
          <div>
            {APP_STRINGS.EMP_NAME}: {employee.name}
          </div>
          <div>
            {APP_STRINGS.EMP_SURNAME}: {employee.surname}
          </div>
          <div className="mb-3" />
          <h4>{APP_STRINGS.EMP_SICK_LEAVE}</h4>
          {sickLeaves.length > 0 ? (
            sickLeaves.map((sickLeave) => (
              <SickLeaveItem
                key={sickLeave.id}
                sickLeave={sickLeave}
                employeeId={employeeId}
                onRemove={removeSickLeave}
              />
            ))
          ) : (
            <p>{APP_STRINGS.EMP_NO_SICK_LEAVES}</p>
          )}
          <div className="mb-3" />
          <h4>{APP_STRINGS.EMP_VACCATION}</h4>
          {vacations.length > 0 ? (
            vacations.map((vacation) => (
              <VacationItem
                key={vacation.id}
                vacation={vacation}
                employeeId={employeeId}
                onRemove={removeVacation}
              />
            ))
          ) : (
            <p>{APP_STRINGS.EMP_NO_VACCATIONS}</p>
          )}
          <div className="mb-3" />
          <h4>Zatraženi godišnji</h4>
          <div>
            <Row className="align-items-center py-2 border-bottom">
              <Col>Ime</Col>
              <Col>Početni Datum</Col>
              <Col>Završni Datum</Col>
              <Col>Ukupno dana</Col>
              <Col></Col>
            </Row>
          </div>
          <div>
            {requestedVacations.map((requestedVac) => (
              <RequestedVacationItem
                key={requestedVac.id}
                item={requestedVac}
                onButtonClick={handleRequestedVacationButtonClick}
              />
            ))}
          </div>
          <div className="mb-3" />

          <h4>Zatraženi slobodni dani</h4>
          <div className="mb-3" />
          <div>
            <Row className="align-items-center py-2 border-bottom">
              <Col>Ime</Col>
              <Col>Datum</Col>
              <Col></Col>
            </Row>
          </div>
          <div>
            {requestedDayOff.map((requestedDO) => (
              <RequestedDayOffItem
                key={requestedDO.id}
                item={requestedDO}
                onButtonClick={handleRequestedDayOffButtonClick}
              />
            ))}
          </div>

          <div className="mb-3" />
          <h4>Zatražena bolovanja</h4>
          <div>
            <Row className="align-items-center py-2 border-bottom">
              <Col>Ime</Col>
              <Col>Početni Datum</Col>
              <Col>Završni Datum</Col>
              <Col>Ukupno dana</Col>
              <Col></Col>
            </Row>
          </div>
          <div>
            {requestedSickDays.map((requestedSD) => (
              <RequestedSickDaysItem
                key={requestedSD.id}
                item={requestedSD}
                onButtonClick={handleRequestedSickLeaveButtonClick}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>{APP_STRINGS.EMP_LOADING}</div>
      )}
    </div>
  );
};

export default EmployeeInfo;
