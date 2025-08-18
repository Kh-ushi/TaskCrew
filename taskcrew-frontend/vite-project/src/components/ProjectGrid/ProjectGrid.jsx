import React from "react";
import "./ProjectGrid.css";
import ProjectCard from "../ProjectCard/ProjectCard";

const demo = [
  {
    name: "TaskCrew v2",
    description:
      "Revamp UI, add analytics and AI task assistant. Focus on performance & accessibility.",
    members: ["Khushi Gupta", "Stanley Park", "Ava Li", "Marco Diaz", "Zoe K."],
    status: "In Progress",
    startDate: "Aug 10, 2025",
    endDate: "Sep 18, 2025",
  },
  {
    name: "Mobile App",
    description:
      "Ship React Native MVP with auth, offline cache, and push notifications.",
    members: ["Aarav Sharma", "Neha Verma", "Leo Kim"],
    status: "Completed",
    startDate: "Jun 01, 2025",
    endDate: "Aug 01, 2025",
  },
  {
    name: "Marketing Site",
    description:
      "Landing pages, pricing, integrations gallery, and blog setup.",
    members: ["Stanley Park", "Ava Li"],
    status: "On Hold",
    startDate: "Aug 02, 2025",
    endDate: "Oct 01, 2025",
  },
];

export default function ProjectGrid() {
  return (
    <section className="pg-wrap">
      {demo.map((p, i) => (
        <ProjectCard
          key={i}
          {...p}
          onEdit={() => alert(`Edit ${p.name}`)}
          onDelete={() => alert(`Delete ${p.name}`)}
        />
      ))}
    </section>
  );
}
