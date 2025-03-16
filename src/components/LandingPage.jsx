import React from 'react';
import "./LandingPage.css";

const LandingPage=()=>{
    return(
        <div className='landing-page'>
            <div className='landing-page-header'>
                <h1>Welcome to TaskCrew</h1>
                <p>Your ultimate tool for managing tasks and boosting productivity</p>
            </div>
            <div className='landing-page-body'>
                <div className='dashboard-screens'><p>Team Titans</p></div>
                <div className='dashboard-screens'><p>Project Pro</p></div>
                <div className='join-team-screen'><p>Join Team</p></div>
                <div className='create-team-screen'><p>Create Team +</p></div>
            </div>
            <div className='landing-page-footer'></div>
        </div>
    )
}

export default LandingPage;
