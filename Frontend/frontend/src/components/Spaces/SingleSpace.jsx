
import './SingleSpace.css';
import Sidebar from './Sidebar';
import Navbar from '../Navbar/Navbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Overview from './Overview';
import Projects from '../Projects/Projects';
import axios from "axios";
import { use } from 'react';

const SingleSpace = () => {

    const { id } = useParams();

    const [active, setActive] = useState("Overview");
    const [projectMetrics,setProjectMetrics]=useState({});

    const tabs = ["Overview", "Projects", "Analytics", "chats", "Notes"];
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {

        const fetchAllProjectsMetrics = async () => {

            try {

                const token = localStorage.getItem("accessToken");
                const {data}= await axios.get(`${BACKEND_URL}/api/metrics/space/${id}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                setProjectMetrics(data);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchAllProjectsMetrics();
    },[]);

    const renderContent = () => {
        switch (active) {
            case "Overview":
                return <Overview projectMetrics={projectMetrics}/>;
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