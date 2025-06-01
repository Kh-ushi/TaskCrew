import React, { useState, useEffect } from 'react';
import './Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bottomError, setBottomError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBottomError("");
    console.log(formData);

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/api/auth/register`, formData);

      const { token, id, email, name } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", { id, email, name });
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setError("");
      setSuccess("");
      navigate('/projects'); 
    }
    catch (err) {
      setBottomError(
        err.response?.data?.message ||
        'Regisateration failed.Pls Try Again'
      )
    }
  };

  const onChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  useEffect(() => {
    const { password, confirmPassword } = formData;
    if (!password || !confirmPassword) {
      setError(""); setSuccess("");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
    } else {
      setSuccess("Passwords match");
      setError("");
    }
  }, [formData.password, formData.confirmPassword]);


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <p className='error-message'>{error}</p>
            <p className='success-message'>{success}</p>
          </div>

          <button type="submit" className="btn-primary">
            Sign Up
          </button>

          <div>
            <p className='error-message'>{bottomError}</p>
          </div>
        </form>
        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
