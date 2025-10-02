import React from "react";
import "./Organizations.css";
import axios from "axios";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateOrganizationModal from "./CreateOrganizationModel";
import Navbar from "../Navbar/Navbar";
import AddMemberModal from "../Common/AddMemberModal";
import { useOrgGlobalVersion } from "../../context/OrgRefreshContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Organizations = () => {

    const [isModelOpen, setIsModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [editOrg, setEditOrg] = useState(null);
    const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
    const [organization, setOrganization] = useState(null);

    const navigate = useNavigate();
    const version = useOrgGlobalVersion();

    useEffect(() => {

        const fetchOrganizations = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const { data } = await axios.get(
                    `${BACKEND_URL}/api/org/organization`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOrganizations(data);
            }
            catch (error) {
                console.log(error);
            }
        }

        fetchOrganizations();

    }, [version]);

    const handleCreateOrg = async (payload) => {
        console.log(payload);
        console.log("Create New Organization clicked!");

        try {
            const token = localStorage.getItem("accessToken");

            const { data } = await axios.post(
                `${BACKEND_URL}/api/org/organization`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { message, organization } = data;
            setOrganizations((prev) => [...prev, organization]);

            setIsModalOpen(false);
            alert(message);

            console.log("✅ Organization created:", data);
        } catch (error) {
            console.log(error);
            console.error("❌ Error creating organization:", error.response?.data || error.message);
        }
    };


    const handleDeleteOrg = async (id) => {
        console.log(id);
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.delete(
                `${BACKEND_URL}/api/org/organization/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { message, organization } = data;
            alert(message);
            setOrganizations((prev) => (
                prev.filter(p => p._id !== organization._id)
            ));
        }
        catch (error) {
            console.error("❌ Error Deleting organization:", error.response?.data || error.message);
        }
    };


    const handleEditOrg = async (payload, id) => {
        console.log(payload);
        console.log(id);
        try {
        //     const token = localStorage.getItem("accessToken");
        //     const { data } = await axios.put(`${BACKEND_URL}/api/org/organization/${id}`,
        //         payload,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //         }
        //     );

        //     const { message, organization } = data;
        //     setOrganizations((prev) => (
        //         prev.map((p) => {
        //             if (p._id == organization._id) {
        //                 return organization;
        //             }
        //             return p;
        //         })
        //     ));
        //     setIsModalOpen(false);
        //     alert(message);
        }
        catch (error) {
          console.log(error);
        }
    };

    const handleInviteMembers = async (members) => {
        console.log(members);
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${BACKEND_URL}/api/org/invite/${organization._id}`,
                {
                    emails: members,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { message, sent } = data;
            alert(message + ". Invites sent to: " + sent.join(", "));
            setOrganization(null);
            setOpenAddMemberModal(false);
        }
        catch (error) {
            console.error("❌ Error inviting members:", error.response?.data || error.message);
        }
    }




    return (
        <div className="org-page">
            <Navbar></Navbar>

            {/* 👋 Welcome Section */}
            {/* <div className="welcome-box">
                <h2 className="welcome-title">Welcome back, Khushi 👋</h2>
                <p className="welcome-quote">
                    “The best way to predict the future is to build it.” — Let’s create something impactful today 🚀
                </p>
            </div> */}

            <h1 className="org-title" style={{ display: "inline-block" }}>Organizations</h1>&nbsp;&nbsp;&nbsp;
            <span className="org-subtitle">
                Manage and explore all your organizations at a glance.
            </span>

            <div className="org-grid">
                {organizations.map((org) => (
                    <div key={org._id} className="org-card">
                        <div className="org-card-header">
                            <h2>{org.name}</h2>
                            <span className="org-badge">Active</span>
                        </div>

                        <div className="org-info">
                            <p><span>👤 Owner:</span> {org.owner.name}</p>
                            <p><span>👥 Members:</span> {org.members.length}</p>
                            {/* <p><span>📁 Projects:</span> {org.projects}</p> */}
                            <p><span>📅 Created:</span> {new Date(org.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="org-actions">
                            <button className="org-btn primary" onClick={() => navigate(`/organizations/${org._id}`)} >Enter</button>
                            <button className="org-btn secondary" onClick={() => {
                                setOpenAddMemberModal(true);
                                setOrganization(org);
                            }}>+Add Members</button>
                            <button className="delete-org" onClick={() => handleDeleteOrg(org._id)}>
                                <FiTrash2 size={20} />
                            </button>
                            <button className="edit-org" onClick={() => {
                                setEditOrg(org);
                                setIsModalOpen(true);
                            }}>
                                <FiEdit size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✨ Floating Create Button */}
            <button className="fab-btn" onClick={() => {
                setEditOrg(null);
                setIsModalOpen(true)
            }}>
                <FiPlus />
            </button>

            {isModelOpen && <CreateOrganizationModal isOpen={isModelOpen} onClose={() => { setIsModalOpen(false) }} onSubmit={!editOrg ? handleCreateOrg : handleEditOrg} editOrg={editOrg}></CreateOrganizationModal>}
            {openAddMemberModal && <AddMemberModal isOpen={openAddMemberModal} onClose={() => setOpenAddMemberModal(false)} onSubmit={handleInviteMembers} entityType="organization" entity={organization}></AddMemberModal>}
        </div>
    );
};

export default Organizations;
