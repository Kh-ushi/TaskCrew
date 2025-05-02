import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignupForm.css';

const backendURL = import.meta.env.VITE_BACKEND_URL;


const SignupForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate=useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        if (name === "confirmPassword") {
            if (updatedFormData.password !== updatedFormData.confirmPassword) {
                setError("Passwords do not match");
                setSuccess("");
            } else {
                setError("");
                setSuccess("Passwords match");
            }
        } else {
            setError("");
            setSuccess("");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        console.log(backendURL);

        try {
            console.log(`${backendURL}/api/users/signUp`);
            const response = await axios.post(`${backendURL}/api/users/signUp`, formData);
            if(response.status==201){
                const {token,user}=response.data;
                localStorage.setItem("token",token);
                localStorage.setItem("user",JSON.stringify(user));
                navigate("/dashboard");
            }
            else{
                setError('Signup Failed');
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
        <div className="signup-wrapper">
            <div className="signup-container">
                <p style={{ color: "red" }}>{error}</p>
                <p style={{ color: "green" }}>{success}</p>
                <h2 className="signup-heading">Create Your Account</h2>
                <p className="signup-subtext">Join TaskCrew and start collaborating today!</p>
                <div className="signup-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </div>
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
                            placeholder="Create a password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button className="signup-button" onClick={handleSubmit}>
                        Sign Up
                    </button>
                </div>
                <p className="signup-footer">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;