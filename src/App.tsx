// App.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const App: React.FC = () => {
  const [inactiveItems, setInactiveItems] = useState<string[]>(['a', 'b', 'c', 'd']);
  const [activeItems, setActiveItems] = useState<string[]>([]);

  const onDragEnd = (result: DropResult): void => {
    const { source, destination } = result;

    if (!destination) return;

    let sourceItems = source.droppableId === 'inactive' ? [...inactiveItems] : [...activeItems];
    let destinationItems = destination.droppableId === 'inactive' ? [...inactiveItems] : [...activeItems];

    const [removed] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, removed);

    if (source.droppableId === 'inactive') {
      setInactiveItems(sourceItems);
    } else {
      setActiveItems(sourceItems);
    }

    if (destination.droppableId === 'inactive') {
      setInactiveItems(destinationItems);
    } else {
      setActiveItems(destinationItems);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <Droppable droppableId="inactive">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ minHeight: '100px', border: '1px solid black', width: '45%' }}
            >
              <h2>Inactive</h2>
              {inactiveItems.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: '8px',
                        margin: '4px',
                        backgroundColor: '#fff',
                        border: '1px solid lightgray',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="active">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ minHeight: '100px', border: '1px solid black', width: '45%' }}
            >
              <h2>Active</h2>
              {activeItems.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: '8px',
                        margin: '4px',
                        backgroundColor: '#fff',
                        border: '1px solid lightgray',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default App;
