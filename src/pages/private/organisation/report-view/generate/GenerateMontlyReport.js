import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { firestore, auth } from "../../../../../firebase";
import PDFFile from "./PDFFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import APP_STRINGS from "../../../../../util/strings";

const GenerateMonthlyReport = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [contractNumber, setContractNumber] = useState("");
  const [contractTitle, setContractTitle] = useState("");
  const [contractUser, setContractUser] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [employees, setEmployees] = useState([]);
  const [pdfLink, setPdfLink] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const years = [currentYear - 1, currentYear, currentYear + 1];

  const getEndUserActivities = async () => {
    try {
      const employeeActivitiesRef = firestore
        .collection("users")
        .doc(employeeId)
        .collection("endUserActivities");

      const snapshot = await employeeActivitiesRef.get();

      if (snapshot.empty) {
        setShowErrorAlert(true);
        return;
      }

      const activitiesByUser = {};
      snapshot.forEach((doc) => {
        const activity = { id: doc.id, ...doc.data() };

        const activityDate = new Date(activity.date.seconds * 1000);
        const activityMonth = activityDate.getMonth() + 1;
        const activityYear = activityDate.getFullYear();

        if (activityYear == selectedYear && activityMonth == selectedMonth) {
          const userKey = activity.endUser.id;
          if (!activitiesByUser[userKey]) {
            activitiesByUser[userKey] = new Set([activity.description]);
          } else {
            activitiesByUser[userKey].add(activity.description);
          }
        }
      });
      return activitiesByUser;
    } catch (error) {
      console.error("Error while getting data:", error);
      return null;
    }
  };

  useEffect(() => {
    const orgRef = firestore.collection("orgs").doc(auth.currentUser.uid);
    const userRef = firestore.collection("users").doc(auth.currentUser.uid);

    const unsubscribeOrg = orgRef.onSnapshot((orgDoc) => {
      if (orgDoc.exists) {
        try {
          setContractNumber(orgDoc.data().contractNumber);
          setContractTitle(orgDoc.data().contractTitle);
        } catch (e) {
          console.error("There is an error: ", e);
        }

        const orgData = orgDoc.data().employees || [];
        const employeeDataPromises = orgData.map(async (employeeRef) => {
          const employeeDoc = await employeeRef.get();
          return employeeDoc.data();
        });

        Promise.all(employeeDataPromises)
          .then((employeesData) => {
            setEmployees(employeesData);
          })
          .catch((error) => {
            console.log("Error fetching employees: ", error);
          });
      }
    });

    const unsubscribeUser = userRef.onSnapshot((userDoc) => {
      if (userDoc.exists) {
        try {
          setContractUser(`${userDoc.data().name} ${userDoc.data().surname}`);
        } catch (e) {
          console.error("There is an error: ", e);
        }
      }
    });

    Promise.all([unsubscribeOrg, unsubscribeUser]).catch((error) => {
      console.log("Error fetching data: ", error);
    });

    return () => {
      unsubscribeOrg();
      unsubscribeUser();
    };
  }, []);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setShowErrorAlert(false);
    try {
      const endUserActivities = await getEndUserActivities();
      if (endUserActivities == null) {
        console.error("No activities.");
        return;
      }

      const pdfData = (
        <PDFFile
          year={selectedYear}
          month={selectedMonth}
          contractNumber={contractNumber}
          contractTitle={contractTitle}
          contractUser={contractUser}
          employee={employees.find((emp) => emp.id === employeeId)}
          endUserActivities={endUserActivities}
        />
      );

      setPdfLink(pdfData);
      setShowAlert(true);
    } catch (e) {
      console.error("Cannot generate report. " + e);
    }
  };

  return (
    <div className="content p-2">
      <h2>{APP_STRINGS.GMR_GENERATE_MONTHLY_REPORT}</h2>
      <Form onSubmit={handleGenerateReport}>
        <Form.Group controlId="formContractNumber">
          <Form.Label>{APP_STRINGS.GMR_CONTRACT_NUMBER}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.GMR_ENTER_CONTRACT_NUMBER}
            value={contractNumber}
            onChange={(e) => setContractNumber(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formContractTitle">
          <Form.Label>{APP_STRINGS.GMR_CONTRACT_NAME}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.GMR_ENTER_CONTRACT_NAME}
            value={contractTitle}
            onChange={(e) => setContractTitle(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="fornContractUser">
          <Form.Label>{APP_STRINGS.GMR_CONTRACT_USER}</Form.Label>
          <Form.Control
            type="text"
            placeholder={APP_STRINGS.GMR_ENTER_CONTRACT_USER}
            value={contractUser}
            onChange={(e) => setContractUser(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formEmployee">
          <Form.Label>{APP_STRINGS.GMR_SELECT_EMPLOYEE}</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          >
            <option value="">{APP_STRINGS.GMR_SELECT_EMPLOYEE}</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} {employee.surname}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formMonth">
          <Form.Label>{APP_STRINGS.GMR_SELECT_MONTH}</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setSelectedMonth(e.target.value)}
            value={selectedMonth}
            required
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <div className="mb-3" />

        <Form.Group controlId="formYear">
          <Form.Label>{APP_STRINGS.GMR_SELECT_YEAR}</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
            required
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <div className="mb-3" />

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-100">
            {APP_STRINGS.GMR_SAVE}
          </Button>
        </div>

        <div className="mb-3" />

        {pdfLink && (
          <div className="d-flex justify-content-center">
            <PDFDownloadLink document={pdfLink} fileName="monthly_report.pdf">
              {({ blob, url, loading, error }) =>
                loading
                  ? APP_STRINGS.GMR_DOC_LOADING
                  : APP_STRINGS.GMR_DOWNLOAD_PDF
              }
            </PDFDownloadLink>
          </div>
        )}

        <div className="mb-3" />

        {showAlert && (
          <Alert
            variant="success"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {APP_STRINGS.GMR_PDF_READY}
          </Alert>
        )}

        {showErrorAlert && (
          <Alert
            variant="danger"
            onClose={() => setShowErrorAlert(false)}
            dismissible
          >
            {APP_STRINGS.GMR_ERROR}
          </Alert>
        )}
      </Form>
    </div>
  );
};

export default GenerateMonthlyReport;
