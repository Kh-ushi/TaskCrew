import React from "react";
import "./Login.css";
import axios from "axios";
import { useState } from "react";

const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        setError(null);
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        console.log(formData);
        try {

            const { data } = await axios.post(`${BACKEND_URL}/api/auth/login`, formData);
            const { user, accessToken, message } = data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", user);
            setFormData({
                email: "",
                password: ""
            });

        }
        catch (error) {
            if (error?.response?.data?.message) {
                setError(error?.response?.data?.message);
            }
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome Back 👋</h1>
                    <p>Log in to continue managing your projects efficiently</p>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" id="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                    </div>

                    {/* <div className="form-helpers">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-link">
              Forgot password?
            </a>
          </div> */}

                    <button type="submit" className="login-btn">
                        Log In
                    </button>

                    <div className="login-footer">
                        <p>
                            Don’t have an account?{" "}
                            <a href="/register" className="signup-link">
                                Sign up
                            </a>
                        </p>
                    </div>
                </form>

                {/* <div className="social-login">
          <p>or continue with</p>
          <div className="social-buttons">
            <button className="social-btn google">Google</button>
            <button className="social-btn github">GitHub</button>
          </div>
        </div> */}
            </div>
        </div>
    );
};

export default Login;
