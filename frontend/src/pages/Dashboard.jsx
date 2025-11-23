import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard(){
  const [stats, setStats] = useState({ employees:0, teams:0, logs:0 });

  useEffect(()=>{
    async function load(){ 
      try{
        const res = await api.get("/metrics");
        setStats(res.data);
      }catch(e){}
    }
    load();
  },[]);

  return (
    <div className="container page">
      <h2 style={{width:"100%", textAlign:"left"}}>Dashboard</h2>
      <div className="metrics" style={{marginTop:10}}>
        <div className="metric">
          <h3>Total Employees</h3>
          <div className="num">{stats.employees}</div>
        </div>
        <div className="metric">
          <h3>Total Teams</h3>
          <div className="num">{stats.teams}</div>
        </div>
        <div className="metric">
          <h3>Total Logs</h3>
          <div className="num">{stats.logs}</div>
        </div>
      </div>
    </div>
  );
}
