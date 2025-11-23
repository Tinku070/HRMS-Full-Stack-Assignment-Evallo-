import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [orgName, setOrgName] = useState("Evallo");
  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();

  async function doLogin(e){
    e?.preventDefault();
    try{
      const res = await api.post("/auth/login", { orgName, email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    }catch(err){
      alert(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="container page">
      <div className="card form-single" style={{maxWidth:420}}>
        <h2 style={{textAlign:"center", marginBottom:8}}>Sign in</h2>
        <p style={{color:"#475569", marginTop:0, marginBottom:14}}>Use your account to sign in</p>
        <form onSubmit={doLogin}>
          <label>Organisation</label>
          <input value={orgName} onChange={e=>setOrgName(e.target.value)} placeholder="Organisation name" />
          <label style={{marginTop:12}}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
          <label style={{marginTop:12}}>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
          <div style={{marginTop:16, display:"flex", justifyContent:"center"}}>
            <button className="btn" type="submit">Login</button>
          </div>
        </form>
        <div style={{marginTop:10, fontSize:13, color:"#64748b", textAlign:"center"}}>
          Demo: admin@mail.com / 123456
        </div>
      </div>
    </div>
  );
}
