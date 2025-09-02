// KanbanBoard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./KanbanBoard.css";
import dayjs from "dayjs";

// KanbanBoard.jsx (replace only the tasks inside initialColumns)
const initialColumns = {
    todo: {
        name: "To Do",
        tasks: [
            { id: "1", title: "Setup project repo", startDate: "2025-09-01", endDate: "2025-09-03", priority: "High", assignees: ["KG", "RS"] },
            { id: "2", title: "Design database schema", startDate: "2025-09-02", endDate: "2025-09-05", priority: "Medium", assignees: ["AM"] },
        ],
    },
    inProgress: {
        name: "In Progress",
        tasks: [
            { id: "3", title: "Implement auth service", startDate: "2025-08-30", endDate: "2025-09-04", priority: "Critical", assignees: ["KG", "VK", "RS"] },
        ],
    },
    done: {
        name: "Done",
        tasks: [
            { id: "4", title: "Setup Docker", startDate: "2025-08-28", endDate: "2025-08-29", priority: "Low", assignees: ["AM"] },
        ],
    },
};


export default function KanbanBoard({ tasks = [] }) {
    const [columns, setColumns] = useState(initialColumns);

    console.log("Tasks in KanbanBoard:", tasks);
    const groupedTasks = (tasks = []) => tasks.reduce((acc, task) => {
        const status = task.status.toLowerCase();
        if (!acc[status]) {
            acc[status] = { name: status, tasks: [] };
        }
        acc[status].tasks.push(task);
        return acc;
    }, {});

    const sameColumns = (a = {}, b = {}) => {
        const ak = Object.keys(a);
        const bk = Object.keys(b);
        if (ak.length !== bk.length) return false;
        for (const k of ak) {
            if (!b[k]) return false;
            if ((a[k].tasks?.length || 0) !== (b[k].tasks?.length || 0)) return false;
        }
        return true;
    };


    const nextColumns = useMemo(() => { const grouped = groupedTasks(tasks);
                                         console.log("Grouped tasks:", grouped);
                                         return grouped; }, [tasks]);



    useEffect(() => {
        setColumns((prev) => (sameColumns(prev, nextColumns) ? prev : nextColumns));
    }, [nextColumns]);


    const onDragEnd = ({ source, destination }) => {
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        const sourceTasks = [...columns[source.droppableId].tasks];
        const destTasks =
            source.droppableId === destination.droppableId
                ? sourceTasks
                : [...columns[destination.droppableId].tasks];

        const [moved] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, moved);

        setColumns((prev) => ({
            ...prev,
            [source.droppableId]: {
                ...prev[source.droppableId],
                tasks: sourceTasks,
            },
            [destination.droppableId]: {
                ...prev[destination.droppableId],
                tasks: destTasks,
            },
        }));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
                {Object.entries(columns).map(([colId, col]) => (
                    <Droppable key={colId} droppableId={colId}>
                        {(provided) => (
                            <div
                                className="kanban-column"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h2>{col.name}</h2>

                                {col.tasks.map((task, index) => (
                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="kanban-task"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={provided.draggableProps.style}  // ← important
                                            >
                                                {/* Top row: title + priority chip */}
                                                <div className="task-top">
                                                    <div className="task-title">{task.title}</div>
                                                    <span className={`chip chip-${(task.priority || 'Low').toLowerCase()}`}>
                                                        {task.priority || "Low"}
                                                    </span>
                                                </div>

                                                {/* Dates */}
                                                <div className="task-meta">
                                                    <span className="date">
                                                        {/** calendar icon */}
                                                        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-9 3h2v2h-2v-2Z" /></svg>
                                                        <span>{dayjs(task.startTime).format("DD MMM YYYY, HH:mm")}</span>
                                                    </span>
                                                    <span className="date sep">→</span>
                                                    <span className="date">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-9 3h2v2h-2v-2Z" /></svg>
                                                        <span>{dayjs(task.endTime).format("DD MMM YYYY, HH:mm")}</span>
                                                    </span>
                                                </div>

                                                {/* Assignees + actions */}
                                                <div className="task-footer">
                                                    <div className="avatars" title={(task.assignedTo || []).join(", ")}>
                                                        {(task.assignedTo || []).slice(0, 3).map((i, idx) => (
                                                            <span key={idx} className="avatar">{i}</span>
                                                        ))}
                                                        {(task.assignedTo || []).length > 3 && (
                                                            <span className="avatar more">+{task.assignedTo.length - 3}</span>
                                                        )}
                                                        {/* assign icon button */}
                                                        <button className="icon-btn" title="Assign">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm-9 9a8.94 8.94 0 0 1 9-9a8.94 8.94 0 0 1 9 9Z" /></svg>
                                                        </button>
                                                    </div>
                                                    <div className="actions">
                                                        {/* edit */}
                                                        <button className="icon-btn" title="Edit">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m3 17.25V21h3.75L17.81 9.94l-3.75-3.75ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75Z" /></svg>
                                                        </button>
                                                        {/* delete */}
                                                        <button className="icon-btn danger" title="Delete">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2H8l1-2Z" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder} {/* ← important */}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}
