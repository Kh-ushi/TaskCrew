import './LandingPage.css';
import overviewImg from '../../assets/TaskCrewOverview.jpeg';
import { Navigate, useNavigate } from 'react-router-dom';
import { CircleCheckBig } from "lucide-react";

const featuresData = [
    {
      feature: "Smart Task Management",
      description: "Create, assign, and organize tasks with priorities, deadlines, and real-time updates across teams."
    },
    {
      feature: "Team Collaboration",
      description: "Seamlessly collaborate with team members through mentions, shared boards, and task ownership."
    },
    {
      feature: "Project Dashboard",
      description: "Track project timelines, member contributions, and progress analytics all in one clean interface."
    },
    {
      feature: "File Attachments",
      description: "Upload and manage files directly within projects to centralize resources and reduce communication gaps."
    },
];

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className='landing-page'>
            <div className='landing-page-nav'>
                <div className="nav-logo">
                    <CircleCheckBig color='#f3d69a' size={40} />
                    <h2>TaskCrew</h2>
                </div>
                <div className="nav-links">
                    <h3>Login</h3>
                    <h3>Services</h3>
                    <h3>About Us</h3>
                    <button onClick={() => navigate('/login')}>Log In</button>
                    <button className='landing-page-signIn' onClick={() => navigate('/signUp')}>Sign Up</button>
                </div>
            </div>
            <div className='landing-page-desc'>
                <div className="intro-text">
                    <p>Take your productivity to a new level</p>
                </div>
                <div className='landing-page-quote'>
                    <h1>Where Chaos Ends, Crew Begins</h1>
                    <h1>TaskCrew makes work feel like progress, not pressure</h1>
                </div>
                <div className="sub-text">
                    <p>Streamline Your Workflow</p>
                    <p>Empower Your Team with TaskCrew’s Intuitive Management Platform</p>
                </div>
                <button className="get-started-btn">Get Started</button>
            </div>
            <div className='overview-container'>
                <div className='overview'>
                    <img src={overviewImg} alt="TaskCrew Overview" />
                </div>
            </div>
            <h1 className="features-heading">Key Features</h1>
            <div className='key-features-container'>
                {featuresData.map((el, idx) => (
                    <div key={idx} className='key-feature-card'>
                        <h2>{el.feature}</h2>
                        <p>{el.description}</p>
                    </div>
                ))}
            </div>
            <div className="footer-space"></div>
        </div>
    );
};

export default LandingPage;