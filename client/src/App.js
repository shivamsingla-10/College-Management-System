import React from "react";
import { Routes, Route } from "react-router-dom";
import AddAdmin from "./components/admin/addAdmin/AddAdmin";
import AddDepartment from "./components/admin/addDepartment/AddDepartment";
import AddFaculty from "./components/admin/addFaculty/AddFaculty";
import AddStudent from "./components/admin/addStudent/AddStudent";
import AddSubject from "./components/admin/addSubject/AddSubject";
import AdminHome from "./components/admin/AdminHome";

import GetFaculty from "./components/admin/getFaculty/GetFaculty";
import GetStudent from "./components/admin/getStudent/GetStudent";
import GetSubject from "./components/admin/getSubject/GetSubject";
import AdminProfile from "./components/admin/profile/Profile";
import AdminFirstTimePassword from "./components/admin/profile/update/firstTimePassword/FirstTimePassword";
import AdminPassword from "./components/admin/profile/update/password/Password";

import AdminUpdate from "./components/admin/profile/update/Update";
import CreateTest from "./components/faculty/createTest/CreateTest";
import FacultyHome from "./components/faculty/FacultyHome";
import MarkAttendance from "./components/faculty/markAttendance/MarkAttendance";
import FacultyProfile from "./components/faculty/profile/Profile";
import FacultyFirstTimePassword from "./components/faculty/profile/update/firstTimePassword/FirstTimePassword";
import FacultyPassword from "./components/faculty/profile/update/password/Password";
import FacultyUpdate from "./components/faculty/profile/update/Update";
import UploadMarks from "./components/faculty/uploadMarks/UploadMarks";
import AdminLogin from "./components/login/adminLogin/AdminLogin";
import FacultyLogin from "./components/login/facultyLogin/FacultyLogin";
import Login from "./components/login/Login";

import StudentLogin from "./components/login/studentLogin/StudentLogin";
import StudentFirstTimePassword from "./components/student/profile/update/firstTimePassword/FirstTimePassword";
import StudentHome from "./components/student/StudentHome";
import StudentProfile from "./components/student/profile/Profile";
import StudentUpdate from "./components/student/profile/update/Update";
import StudentPassword from "./components/student/profile/update/password/Password";
import SubjectList from "./components/student/subjectList/SubjectList";
import TestResult from "./components/student/testResult/TestResult";
import Attendance from "./components/student/attendance/Attendance";
import DeleteAdmin from "./components/admin/deleteAdmin/DeleteAdmin";
import DeleteDepartment from "./components/admin/deleteDepartment/DeleteDepartment";
import DeleteFaculty from "./components/admin/deleteFaculty/DeleteFaculty";
import DeleteStudent from "./components/admin/deleteStudent/DeleteStudent";
import DeleteSubject from "./components/admin/deleteSubject/DeleteSubject";
import CreateNotice from "./components/admin/createNotice/CreateNotice";
import PrivateRoute from "./utils/PrivateRoute";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />

      {/* Admin  */}

      <Route path="/login/adminlogin" element={<AdminLogin />} />
      <Route
        path="/admin/home"
        element={
          <PrivateRoute>
            <AdminHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <PrivateRoute>
            <AdminProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/update"
        element={
          <PrivateRoute>
            <AdminUpdate />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/update/password"
        element={
          <PrivateRoute>
            <AdminPassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/updatepassword"
        element={
          <PrivateRoute>
            <AdminFirstTimePassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/createnotice"
        element={
          <PrivateRoute>
            <CreateNotice />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/addadmin"
        element={
          <PrivateRoute>
            <AddAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/deleteadmin"
        element={
          <PrivateRoute>
            <DeleteAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/adddepartment"
        element={
          <PrivateRoute>
            <AddDepartment />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/deletedepartment"
        element={
          <PrivateRoute>
            <DeleteDepartment />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/addfaculty"
        element={
          <PrivateRoute>
            <AddFaculty />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/deletefaculty"
        element={
          <PrivateRoute>
            <DeleteFaculty />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/deletestudent"
        element={
          <PrivateRoute>
            <DeleteStudent />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/deletesubject"
        element={
          <PrivateRoute>
            <DeleteSubject />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/allfaculty"
        element={
          <PrivateRoute>
            <GetFaculty />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/addstudent"
        element={
          <PrivateRoute>
            <AddStudent />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/addsubject"
        element={
          <PrivateRoute>
            <AddSubject />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/allsubject"
        element={
          <PrivateRoute>
            <GetSubject />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/allstudent"
        element={
          <PrivateRoute>
            <GetStudent />
          </PrivateRoute>
        }
      />

      {/* Faculty  */}

      <Route path="/login/facultylogin" element={<FacultyLogin />} />
      <Route
        path="/faculty/home"
        element={
          <PrivateRoute>
            <FacultyHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty/password"
        element={
          <PrivateRoute>
            <FacultyFirstTimePassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty/profile"
        element={
          <PrivateRoute>
            <FacultyProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty/update"
        element={
          <PrivateRoute>
            <FacultyUpdate />
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty/update/password"
        element={
          <PrivateRoute>
            <FacultyPassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty/createtest"
        element={
          <PrivateRoute>
            <CreateTest />
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty/uploadmarks"
        element={
          <PrivateRoute>
            <UploadMarks />
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty/markattendance"
        element={
          <PrivateRoute>
            <MarkAttendance />
          </PrivateRoute>
        }
      />

      {/* Student  */}

      <Route path="/login/studentlogin" element={<StudentLogin />} />
      <Route
        path="/student/home"
        element={
          <PrivateRoute>
            <StudentHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/password"
        element={
          <PrivateRoute>
            <StudentFirstTimePassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <PrivateRoute>
            <StudentProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/update"
        element={
          <PrivateRoute>
            <StudentUpdate />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/update/password"
        element={
          <PrivateRoute>
            <StudentPassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/subjectlist"
        element={
          <PrivateRoute>
            <SubjectList />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/testresult"
        element={
          <PrivateRoute>
            <TestResult />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <PrivateRoute>
            <Attendance />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
