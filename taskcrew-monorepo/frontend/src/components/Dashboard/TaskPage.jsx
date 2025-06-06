import './TaskPage.css';
import { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import AddTaskModal from './AddTaskModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendURL = import.meta.env.VITE_BACKEND_URL;
const TaskPage = ({activeTab,projectId}) => {
    
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleManualAddition=async(taskData)=>{
        // console.log("Manual Task Data:", taskData);
        let token = localStorage.getItem('token');
        
        try{

          if(!token){
            navigate('/login');
            return;
          }
          const response = await axios.post(`${backendURL}/api/tasks/${projectId}`, taskData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });

          console.log("Manual Task Added:", response.data);
          alert(response.data.message || 'Manual task added successfully');
          setIsAddTaskModalOpen(false);
        }
        catch(error){
            setError(error.response?.data?.message || 'Error adding manual task');
            console.error("Error adding manual task:", error);
        }
    }

    return (
        <div className='task-page'>
            <div className='task-page-header'>
                <div className='task-page-header-left'>
                    <h1>{`Tasks ${activeTab}`}</h1>
                
                </div>
                <div className='task-page-header-right'>
                    <button className='add-task-button' onClick={()=>setIsAddTaskModalOpen(true)}>Add New Task</button>
                </div>
            </div>
            <div className='task-page-content'>
            <KanbanBoard></KanbanBoard>
            </div>
            
            {isAddTaskModalOpen && (
                <AddTaskModal 
                    isOpen={isAddTaskModalOpen} 
                    onClose={() => {setIsAddTaskModalOpen(false);setError("")}}
                    handleManualAddition={handleManualAddition}
                    error={error}
                    setError={setError}
                />
            )}

        </div>
    );
}

export default TaskPage;