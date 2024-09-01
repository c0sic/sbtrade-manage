import React, { useState, useEffect } from "react";
import { firestore, auth } from "../../../../../firebase";
import EmployeeItem from "./EmployeeItem";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import APP_STRINGS from "../../../../../util/strings";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const orgRef = firestore.collection("orgs").doc(auth.currentUser.uid);

    const unsubscribe = orgRef.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data().employees || [];
        const employeeDataPromises = data.map(async (employeeRef) => {
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

    return () => unsubscribe();
  }, []);

  const updateEmployeeList = (employeeId, updatedData) => {
    setEmployees((prevEmployee) =>
      prevEmployee.map((employee) =>
        employee.id === employeeId ? { ...employee, ...updatedData } : employee
      )
    );
  };

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center">
        <h3>{APP_STRINGS.EMP_EMPLOYEES}</h3>
        <Link to="/org/add-employee">
          <Button variant="primary">{APP_STRINGS.EMP_ADD_NEW}</Button>
        </Link>
      </div>
      <ul className="mt-3">
        {employees.map((employee) => (
          <Link
            key={employee.id}
            style={{ textDecoration: "none", color: "inherit" }}
            to={`/org/employee-info/${employee.id}`}
          >
            <EmployeeItem
              key={employee.id}
              employee={employee}
              updateEmployeeList={updateEmployeeList}
            />
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Employees;
