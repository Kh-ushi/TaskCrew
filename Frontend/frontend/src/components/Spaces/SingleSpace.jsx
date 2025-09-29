
import './SingleSpace.css';
import Sidebar from './Sidebar';
import Navbar from '../Navbar/Navbar';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Overview from './Overview';
import Projects from '../Projects/Projects';

const SingleSpace = () => {
     
    const {id}=useParams();

    const [active, setActive] = useState("Overview");
    const tabs = ["Overview", "Projects", "Analytics", "chats", "Notes"];

    const renderContent = () => {
        switch (active) {
            case "Overview":
                return <Overview />;
            // case "clients":
            //     return <Clients />;
            case "Projects":
                return <Projects spaceId={id} />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className='single-space'>
            <div className='left'>
                <Sidebar></Sidebar>
            </div>
            <div className='between'>

                <div className="topnav-container">
                    <div className="topnav">
                        {tabs.map((tab) => (
                            <div
                                key={tab}
                                className={`topnav-item ${active === tab ? "active" : ""}`}
                                onClick={() => setActive(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                    <div className='rem-nav'>
                        <Navbar></Navbar>
                    </div>
                </div>
                <div className='main-container'>
                  {renderContent()}
                </div>
            </div>
        </div>
    )

}

export default SingleSpace;