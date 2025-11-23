import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
  const navigate = useNavigate();
  function logout(){
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/assign">Assign</Link>
        <Link to="/logs">Logs</Link>
      </div>
      <button className="logout" onClick={logout}>Logout</button>
    </div>
  );
}
