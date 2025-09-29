
import "./Signup.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const navigate=useNavigate();

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
        console.log(formData);
        setError(null);
        try {
            const { data } = await axios.post(
                `${BACKEND_URL}/api/auth/register`,
                formData
            );
            const { accessToken, user, message } = data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", user);
            setFormData({
                name: "",
                email: "",
                password: ""
            });
          navigate("/organizations");
        } catch (error) {
            console.log(error?.response?.data?.message);
            if (error?.response?.data?.message) {
                setError(error.response.data.message);
            }
            console.error("❌ Registration failed:", error.response?.data || error.message);
        }
    };



    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Create your account</h1>
                    <p>Start managing projects and tasks smarter 🚀</p>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" name="name" id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" id="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="signup-btn">Sign Up</button>

                    <div className="signup-footer">
                        <p>
                            Already have an account?{" "}
                            <a href="/login" className="login-link">Log in</a>
                        </p>
                    </div>
                </form>

                {/* <div className="social-signup">
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

export default Signup;
