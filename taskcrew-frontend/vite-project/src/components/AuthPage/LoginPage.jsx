import React, { useState } from 'react'
import './LoginPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import api from "../../utils/axiosInstance";
import { setAccessToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({ email, password })
      const { data } = await api.post("/api/auth/login",{email, password });
      console.log("Login successful:", data);
      setAccessToken(data.accessToken);
      console.log(data);
      navigate("/createSpace");
    }
    catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      }
      console.log(error);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className='signup-error'><p>{error}</p></div>
        <div className="login-card__header">
          <FontAwesomeIcon icon={faCircleCheck} size="2x" />
          <h2>TaskCrew</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login_btn login_btn--primary">
            Log In
          </button>
        </form>

        <div className="login-card__footer">
          <span>Don’t have an account?</span>
          <button className="btn btn--outline">Sign Up</button>
        </div>
      </div>
    </div>
  )
}
