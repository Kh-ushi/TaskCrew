import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendURL}/api/auth/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token } = res.data;
      localStorage.setItem('token',token);
      navigate('/projects');


    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    } 
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Log In</h2>
        {error && <p className="error-text">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
