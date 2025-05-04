import { useState, useEffect } from "react";
import "./NewProjectForm.css";
import Select from 'react-select';
import axios from 'axios';


const token = localStorage.getItem("token");
const backendURL = import.meta.env.VITE_BACKEND_URL;


const NewProjectForm = ({ onClose, isOpenForm }) => {


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    deadline: "",
    priority: "low",
    teamMembers: []
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [teamOptions, setTeamOptions] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/users/getUsers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status == 201) {
          setTeamOptions(response.data.map(member => ({
            value: member._id,
            label: member.name
          })))
        }
        else {
          setError("Network Error");
        }
      }
      catch (error) {
        console.log(error);
        setError("Network Error");
      }
    };

    fetchData();

  }, [isOpenForm]);




  const [projectImage, setProjectImage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setProjectImage(e.target.files[0]);
  };

  const handleTeamChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: selectedOptions
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    for (const key in formData) {
      if (key == 'teamMembers') {
        data.append(key, JSON.stringify(formData[key]))
      }
      else {
        data.append(key, formData[key]);
      }
    }
    if (projectImage) {
      data.append('projectImage', projectImage);
    }

    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(`${backendURL}/api/users/addNew`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if(response.status==201){
        alert(response.data.message);
      }
      else{
        setError("Some Error has Occured");
      }

    }
    catch (error) {
      console.log(error);
      setError("Some Error Has Occured");
    }  
  };



  return (
    <div className="popup-wrapper">
      <div className="new-project-container">
        <h2 className="new-project-heading">Create New Project</h2>
        <p className="new-project-subtext">Add a new project to your TaskCrew dashboard</p>
        <div className="new-project-form">

          <div className="form-group">
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectImage">Upload Project Image</label>
            <input
              type="file"
              id="projectImage"
              name="projectImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project"
              required
              rows="4"
            ></textarea>
          </div>
          <div className="date-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select className="project-priority" id="priority" name="priority" value={formData.priority} onChange={handleChange} children>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

          </div>

          <div className="form-group">
            <label>Team Members</label>
            <Select
              isMulti
              name="teamMembers"
              options={teamOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={formData.teamMembers}
              onChange={handleTeamChange}
            />
          </div>

          <button className="submit-button" onClick={handleSubmit}>
            Create Project
          </button>
          <button className="close-button" onClick={onClose}>
            x
          </button>
        </div>
        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default NewProjectForm;