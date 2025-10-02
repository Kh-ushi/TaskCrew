import React, { useEffect, useState } from "react";
import "./Spaces.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { FiPlus, FiUsers, FiFolder, FiCalendar, FiMoreHorizontal, FiArrowRight, FiTrash2, FiEdit } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import CreateSpaceModal from "./CreateSpaceModal";
import AddMemberModal from "../Common/AddMemberModal";
import { useOrgGlobalVersion } from "../../context/OrgRefreshContext";


const Spaces = () => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const version = useOrgGlobalVersion();

  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [editSpace, setEditSpace] = useState(null);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [space, setSpace] = useState(null);


  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(`${BACKEND_URL}/api/space/${id}/space`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpaces(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, [version]);

  const handleCreateSpace = async (payload) => {
    console.log("Create Space clicked");
    console.log(payload);
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${BACKEND_URL}/api/space/${id}/space`,
        payload,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );
      const { space, message } = data;
      setSpaces((prev) => [...prev, space]);
      setIsSpaceModalOpen(false);
      alert(message);

    }
    catch (error) {
      console.error("❌ Error creating Space:", error.response?.data || error.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleEdit = async (payload, spaceId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${BACKEND_URL}/api/space/space/${spaceId}`,
        payload,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );
      console.log(data);
      const { space, message } = data;
      setSpaces((prev) => (
        prev.map((p) => {
          if (p._id == space._id) return space;
          return p;
        })
      ));
      setIsSpaceModalOpen(false);
      alert(message);
    }
    catch (error) {
      console.log(error);
      console.error("❌ Error Editing Space:", error.response?.data || error.message);
    }
  };


  const handleDelete = async (spaceId) => {
    try {
      console.log(spaceId);
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.delete(`${BACKEND_URL}/api/space/space/${spaceId}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      const { space, message } = data;
      setSpaces((prev) => (
        prev.filter((p) => p._id !== space._id)
      ));
      alert(message);
    }
    catch (error) {
      console.log(error);
      console.error("❌ Error Deleting Space:", error.response?.data || error.message);
    }
  };


  const handleInviteMembers = async (members) => {
    console.log("Invite members to space:", members);
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${BACKEND_URL}/api/space/invite-members/${space._id}`,
        { emails: members },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );
      console.log(data);
      const { message, sent, missing } = data;
      alert(
        `✅ ${message}\n\n` +
        `📩 Invited Members:\n- ${sent.map(s => s.email).join("\n- ")}\n\n` +
        `⚠️ Missing (not part of this organization):\n- ${missing.join("\n- ")}`
      );

      setOpenAddMemberModal(false);
    } catch (error) {
      console.error("❌ Error inviting members:", error.response?.data || error.message);
    }
  }

  const handleView = (space) => {
    // navigate to /spaces/:id or open details
    console.log("View", space._id);
  };

  const handleManage = (space) => {
    // open manage drawer/modal
    console.log("Manage", space._id);
  };

  return (
    <div className="spaces-page">
      <Navbar></Navbar>
      <div className="spaces-hero">
        <h2 className="spaces-title" style={{ display: "inline-block" }}>Spaces</h2>&nbsp;&nbsp;
        <span className="spaces-subtitle">
          Organize projects, teams, and workflows inside beautifully structured spaces.
        </span>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="spaces-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="space-card skeleton" key={i}>
              <div className="skeleton-bar w60" />
              <div className="skeleton-bar w40" />
              <div className="skeleton-metrics">
                <span className="skeleton-pill" />
                <span className="skeleton-pill" />
              </div>
              <div className="skeleton-actions">
                <span className="skeleton-btn" />
                <span className="skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && spaces.length === 0 && (
        <div className="spaces-empty">
          <div className="spaces-empty-glow" />
          <h3>No spaces yet</h3>
          <p>Create your first space to group projects and collaborate with your team.</p>
          <button className="spaces-cta" onClick={() => {
            setEditSpace(null);
            setIsSpaceModalOpen(true)
          }}>
            <FiPlus /> Create Space
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && spaces.length > 0 && (
        <div className="spaces-grid">
          {spaces.map((sp) => (
            <div className="space-card" key={sp._id}>
              <div className="space-card-top">
                <div className="space-brand">
                  <div className="space-avatar">{(sp.name || "S")[0].toUpperCase()}</div>
                  <div>
                    <h3 className="space-name">{sp.name}</h3>
                    <div className="space-meta">
                      <span className="meta-chip">
                        <FiCalendar /> {new Date(sp.createdAt).toLocaleDateString()}
                      </span>
                      {sp.visibility && <span className="meta-chip">{sp.visibility}</span>}
                    </div>
                  </div>
                </div>
                {/* <button className="icon-btn" title="More">
                  <FiMoreHorizontal />
                </button> */}
              </div>

              <p className="space-desc">
                {sp.description?.length ? sp.description : "A focused workspace for your team and projects."}
              </p>

              <div className="space-stats">
                <span className="stat">
                  <FiFolder />
                  <b>{sp.projectsCount ?? (sp.projects?.length || 0)}</b> Projects
                </span>
                <span className="stat">
                  <FiUsers />
                  <b>{sp.membersCount ?? (sp.members?.length || 0)}</b> Members
                </span>
              </div>

              <div className="space-actions">
                <button className="btn primary" onClick={() => navigate(`/space/${sp._id}`)}>
                  Enter
                </button>
                <button className="btn ghost" onClick={() => {
                  setOpenAddMemberModal(true)
                  setSpace(sp)
                }}>
                  +Add Members
                </button>
                <button className="delete-org" onClick={() => handleDelete(sp._id)}>
                  <FiTrash2 size={20} />
                </button>
                <button className="edit-org" onClick={() => {
                  setEditSpace(sp)
                  setIsSpaceModalOpen(true)
                }}>
                  <FiEdit size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="fab" onClick={() => {
        setEditSpace(null)
        setIsSpaceModalOpen(true)
      }}>
        <FiPlus />
      </button>

      {isSpaceModalOpen && <CreateSpaceModal isOpen={isSpaceModalOpen} onClose={() => { setIsSpaceModalOpen(false) }} onSubmit={editSpace ? handleEdit : handleCreateSpace} editSpace={editSpace} ></CreateSpaceModal>}
      {openAddMemberModal && <AddMemberModal isOpen={openAddMemberModal} onClose={() => setOpenAddMemberModal(false)} onSubmit={handleInviteMembers} entityType="space" entity={space}></AddMemberModal>}
    </div>
  );
};

export default Spaces;
