import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { firestore, auth } from "../../../../../firebase";
import APP_STRINGS from "../../../../../util/strings";

const EnterVacation = () => {
  const [vacationType, setVacationType] = useState("individual");
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    selectedEmployeeId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("orgs")
      .doc(auth.currentUser.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const employeeRefs = doc.data().employees || [];
          Promise.all(employeeRefs.map((ref) => ref.get()))
            .then((docs) =>
              setEmployees(docs.map((doc) => ({ id: doc.id, ...doc.data() })))
            )
            .catch((error) => console.log("Error fetching employees: ", error));
        }
      });

    return () => unsubscribe();
  }, []);

  const calculateVacationDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const timeDifference = Math.abs(end - start);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    let totalDays = daysDifference;
    for (let i = 0; i <= daysDifference; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);

      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        totalDays--;
      }
    }

    return totalDays + 1;
  };

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0;
  };

  const checkDateOverlap = async (start, end, isCollective) => {
    let hasOverlap = false;

    const collectiveVacationsRef = firestore
      .collection("orgs")
      .doc(auth.currentUser.uid)
      .collection("collectiveVacations");

    const collectiveSnapshot = await collectiveVacationsRef
      .where("startDate", "<=", end)
      .get();
    hasOverlap = collectiveSnapshot.docs.some((doc) => {
      const vacation = doc.data();
      return vacation.endDate >= start;
    });

    if (!hasOverlap && !isCollective) {
      const individualVacationsRef = firestore
        .collection("users")
        .doc(formData.selectedEmployeeId)
        .collection("vacation");

      const individualSnapshot = await individualVacationsRef
        .where("startDate", "<=", end)
        .get();
      hasOverlap = individualSnapshot.docs.some((doc) => {
        const vacation = doc.data();
        return vacation.endDate >= start;
      });
    }

    return hasOverlap;
  };
  const enterVacation = async (isCollective) => {
    let vacationRef;
    if (isCollective) {
      vacationRef = firestore
        .collection("orgs")
        .doc(auth.currentUser.uid)
        .collection("collectiveVacations");
    } else {
      vacationRef = firestore
        .collection("users")
        .doc(formData.selectedEmployeeId)
        .collection("vacation");
    }

    const addedVacationRef = await vacationRef.add({
      startDate: formData.startDate,
      endDate: formData.endDate,
      name: formData.name,
      totalDays: calculateVacationDays(),
    });
    const id = addedVacationRef.id;
    await vacationRef.doc(id).update({ id: id });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { startDate, endDate } = formData;

    if (endDate <= startDate) {
      setErrorMessage(APP_STRINGS.VAC_ERROR_END_DATE);
      setShowAlert(true);
      return;
    }

    if (isWeekend(startDate) || isWeekend(endDate)) {
      setErrorMessage(APP_STRINGS.VAC_ERROR_WEEKENDS);
      setShowAlert(true);
      return;
    }

    const overlapCollective = await checkDateOverlap(startDate, endDate, true);
    if (overlapCollective) {
      setErrorMessage(APP_STRINGS.VAC_ERROR_COL_OVERLAP);
      setShowAlert(true);
      return;
    }

    if (vacationType === "individual") {
      const overlapIndividual = await checkDateOverlap(
        startDate,
        endDate,
        false
      );
      if (overlapIndividual) {
        setErrorMessage(APP_STRINGS.VAC_ERROR_IND_OVERLAP);
        setShowAlert(true);
        return;
      }
    }

    enterVacation(vacationType === "collective")
      .then(() => {
        setShowAlert(true);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error saving vacation: ", error);
        setErrorMessage(APP_STRINGS.VAC_ERROR_UNEXPECTED);
        setShowAlert(true);
      });
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      selectedEmployeeId: "",
    });
  };

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/org/vacations">
          <Button variant="secondary">{APP_STRINGS.VAC_BACK}</Button>
        </Link>
        <h2 className="text-center mb-3">{APP_STRINGS.VAC_ADD_NEW}</h2>
        <div style={{ width: "110px" }}></div>
      </div>

      <Form onSubmit={handleSave}>
        <Form.Group controlId="vacationType">
          <Form.Label>{APP_STRINGS.VAC_VACATION_TYPE}</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label={APP_STRINGS.VAC_INDIVIDUAL}
              name="vacationType"
              id="individual"
              checked={vacationType === "individual"}
              onChange={() => setVacationType("individual")}
            />
            <Form.Check
              type="radio"
              label={APP_STRINGS.VAC_COLLECTIVE}
              name="vacationType"
              id="collective"
              checked={vacationType === "collective"}
              onChange={() => setVacationType("collective")}
            />
          </div>
        </Form.Group>

        <Form.Group controlId="name" className="mb-3">
          <Form.Label>{APP_STRINGS.VAC_NAME}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.VAC_ENTER_NAME}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="startDate" className="mb-3">
          <Form.Label>{APP_STRINGS.VAC_START_DATE}</Form.Label>
          <Form.Control
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </Form.Group>

        <Form.Group controlId="endDate" className="mb-3">
          <Form.Label>{APP_STRINGS.VAC_END_DATE}</Form.Label>
          <Form.Control
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </Form.Group>

        {vacationType === "individual" && (
          <Form.Group controlId="employee" className="mb-3">
            <Form.Label>{APP_STRINGS.VAC_SELECT_EMPLOYEE}</Form.Label>
            <Form.Control
              as="select"
              value={formData.selectedEmployeeId}
              onChange={(e) =>
                handleInputChange("selectedEmployeeId", e.target.value)
              }
              required
            >
              <option value="">{APP_STRINGS.VAC_SELECT_EMPLOYEE}</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} {employee.surname}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-100">
            {APP_STRINGS.VAC_SAVE}
          </Button>
        </div>

        {showAlert && (
          <Alert
            variant={errorMessage ? "danger" : "success"}
            className="text-center mt-3"
            dismissible
            onClose={() => setShowAlert(false)}
          >
            {errorMessage || APP_STRINGS.VAC_SUCCESS_MSG}
          </Alert>
        )}
      </Form>
    </div>
  );
};

export default EnterVacation;
