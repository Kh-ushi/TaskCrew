import React from "react";
import Navbar from "../Navbar/NavBar";
import OrgGrid from "../OrgGrid/OrgGrid";
import "./AllOrganizations.css";
import api from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllOrganizations() {

const [orgs, setOrgs] = useState([]);   

const navigate = useNavigate();

   useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data } = await api.get("/api/auth/org/get-organizations");
        console.log(data);
        console.log(data.organization);
        if(data.organization!=null || data.organization!=undefined || data.organization!=""){
            setOrgs(data.organization);
        }
        else{
            setOrgs([]);
        }
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };
    fetchOrganizations();
  }, []);


  return (
    <div className="ap-page">
      <Navbar />

      {/* Hero / Greeting */}
      <section className="ap-hero">
        <div className="ap-hero-left">
          {/* <nav className="ap-crumbs" aria-label="Breadcrumb">
            <a href="#home">Home</a>
            <span aria-hidden>›</span>
            <span>Organizations</span>
          </nav> */}

          <h1 className="ap-title">Hi, Khushi</h1>
          <p className="ap-subtitle">
            Maintain organizations and teams — open and manage.
          </p>
        </div>

        <div className="ap-hero-actions">
          <button className="ap-btn ap-btn-primary">+New Organization</button>
          {/* <button className="ap-btn ap-btn-ghost">Invite Member</button> */}
        </div>
      </section>

      {/* Grid */}
      <main className="ap-content">
        <OrgGrid orgs={[orgs]} />
      </main>
    </div>
  );
}

