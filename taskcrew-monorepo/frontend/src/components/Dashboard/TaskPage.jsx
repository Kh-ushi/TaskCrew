import './TaskPage.css';
import KanbanBoard from './KanbanBoard';

const TaskPage = ({activeTab}) => {
    return (
        <div className='task-page'>
            <div className='task-page-header'>
                <div className='task-page-header-left'>
                    <h1>{`Tasks ${activeTab}`}</h1>
                
                </div>
                <div className='task-page-header-right'>
                    <button className='add-task-button'>Add New Task</button>
                </div>
            </div>
            <div className='task-page-content'>
            <KanbanBoard></KanbanBoard>
            </div>
        </div>
    );
}

export default TaskPage;