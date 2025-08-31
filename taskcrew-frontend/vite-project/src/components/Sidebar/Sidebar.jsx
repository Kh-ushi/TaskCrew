import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import {
  LayoutDashboard, 
  FolderKanban,  
  SquarePlus,  
  Users,        
  MessageSquare,   
  Video,          
  LineChart,       
  FileBarChart,    
  Bot ,
  Edit2,
  Trash    
} from "lucide-react";


export default function Sidebar({ open = false, onClose, collapsed: forceCollapsed ,onCollapsedChange,onAddProject,onEdit,onDelete,projects=[],setSelectedOption}) {
  const [collapsed, setCollapsed] = useState(false);
  const [wsOpen, setWsOpen] = useState(true);
  const [collabOpen, setCollabOpen] = useState(true);
  const [insOpen, setInsOpen] = useState(true);

  useEffect(() => {
    if (forceCollapsed !== undefined) setCollapsed(Boolean(forceCollapsed));
  }, [forceCollapsed]);

 
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const Item = ({group, project, icon: Icon, label, href = "#", depth = 0, isDashboard = false,isAddProject=false ,isEdit=false,isDelete=false,setSelectedOption=null}) => (
    <a className={`sb-item depth-${depth}`} href={href} onClick={isAddProject ? onAddProject : () => setSelectedOption({group,label,project})}>
      <span className={`sb-ico ${isDashboard ? "" : "sb-label"}`} aria-hidden><Icon size={16}/></span>
      <span className={`sb-label ${isAddProject ? "sb-add-project" : ""}`}>{label}</span>
      {isEdit && <Edit2 size={16} className="sb-edit" onClick={(e)=>{e.stopPropagation();onEdit(project)}} />}
      {isDelete && <Trash size={16} className="sb-delete" onClick={(e)=>{e.stopPropagation();onDelete(project)}} />}
    </a>
  );

  const Group = ({ title, open, setOpen, icon: Icon, children }) => (
    <div className="sb-group">
      <button
        className={`sb-group-head ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="sb-ico" aria-hidden><Icon size={18} /></span>
        <span className="sb-label">{title}</span>
        <span className="sb-caret" aria-hidden>▾</span>
      </button>
      <div className={`sb-sub ${open ? "is-open" : ""}`}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      <div className={`sb-backdrop ${open ? "is-open" : ""}`} onClick={onClose} />

      <aside className={`sidebar ${collapsed ? "is-collapsed" : ""} ${open ? "is-open" : ""}`}>
        <div className="sb-top">
          <div className="sb-brand">
            <div className="sb-logo" aria-hidden>TC</div>
            <span className="sb-brand-text">TaskCrew</span>
          </div>
          <button
            className="sb-collapse"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={
                () => {
                    setCollapsed(v => !v)
                    onCollapsedChange?.(!collapsed)
                    if(!collapsed){
                        setWsOpen(false)
                        setCollabOpen(false)
                        setInsOpen(false)
                    } 
                }
            }
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="sb-nav" aria-label="Primary">
          <Item group="dashboard" icon={LayoutDashboard} label="Dashboard" isDashboard={true} setSelectedOption={setSelectedOption} />

          <Group title="Workspaces" open={wsOpen} setOpen={setWsOpen} icon={FolderKanban}>
            {projects.length > 0 && projects.map((project)=>{
              return <Item group="workspaces" project={project} icon={FolderKanban} label={project.name} depth={1} isEdit={true} isDelete={true} setSelectedOption={setSelectedOption}  />
            })}
            <Item group="workspaces" icon={SquarePlus} label=" Add Projects" depth={1}  isAddProject={true}/>
          </Group>

          <Group title="Collaborations" open={collabOpen} setOpen={setCollabOpen} icon={Users}>
            <Item group="Collaborations" icon={MessageSquare} label="Chat" depth={1} setSelectedOption={setSelectedOption} />
            <Item group="Collaborations" icon={Video} label="Meetings" depth={1} setSelectedOption={setSelectedOption} />
          </Group>

          
          <Group title="Insights" open={insOpen} setOpen={setInsOpen} icon={LineChart}>
            <Item group="Insights" icon={LineChart} label="Analytics" depth={1} setSelectedOption={setSelectedOption} />
            <Item group="Insights" icon={FileBarChart} label="Reports" depth={1} setSelectedOption={setSelectedOption} />
            <Item group="Insights"icon={Bot} label="Automations" depth={1} setSelectedOption={setSelectedOption}   />
          </Group>
        </nav>
      </aside>
    </>
  );
}
