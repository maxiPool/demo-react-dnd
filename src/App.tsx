// App.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const App: React.FC = () => {
  const [inactiveItems, setInactiveItems] = useState<string[]>(['a', 'b', 'c', 'd']);
  const [activeItems, setActiveItems] = useState<string[]>([]);

  const onDragEnd = (result: DropResult): void => {
    const { source, destination } = result;

    // If the destination is null (dropped outside the list) or dropped in the same place
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // Function to reorder items within the same list
    const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    // Handle reordering within the same list
    if (source.droppableId === destination.droppableId) {
      const items = source.droppableId === 'inactive' ? [...inactiveItems] : [...activeItems];
      const reorderedItems = reorder(items, source.index, destination.index);

      if (source.droppableId === 'inactive') {
        setInactiveItems(reorderedItems);
      } else {
        setActiveItems(reorderedItems);
      }

      return;
    }

    // Handle moving items between different lists
    const sourceItems = source.droppableId === 'inactive' ? [...inactiveItems] : [...activeItems];
    const destinationItems = destination.droppableId === 'inactive' ? [...inactiveItems] : [...activeItems];

    const [removed] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, removed);

    if (source.droppableId === 'inactive') {
      setInactiveItems(sourceItems);
      setActiveItems(destinationItems);
    } else {
      setInactiveItems(destinationItems);
      setActiveItems(sourceItems);
    }
  };

  const generateKey = (item: string, index: number, list: string[]) => {
    return `${item}-${list === inactiveItems ? 'inactive' : 'active'}-${index}`;
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
                <Draggable key={generateKey(item, index, inactiveItems)} draggableId={generateKey(item, index, inactiveItems)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: '8px',
                        margin: '4px',
                        backgroundColor: snapshot.isDragging ? '#e0e0e0' : '#6c3636',
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
                <Draggable key={generateKey(item, index, activeItems)} draggableId={generateKey(item, index, activeItems)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: '8px',
                        margin: '4px',
                        backgroundColor: snapshot.isDragging ? '#e0e0e0' : '#7c4848',
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
