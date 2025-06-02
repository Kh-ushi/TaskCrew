import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./KanbanBoard.css";

const getInitialColumns = () => {
  const saved = localStorage.getItem("kanban-columns");
  if (saved) return JSON.parse(saved);

  return {
    todo: {
      name: "TODO",
      items: [
        { id: "1", content: "Learn React" },
        { id: "2", content: "Build Kanban Board" }
      ]
    },
    inwork: {
      name: "IN WORK",
      items: [
        { id: "3", content: "Design UI" },
        { id: "4", content: "Test Drag-and-Drop" }
      ]
    }
  };
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(getInitialColumns);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    const [moved] = sourceItems.splice(source.index, 1);

    let newColumns;

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, moved);
      newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems
        }
      };
    } else {
      destItems.splice(destination.index, 0, moved);
      newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems
        }
      };
    }

    setColumns(newColumns);
    localStorage.setItem("kanban-columns", JSON.stringify(newColumns)); // Persist
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-container">
        {Object.entries(columns).map(([colId, colData]) => (
          <Droppable droppableId={colId} key={colId} isDropDisabled={false}>
            {(provided) => (
              <div
                className="kanban-column"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3 className="kanban-title">{colData.name}</h3>
                {colData.items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="kanban-task"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          border: "1px dashed #007bff",
                          backgroundColor: "#fff",
                          padding: "8px",
                          marginBottom: "8px",
                          borderRadius: "4px"
                        }}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;



