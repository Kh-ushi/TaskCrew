import { useState, useEffect } from "react";
import "./AddProjectMembersModal.css";
import axios from "axios";

const AddProjectMembersModal = ({ isOpen, onClose, project, spaceId, onAdd }) => {

    const [members, setMembers] = useState([]);
    const [selected, setSelected] = useState([]);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("accessToken");

    useEffect(() => {

        const fetchMembers = async () => {
            try {
                let { data } = await axios.get(`${BACKEND_URL}/api/space/${spaceId}/members`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                console.log(data);
                data = data.map(m => m.userId);
                data = data.filter(m => !project.members.includes(m._id));
                // console.log(data);
                setMembers(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchMembers();

    }, []);

    const toggleSelect = (memberId) => {
        setSelected((prev) => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
    };

    const handleAdd = async () => {
        console.log("Adding members:", selected);
        onAdd(selected);
    };


    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Select Members to Add</h2>
                <div className="members-list">{
                    members.map((m) => (
                        <label key={m._id} className="member-item">
                            <input
                                type="checkbox"
                                checked={selected.includes(m._id)}
                                onChange={() => toggleSelect(m._id)}>
                            </input>
                            <img src={m.avatar || "https://i.pravatar.cc/40"} className="avatar" />
                            <span>{m.name}</span>
                            <small>{m.email}</small>
                        </label>
                    ))
                }
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                    <button onClick={handleAdd} className="add-btn" disabled={!selected.length}>
                        ➕ Add Selected
                    </button>
                </div>

            </div>
        </div>
    )

};

export default AddProjectMembersModal;