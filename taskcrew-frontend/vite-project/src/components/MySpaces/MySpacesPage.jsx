import Navbar from "../Navbar/NavBar";
import MySpaces from "./MySpaces";
import "./MySpacesPage.css";
import {useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import CreateSpaceModal from "../CreateSpaceModal/CreateSpaceModal";
import api from "../../utils/axiosInstance";

export default function MySpacesPage() {
    const {id} = useParams();
    console.log(id);
    const [open, setOpen] = useState(false);
    const [spaces, setSpaces] = useState([]);
  
    
    const handleCreateSpace = () => {
       setOpen(true);
    }
    const handleInviteMember = () => {
        
    }

    const handleDeleteSpace = async(space_id) => {
      console.log(space_id);
      try{
        const {data} = await api.delete(`/api/auth/org/${id}/space/delete-space/${space_id}`);
        console.log(data);
        setSpaces(spaces.filter((s) => s._id !== space_id));
      } catch (error) {
        if(error.response?.data?.message){
          alert(error.response.data.message);
        }
        console.log(error);
      } 
    }

    const onSubmit = async(payload) => {
        try {
            const {data} = await api.post(`/api/auth/org/${id}/space/create-space`, payload);
            console.log(data);
            setSpaces([...spaces, data.space]);
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const {data} = await api.get(`/api/auth/org/${id}/space/get-spaces`);
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
          <MySpaces spaces={spaces} onDeleteSpace={handleDeleteSpace}/>
        </div>
      </main>
      <CreateSpaceModal open={open} onClose={() => setOpen(false)} onSubmit={onSubmit} />
    </div>
  );
}
