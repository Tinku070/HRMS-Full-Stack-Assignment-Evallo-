import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Logs(){
  const [logs, setLogs] = useState([]);

  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const res = await api.get("/logs"); setLogs(res.data); }catch(e){} }

  return (
    <div className="container page">
      <h2 style={{width:"100%", textAlign:"left"}}>Audit Logs</h2>

      <div className="card" style={{overflowX:"auto"}}>
        <table className="table">
          <thead>
            <tr>
              <th style={{minWidth:60}}>ID</th>
              <th style={{minWidth:160}}>Action</th>
              <th style={{minWidth:160}}>User</th>
              <th style={{minWidth:260}}>Meta</th>
              <th style={{minWidth:160}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.action}</td>
                <td>{l.User?.name}</td>
                <td><pre style={{whiteSpace:"pre-wrap", margin:0}}>{JSON.stringify(l.meta,null,2)}</pre></td>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
