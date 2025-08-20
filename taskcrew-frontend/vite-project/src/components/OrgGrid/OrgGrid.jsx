import React from "react";
import OrgCard from "../OrgCard/OrgCard";
import "./OrgGrid.css";
import { useNavigate } from "react-router-dom";

export default function OrgGrid({orgs}) {

    const navigate = useNavigate();
    const handleOpen = (org) => {
        navigate(`/org/${org._id}`,{state:{org}});
    }
    const handleManage = (org) => {
        
    }
    
    return (
        <section className="og-wrap">
            {orgs.map((o) => (
                <OrgCard
                    key={o._id}
                    orgName={o.name}
                    domain={o.domain ||""}
                    planType={o.planType ||"Free"}
                    ownerName={o.owner.name}
                    onOpen={()=>handleOpen(o)}
                    onManage={()=>handleManage(o)}
                />
            ))}
        </section>
    );
}