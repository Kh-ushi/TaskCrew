import React, { useState } from "react";
import "./SignUpForm.css";
// import PhoneInput from "../PhoneInput/PhoneInput";
import api from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {setAccessToken} from "../../utils/auth";

export default function SignUpForm({}) {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
  });

  const [error,setError]=useState(null);

  const navigate=useNavigate();

  const handle = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError(null);
  };

  const submit = async(e) => {
    e.preventDefault();
    console.log(form);
     
    const payload={
      name:form.first+" "+form.last,
      email:form.email,
      password:form.password,
    }
    try{
      const {data}=await api.post("/api/auth/register",payload);
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
    <form className="su-form" onSubmit={submit}>
      {error && <p className="error" style={{color:"red"}}>{error}</p>}
      <div className="su-row">
        <div className="su-field">
          <input
            type="text"
            placeholder=" First name"
            value={form.first}
            onChange={handle("first")}
            minLength={2} 
            required
          />
        </div>
        <div className="su-field">
            <input
              type="text"
              placeholder=" Last name"
              value={form.last}
              onChange={handle("last")}
              minLength={2} 
              required
            />
        </div>
      </div>

      <div className="su-field">
        {/* <div className="su-icon">✉</div> */}
        <input
          type="email"
          placeholder=" ✉ Enter your email"
          value={form.email}
          onChange={handle("email")}
          minLength={6} 
          required
        />
      </div>

      <div className="su-field">
        {/* <div className="su-icon">✉</div> */}
        <input
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handle("password")}
          minLength={6} 
          required
        />
      </div>

      <button className="su-primary" type="submit">
        Create an account
      </button>

    </form>
  );
}
