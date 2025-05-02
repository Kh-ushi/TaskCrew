import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}/api/users/login`, formData);
      console.log(response);
      if(response.status==201){
        const {token,user}=response.data;
        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(user));
        navigate("/dashboard");
      }
      else{
        setError("Signup Failed");
      }

    }
    catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Signup failed');
      }
      else {
        setError('Network Error');
      }
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-container">
      <p style={{color:"red"}}>{error}</p>
        <h2 className="login-heading">Welcome Back</h2>
        <p className="login-subtext">Log in to your TaskCrew account</p>
        <div className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          <button className="login-button" onClick={handleSubmit}>
            Log In
          </button>
        </div>
        <p className="login-footer">
          Forgot password? <a href="#">Reset it</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;