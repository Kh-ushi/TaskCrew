import React from 'react';
import ProjectCard from './ProjectCard';
import AddProjectCard from './AddProjectCard';
import AddProjectModal from './AddProjectModal';
import './ProjectsPage.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { set } from 'mongoose';

const backendURL = import.meta.env.VITE_BACKEND_URL;
const ProjectsPage = () => {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [projects, setProjects] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get(`${backendURL}/api/auth/allUsers`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched users:', response.data);
                setAllUsers(response.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching users');
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();

    }, [showModal]);


    useEffect(() => {

        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return; f
                }
                const response = await axios.get(`${backendURL}/api/projects`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched projects:', response.data);

                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }

        fetchProjects();

    }, [refresh,showModal]);

    const onCreate = (payload) => {
        console.log('Creating project with payload:', payload);
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            console.log('Creating project with payload:', payload);
            const response = axios.post(`${backendURL}/api/projects`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowModal(false);
            setRefresh((prev) => !prev);
            alert(response.data.message || "Project created successfully.");
        }
        catch (error) {
            console.error('Error creating project:', error);
        }
    }

    const onEdit=(project)=>{
        console.log('Editing project:', project);
        setIsEdit(true);
        setShowModal(true);
        setSelectedProject(project);
    }


    const handleEdit=async(project_id,payload)=>{
        console.log('Editing project with ID:', project_id);
        console.log('Payload:', payload);

        const token = localStorage.getItem('token');
        if (!token) { 
            navigate('/login');
            return;
        }

        try {               
            const response = await axios.put(`${backendURL}/api/projects/${project_id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Project edited successfully:', response.data);
            setShowModal(false);
            setRefresh((prev) => !prev);
            alert(response.data.message || "Project updated successfully.");
        }
        catch (error) {
            console.error('Error editing project:', error);
            setError(error.response?.data?.message || 'Error editing project');
        }
    }


    return (
        <div className="projects-container">
            <h1 className="projects-title">Your Projects</h1>
            <div className="projects-grid">
                {projects.map((proj) => (
                    <ProjectCard
                        key={proj._id}
                        project={proj}
                        onClick={() => navigate(`/dashboard/${proj._id}`)}
                        onEdit={onEdit}
                    />
                ))}
                <AddProjectCard onClick={() => setShowModal(true)}></AddProjectCard>
            </div>

            {showModal && <AddProjectModal isOpen={showModal}
                                           onClose={() =>{ setShowModal(false); setIsEdit(false); setSelectedProject(null); setError("");}}
                                            onCreate={onCreate} 
                                            error={error} 
                                            setError={setError} 
                                            allUsers={allUsers}
                                            isEdit={isEdit}
                                            selectedProject={selectedProject}
                                            handleEdit={handleEdit}>
                                            </AddProjectModal>}
        </div>
    );
};

export default ProjectsPage;
