import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { auth, realtTimeDatabase } from "../../../../../firebase";
import APP_STRINGS from "../../../../../util/strings";
import "../../../../../styles/Reports.css";

const Reports = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [visibleTables, setVisibleTables] = useState({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({
    employeeUserNameSurname: "",
    day: "",
  });

  const fetchData = async (year) => {
    const organisationId = auth.currentUser.uid;
    const databaseRef = realtTimeDatabase.ref(
      `reports/${organisationId}/${year}`
    );
    const snapshot = await databaseRef.once("value");
    const yearData = snapshot.val();

    if (yearData) {
      const monthlyDataArray = [];
      const initialVisibleTables = {};

      for (let month = 1; month <= 12; month++) {
        const monthData = [];
        const monthKeyWithZero = month.toString().padStart(2, "0");
        const monthKeyWithoutZero = month.toString();

        const monthKeyToUse = yearData[monthKeyWithZero]
          ? monthKeyWithZero
          : monthKeyWithoutZero;

        if (yearData[monthKeyToUse]) {
          Object.keys(yearData[monthKeyToUse]).forEach((userIdKey) => {
            const userDays = yearData[monthKeyToUse][userIdKey];

            Object.keys(userDays).forEach((day) => {
              const dayData = userDays[day];

              Object.keys(dayData).forEach((itemId) => {
                monthData.push({
                  id: itemId,
                  day,
                  ...dayData[itemId],
                });
              });
            });
          });
        }

        monthlyDataArray.push({ month: monthKeyToUse, data: monthData });
        initialVisibleTables[monthKeyToUse] =
          month === new Date().getMonth() + 1;
      }

      console.log("Data: " + monthlyDataArray)
      setMonthlyData(monthlyDataArray);
      setVisibleTables(initialVisibleTables);
    }
  };

  useEffect(() => {
    setVisibleTables({});
    fetchData(currentYear);

    return () => {
      const organisationId = auth.currentUser.uid;
      const databaseRef = realtTimeDatabase.ref(
        `reports/${organisationId}/${currentYear}`
      );
      databaseRef.off();
    };
  }, [currentYear]);

  const toggleTableVisibility = (month) => {
    setVisibleTables((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const handleYearChange = (direction) => {
    setCurrentYear((prevYear) => prevYear + direction);
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const employeeUserFullName =
        `${item.employee.name} ${item.employee.surname}`.toLowerCase();
      return (
        employeeUserFullName.includes(
          filters.employeeUserNameSurname.toLowerCase()
        ) &&
        item.day.includes(filters.day)
      );
    });
  };

  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <div className="content p-2">
      <div className="fixedPart">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Button
            variant="outline-secondary"
            onClick={() => handleYearChange(-1)}
          >
            {APP_STRINGS.REP_PREVIOUS_YEAR}
          </Button>
          <h3>{currentYear}</h3>
          <Button
            variant="outline-secondary"
            onClick={() => handleYearChange(1)}
          >
            {APP_STRINGS.REP_NEXT_YEAR}
          </Button>
        </div>
        <Form>
          <div className="mb-2" />
          <Form.Group as={Form.Col}>
            <Form.Control
              type="text"
              placeholder={APP_STRINGS.REP_FITLER_EMPLOYEE}
              onChange={(e) =>
                updateFilter("employeeUserNameSurname", e.target.value)
              }
              value={filters.employeeUserNameSurname}
            />
          </Form.Group>
          <div className="mb-2" />
          <Form.Group as={Form.Col}>
            <Form.Control
              type="text"
              placeholder={APP_STRINGS.REP_FILTER_DAY}
              onChange={(e) => updateFilter("day", e.target.value)}
              value={filters.day}
            />
          </Form.Group>
        </Form>
      </div>
      <div className="scrollablePart">
        {monthlyData.map((monthItem) => (
          <div key={monthItem.month}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4>
                {new Date(`${currentYear}-${monthItem.month}-01`)
                  .toLocaleString("hr-HR", { month: "long" })
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </h4>
              <Button
                variant="outline-secondary"
                onClick={() => toggleTableVisibility(monthItem.month)}
              >
                {visibleTables[monthItem.month]
                  ? APP_STRINGS.REP_HIDE_TABLE
                  : APP_STRINGS.REP_SHOW_TABLE}
              </Button>
            </div>
            {visibleTables[monthItem.month] && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{APP_STRINGS.REP_TABLE_DAY}</th>
                    <th>{APP_STRINGS.REP_TABLE_DESCRIPTION}</th>
                    <th>Radni sati</th>
                    <th>Održavanje</th>
                    <th>{APP_STRINGS.REP_TABLE_EMPLOYEE}</th>
                  </tr>
                </thead>
                <tbody>
                  {filterData(monthItem.data).map((item, index) => (
                    <tr key={index}>
                      <td>{item.day}</td>
                      <td style={{ wordWrap: "break-word", maxWidth: "200px" }}>
                        {item.location.map((desc) => desc.text).join(", ")}
                      </td>
                      <td>{item.workingHours}</td>
                      <td>{item.maintenanceHours}</td>
                      <td>{`${item.employee.name} ${item.employee.surname}`}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <div style={{ height: "16px" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
