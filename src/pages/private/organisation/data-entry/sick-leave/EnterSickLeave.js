import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import APP_STRINGS from "../../../../../util/strings";
import { firestore, auth } from "../../../../../firebase";

const EnterSickLeave = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    selectedEmployeeId: "",
  });
  const [employees, setEmployees] = useState([]);
  const [overlapError, setOverlapError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("orgs")
      .doc(auth.currentUser.uid)
      .onSnapshot((doc) => {
        if (doc.exists && doc.data().employees) {
          Promise.all(doc.data().employees.map((ref) => ref.get()))
            .then((docs) =>
              setEmployees(docs.map((doc) => ({ id: doc.id, ...doc.data() })))
            )
            .catch((error) => console.log("Error fetching employees: ", error));
        }
      });

    return () => unsubscribe();
  }, []);

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0;
  };

  const checkSickLeaveOverlap = async (employeeId, startDate, endDate) => {
    const sickLeaves = await firestore
      .collection("users")
      .doc(employeeId)
      .collection("sickLeave")
      .get();

    return sickLeaves.docs.some((doc) => {
      const sickLeave = doc.data();
      return startDate <= sickLeave.endDate && endDate >= sickLeave.startDate;
    });
  };

  const checkVacationOverlap = async (employeeId, startDate, endDate) => {
    const vacations = await firestore
      .collection("users")
      .doc(employeeId)
      .collection("vacation")
      .get();

    return vacations.docs.some((doc) => {
      const vacation = doc.data();
      return startDate <= vacation.endDate && endDate >= vacation.startDate;
    });
  };

  const checkCollectiveVacationOverlap = async (startDate, endDate) => {
    const collectiveVacations = await firestore
      .collection("orgs")
      .doc(auth.currentUser.uid)
      .collection("collectiveVacations")
      .get();

    return collectiveVacations.docs.some((doc) => {
      const vacation = doc.data();
      return startDate <= vacation.endDate && endDate >= vacation.startDate;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setOverlapError("");
    setShowSuccessAlert(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setOverlapError("");
    setShowSuccessAlert(false);

    if (formData.endDate <= formData.startDate) {
      setOverlapError(APP_STRINGS.SL_ERROR_END_DATE);
      return;
    }

    if (isWeekend(formData.startDate) || isWeekend(formData.endDate)) {
      setOverlapError(APP_STRINGS.SL_ERROR_WEEKEND);
      return;
    }

    const overlapSickLeave = await checkSickLeaveOverlap(
      formData.selectedEmployeeId,
      formData.startDate,
      formData.endDate
    );
    if (overlapSickLeave) {
      setOverlapError(APP_STRINGS.SL_ERROR_OVERLAP_SL);
      return;
    }

    const overlapVacation = await checkVacationOverlap(
      formData.selectedEmployeeId,
      formData.startDate,
      formData.endDate
    );
    if (overlapVacation) {
      setOverlapError(APP_STRINGS.SL_ERROR_OVERLAP_VAC);
      return;
    }

    const overlapCollectiveVacation = await checkCollectiveVacationOverlap(
      formData.startDate,
      formData.endDate
    );
    if (overlapCollectiveVacation) {
      setOverlapError(APP_STRINGS.SL_ERROR_OVERLAP_COL_VAC);
      return;
    }

    try {
      const docRef = await firestore
        .collection("users")
        .doc(formData.selectedEmployeeId)
        .collection("sickLeave")
        .add({
          startDate: formData.startDate,
          endDate: formData.endDate,
        });

      await firestore
        .collection("users")
        .doc(formData.selectedEmployeeId)
        .collection("sickLeave")
        .doc(docRef.id)
        .update({ id: docRef.id });

      setFormData({
        startDate: "",
        endDate: "",
        selectedEmployeeId: ""
      });
      setShowSuccessAlert(true);
    } catch (error) {
      console.log("Error saving sick leave: ", error);
      setOverlapError(APP_STRINGS.SL_ERROR);
    }
  };

  return (
    <div className="content p-2">
      <h2 className="text-center">{APP_STRINGS.SL_ADD_NEW}</h2>

      <Form onSubmit={handleSave} className="mb-3">
        <Form.Group controlId="startDate">
          <Form.Label>{APP_STRINGS.SL_START_DATE}</Form.Label>
          <Form.Control
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="endDate">
          <Form.Label>{APP_STRINGS.SL_END_DATE}</Form.Label>
          <Form.Control
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="employee">
          <Form.Label>{APP_STRINGS.SL_SELECTE_EMPLOYEE}</Form.Label>
          <Form.Control
            as="select"
            value={formData.selectedEmployeeId}
            onChange={(e) =>
              handleInputChange("selectedEmployeeId", e.target.value)
            }
            required
          >
            <option value="">{APP_STRINGS.SL_SELECTE_EMPLOYEE}</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} {employee.surname}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <div className="mb-3" />

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-100">
            {APP_STRINGS.SL_SAVE}
          </Button>
        </div>

        {showSuccessAlert && (
          <Alert variant="success" className="mt-3 text-center" dismissible>
            {APP_STRINGS.SL_ADDED}
          </Alert>
        )}

        {overlapError && (
          <Alert variant="danger" className="mt-3 text-center" dismissible>
            {overlapError}
          </Alert>
        )}
      </Form>
    </div>
  );
};

export default EnterSickLeave;
