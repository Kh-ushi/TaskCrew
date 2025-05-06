import { useState,useEffect} from "react";
import Select from 'react-select';
import "./TaskAddForm.css";
import axios from 'axios';


const backendURL=import.meta.env.VITE_BACKEND_URL;
const token=localStorage.getItem("token");

const TaskAddForm = ({ onClose,isOpenTaskForm,projectId}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    priority: "medium",
    assignee: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");



  useEffect(()=>{

    const fetchData=async()=>{
      try{
        const response=await axios.get(`${backendURL}/gateway/getProjectMembers/${projectId}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });

        console.log(response.data);
      }
      catch(error){
        console.log(error);
      }
    }
   
    fetchData();

  },[isOpenTaskForm]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePriorityChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      priority: selectedOption.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setTimeout(() => {
      setSuccess("Task created successfully!");
      setFormData({ title: "", description: "", dueDate: "", priority: "medium", assignee: "" });
    }, 500);
  };

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="popup-wrapper">
      <div className="task-add-container">
        <h2 className="task-add-heading">Add New Task</h2>
        <p className="task-add-subtext">Create a new task for your project</p>
        <div className="task-add-form">
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task"
              required
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Due Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <Select
              name="priority"
              options={priorityOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={priorityOptions.find(option => option.value === formData.priority)}
              onChange={handlePriorityChange}
            />
          </div>
          <Select
           isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            name="priority"></Select>

          <button className="submit-button" onClick={handleSubmit}>
            Add Task
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

export default TaskAddForm;