import Navbar from "../Navbar/NavBar";
import MySpaces from "./MySpaces";
import "./MySpacesPage.css";
import { useState, useEffect } from "react";
import { useParams, useLocation,useNavigate } from "react-router-dom";
import CreateSpaceModal from "../CreateSpaceModal/CreateSpaceModal";
import InviteMemberModal from "../InviteMemberModal/InviteMemberModal";
import api from "../../utils/axiosInstance";


export default function MySpacesPage() {
  const { id } = useParams();
  console.log(id);
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [openInvite, setOpenInvite] = useState(false);
  const [addMemberToSpace, setAddMemberToSpace] = useState(false);
  const [space, setSpace] = useState(null);




  const handleCreateSpace = () => {
    setOpen(true);
  }
  const handleInviteMember = () => {
    setOpenInvite(true);
    setAddMemberToSpace(false);
  }

  const handleAddMember = (space) => {
    setAddMemberToSpace(true);
    setOpenInvite(true);
    setSpace(space);
  }

  const handleDeleteSpace = async (space_id) => {
    console.log(space_id);
    try {
      const { data } = await api.delete(`/api/auth/org/${id}/space/delete-space/${space_id}`);
      console.log(data);
      setSpaces(spaces.filter((s) => s._id !== space_id));
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
      console.log(error);
    }
  }

  const onSubmit = async (payload) => {
    try {
      const { data } = await api.post(`/api/auth/org/${id}/space/create-space`, payload);
      console.log(data);
      setSpaces([...spaces, data.space]);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleMemeberInvite = async (payload) => {
    try {
      console.log(payload);
      console.log(id);
      const { data } = await api.post(`/api/auth/org/invite-members/${id}`, payload);
      console.log(data);
      setOpenInvite(false);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
      else {
        alert("Failed to invite members");
      }
    }
  }


  const handleMemberInviteToSpace = async (payload) => {
    try {
      console.log(payload);
      console.log(id);
      console.log(space._id);
      const { data } = await api.post(`/api/auth/org/${id}/space/invite-members/${space._id}`, payload);
      console.log(data);
      setOpenInvite(false);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
      else {
        alert("Failed to invite members");
      }
    }
  }

  const onOpenSpace = (space) => {
    navigate(`/space/${space._id}`);
  }

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const { data } = await api.get(`/api/auth/org/${id}/space/get-spaces`);
        console.log(data);
        setSpaces(data.spaces);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSpaces();
  }, [id]);

  return (
    <div className="ap-page">
      <Navbar />

      {/* Hero / Greeting */}
      <section className="ap-hero">
        <div className="ap-hero-left">

          <h1 className="ap-title">Let's Be Productive</h1>
          <p className="ap-subtitle">
            Manage your client & private spaces — create, open, and collaborate.
          </p>
        </div>

        <div className="ap-hero-actions">
          <button className="ap-btn ap-btn-primary" onClick={handleCreateSpace}>Create Space</button>
          <button className="ap-btn ap-btn-ghost" onClick={handleInviteMember}>Invite Member</button>
        </div>
      </section>

      {/* Content */}
      <main className="ap-content">
        {/* Hide the internal MySpaces hero so the page hero is the only one */}
        <div className="ap-content-inner">
          <MySpaces spaces={spaces} onDeleteSpace={handleDeleteSpace} onAddMember={handleAddMember} onOpenSpace={onOpenSpace} />
        </div>
      </main>
      <CreateSpaceModal open={open} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      <InviteMemberModal open={openInvite} onClose={() => setOpenInvite(false)} onSubmit={addMemberToSpace ? handleMemberInviteToSpace : handleMemeberInvite} orgName={addMemberToSpace ? space.name : location.state.org.name} />
    </div>
  );
}
