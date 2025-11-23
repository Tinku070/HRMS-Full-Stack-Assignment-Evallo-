import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Teams from "./pages/Teams";
import Assign from "./pages/Assign";
import Logs from "./pages/Logs";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<><Navbar /><Dashboard/></>} />
        <Route path="/employees" element={<><Navbar /><Employees/></>} />
        <Route path="/teams" element={<><Navbar /><Teams/></>} />
        <Route path="/assign" element={<><Navbar /><Assign/></>} />
        <Route path="/logs" element={<><Navbar /><Logs/></>} />
      </Route>
    </Routes>
  );
}

export default App;
