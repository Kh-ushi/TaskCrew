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
        if (data?.organizations) {
          console.log(data.organizations);
          setOrgs([...orgs,...data.organizations]);
        }
        else {
          setOrgs([]);
        }
      } catch (error) {
        console.log(error);
        navigate("/");
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

          <h1 className="ap-title">Hi,{JSON.parse(localStorage.getItem("user"))}</h1>
          <p className="ap-subtitle">
            Maintain organizations and teams — open and manage.
          </p>
        </div>

        <div className="ap-hero-actions">
          <button className="ap-btn ap-btn-primary" onClick={()=>navigate("/addNewOrg",)}>+New Organization</button>
          {/* <button className="ap-btn ap-btn-ghost">Invite Member</button> */}
        </div>
      </section>

      {/* Grid */}
      {orgs.length > 0 ? (
        <main className="ap-content">
          <OrgGrid orgs={orgs} />
        </main>
      ) : (
        <div className="ms-empty" role="status" aria-live="polite">
          <div className="ms-empty-card">
            <div className="ms-empty-icon" aria-hidden="true">🗂️</div>
            <h2 className="ms-empty-title">No Organization yet</h2>
            <p className="ms-empty-text">
              You’re not part of any space in this organization.
            </p>
            <button className="ms-btn ms-btn-primary" onClick={()=>navigate("/addNewOrg")}>
              + Add Your Own Organization
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

