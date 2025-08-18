import React from "react";
import OrgCard from "../OrgCard/OrgCard";
import "./OrgGrid.css";

export default function OrgGrid({orgs}) {
    
    return (
        <section className="og-wrap">
            {orgs.map((o) => (
                <OrgCard
                    key={o._id}
                    orgName={o.name}
                    domain={o.domain ||""}
                    planType={o.planType ||"Free"}
                    ownerName={o.owner}
                    onOpen={() => alert(`Opening ${o.name}`)}
                    onManage={() => alert(`Managing ${o.name}`)}
                />
            ))}
        </section>
    );
}