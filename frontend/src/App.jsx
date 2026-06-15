import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SelectGroup from "./pages/SelectGroup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/select-group"
          element={<SelectGroup />}
        />

        <Route
          path="/student"
          element={
            <StudentDashboard />
          }
        />

        <Route
          path="/lecturer"
          element={
            <LecturerDashboard />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminDashboard />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;