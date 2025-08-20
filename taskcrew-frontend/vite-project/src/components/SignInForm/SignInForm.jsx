import React, { useState } from "react";
import "./SignInForm.css";
import api from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {setAccessToken} from "../../utils/auth";

export default function SignInForm({ onSubmit }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error,setError]=useState(null);
  const navigate=useNavigate();
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));


  const submit = async(e) => {
    e.preventDefault();
    try{
          const {data}=await api.post("/api/auth/login",form);
          console.log(data);
          setAccessToken(data.accessToken);
          console.log(data.user.name);
          localStorage.setItem("user",JSON.stringify(data.user.name));
          navigate("/allOrganizations");
        }
        catch(error){
          if(error.response?.data?.message){
            setError(error.response.data.message);
          }
          console.log(error);
        }
  };

  return (
    <form className="si-form" onSubmit={submit}>
      {error && <p className="error" style={{color:"red"}}>{error}</p>}
      <div className="si-field">
        {/* <div className="si-icon">✉</div> */}
        <input
          type="email"
          placeholder=" ✉ Enter your email"
          value={form.email}
          onChange={handle("email")}
          required
        />
      </div>
      <div className="si-field">
        {/* <div className="si-icon">🔒</div> */}
        <input
          type="password"
          placeholder=" 🔒 Enter your password"
          value={form.password}
          onChange={handle("password")}
          required
        />
      </div>
      <button className="si-primary" type="submit">Sign in</button>
      {/* <div className="si-links">
        <a href="#!" aria-label="Forgot password">Forgot password?</a>
      </div> */}
    </form>
  );
}
