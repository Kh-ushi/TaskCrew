import React, { useState } from 'react'
import './SignupPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus,faCircleCheck} from '@fortawesome/free-solid-svg-icons'


export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const[error,setError]=useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if(password!=confirmPassword){
      setError("Passwords don't match");
      return;
    }
    console.log({ name, email, password, confirmPassword });
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
       <div className='signup-error'><p>{error}</p></div>
        <div className="signup-card__header">
          <FontAwesomeIcon icon={faCircleCheck} size="2x" />
          <h2>TaskCrew</h2>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

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

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="login_btn signup_btn--primary">
            Sign Up
          </button>
        </form>

        <div className="signup-card__footer">
          <span>Already have an account?</span>
          <button className="btn btn--outline">Log In</button>
        </div>
      </div>
    </div>
)
}
