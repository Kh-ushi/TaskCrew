import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import './SignUp.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [login,setLogin]=useState(false);

  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamOptionChange = (e) => {
    setFormData({ ...formData, teamOption: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!login && formData.password !== formData.confirmPassword) {
      setFormData({...formData,password:'',confirmPassword:''});
      setError('Passwords do not match');
      return;
    }

    try{
        const response=login?await axios.post('http://localhost:5000/api/users/login',formData):await axios.post('http://localhost:5000/api/users/signUp',formData);
        if(response.status===201){
          localStorage.setItem('token',response.data.token);
          localStorage.setItem('user',JSON.stringify(response.data.user));
          navigate('/');
        }
        else{
            setError('An error occurred while creating your account. Please try again.');
        }
    }
    catch(error){
        console.log(error);
        console.error('Sign-up error:', error);
        setError(error.response.data.error?error.response.data.error:'An error occurred while creating your account. Please try again.');
    }
   
  };

  return (
    <div className="signup-container">
      <div className="signup-container-left">
        <div className="brand-header">
          <h1 className="brand-logo">TaskCrew</h1>
          <div className="brand-slogan">Welcome to TaskCrew - Streamline your team's productivity</div>
        </div>
        <div className="signup-form-container">
          {!login && (<h1>Create an account</h1>)}
          {login && (<h1>Log In to your account</h1>)}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-form-group">
              {!login && (<div className="signup-form-group-input">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              )}
              <div className="signup-form-group-input">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="signup-form-group-input">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {!login && (<div className="signup-form-group-input">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              )}
              <div className="signup-form-group-button">
                <button type="submit" className="submit-btn">
                  <UserPlus size={16} /> Submit
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
          </form>
          <div className="footer-links">
            {!login && (<p>Have an account? <a href onClick={()=>setLogin(true)}>LogIn</a></p>)}
            {login && (<p>Don't have an account? <a onClick={()=>setLogin(false)}>SignUp</a></p>)}
            <p><a href="/terms">Terms & Conditions</a></p>
          </div>
        </div>
      </div>


      <div className="signup-container-right">
        <div className="image-overlay">
          <div className="overlay-text">Task Review with Team</div>
          <div className="overlay-date">09:00am - 10:00am</div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;