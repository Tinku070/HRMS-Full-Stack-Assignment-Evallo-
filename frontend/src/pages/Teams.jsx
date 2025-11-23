import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Teams(){
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name:"", description:"" });

  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const res = await api.get("/teams"); setTeams(res.data); }catch(e){} }

  async function createTeam(){
    try{
      await api.post("/teams", form);
      setForm({ name:"", description:"" });
      load();
    }catch(e){ alert("Failed to create"); }
  }

  return (
    <div className="container page">
      <h2 style={{width:"100%", textAlign:"left"}}>Teams</h2>

      <div className="card" style={{maxWidth:760, margin:"0 auto"}}>
        <h3 style={{marginTop:0}}>Create Team</h3>
        <div style={{marginTop:8}}>
          <input placeholder="Team name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={{marginBottom:8}} />
          <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        </div>
        <div style={{marginTop:12, textAlign:"right"}}>
          <button className="btn" onClick={createTeam}>Create Team</button>
        </div>
      </div>

      <div className="card" style={{marginTop:20, maxWidth:760, marginLeft:"auto", marginRight:"auto"}}>
        <h3 style={{marginTop:0}}>Team List</h3>
        <ul>
          {teams.map(t=> <li key={t.id} style={{padding:"8px 0"}}><strong>{t.name}</strong> — {t.description}</li>)}
        </ul>
      </div>
    </div>
  );
}
