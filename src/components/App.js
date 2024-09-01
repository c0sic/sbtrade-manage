import React from "react";
import NotFoundPage from "./NotFoundPage";
import Login from "../pages/public/Login";
import ActionApprovals from "../pages/private/organisation/data-entry/actions/ActionApprovals";
import Employees from "../pages/private/organisation/data-entry/employee/Employees";
import AddEmployee from "../pages/private/organisation/data-entry/employee/AddEmployee";
import EmployeeInfo from "../pages/private/organisation/data-entry/employee/EmployeeInfo";
import EnterSickLeave from "../pages/private/organisation/data-entry/sick-leave/EnterSickLeave";
import EnterVacation from "../pages/private/organisation/data-entry/vacation/EnterVacation";
import CollectiveVacations from "../pages/private/organisation/data-entry/vacation/CollectiveVacations";
import Categories from "../pages/private/organisation/data-entry/category/Categories";
import AddCategory from "../pages/private/organisation/data-entry/category/AddCategory";
import Reports from "../pages/private/organisation/report-view/report/Reports";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "../util/PrivateRoute";
import NavigationSideBar from "../components/NavigationSideBar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationSideBar />
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<ActionApprovals />} />
            <Route path="org/employees" element={<Employees />} />
            <Route path="org/add-employee" element={<AddEmployee />} />
            <Route
              path="org/employee-info/:employeeId"
              element={<EmployeeInfo />}
            />
            <Route path="org/locations" element={<Categories />} />
            <Route path="org/add-location" element={<AddCategory />} />
            <Route path="org/enter-sick-leave" element={<EnterSickLeave />} />
            <Route path="org/enter-vacation" element={<EnterVacation />} />
            <Route path="org/vacations" element={<CollectiveVacations />} />
            <Route path="org/reports" element={<Reports />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" Component={NotFoundPage} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
