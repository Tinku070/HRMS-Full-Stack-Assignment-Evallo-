import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Employees(){
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ first_name:"", last_name:"", email:"", phone:"" });

  useEffect(()=>{ load(); },[]);
  async function load(){
    try{ const res = await api.get("/employees"); setEmployees(res.data); }catch(e){}
  }

  async function createEmployee(){
    try{
      await api.post("/employees", form);
      setForm({ first_name:"", last_name:"", email:"", phone:"" });
      load();
    }catch(e){ alert("Failed to create"); }
  }

  return (
    <div className="container page">
      <h2 style={{width:"100%", textAlign:"left"}}>Employees</h2>

      <div className="card" style={{maxWidth:760, margin:"0 auto"}}>
        <h3 style={{marginTop:0}}>Add Employee</h3>
        <div className="form-grid" style={{marginTop:10}}>
          <input placeholder="First name" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} />
          <input placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        </div>
        <div style={{marginTop:14, textAlign:"right"}}>
          <button className="btn" onClick={createEmployee}>Create Employee</button>
        </div>
      </div>

      <div className="card" style={{marginTop:20, maxWidth:760, marginLeft:"auto", marginRight:"auto"}}>
        <h3 style={{marginTop:0}}>Employee List</h3>
        <ul>
          {employees.map(e=>(
            <li key={e.id} style={{padding:"8px 0"}}><strong>{e.first_name} {e.last_name}</strong> — {e.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
