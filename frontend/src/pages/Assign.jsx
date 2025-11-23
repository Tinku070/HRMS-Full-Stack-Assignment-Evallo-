import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Assign(){
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selEmp, setSelEmp] = useState("");
  const [selTeam, setSelTeam] = useState("");

  useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      const [eRes, tRes] = await Promise.all([api.get("/employees"), api.get("/teams")]);
      setEmployees(eRes.data); setTeams(tRes.data);
    }catch(e){}
  }

  async function doAssign(){
    if(!selEmp||!selTeam){ alert("Select both"); return; }
    try{ await api.post(`/teams/${selTeam}/assign`, { employeeId: selEmp }); alert("Assigned"); }catch(e){ alert("Failed"); }
  }
  async function doUnassign(){
    if(!selEmp||!selTeam){ alert("Select both"); return; }
    try{ await api.delete(`/teams/${selTeam}/unassign`, { data:{ employeeId: selEmp }}); alert("Unassigned"); }catch(e){ alert("Failed"); }
  }

  return (
    <div className="container page">
      <h2 style={{width:"100%", textAlign:"left"}}>Assign Employee to Team</h2>

      <div style={{width:"100%", display:"flex", justifyContent:"center"}}>
        <div className="card form-single">
          <label>Employee</label>
          <select value={selEmp} onChange={e=>setSelEmp(e.target.value)}>
            <option value="">Select employee</option>
            {employees.map(x => <option key={x.id} value={x.id}>{x.first_name} {x.last_name}</option>)}
          </select>

          <div style={{height:12}} />

          <label>Team</label>
          <select value={selTeam} onChange={e=>setSelTeam(e.target.value)}>
            <option value="">Select team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <div style={{display:"flex", gap:10, justifyContent:"flex-end", marginTop:14}}>
            <button className="btn" onClick={doAssign}>Assign</button>
            <button className="btn danger" onClick={doUnassign}>Unassign</button>
          </div>
        </div>
      </div>
    </div>
  );
}
