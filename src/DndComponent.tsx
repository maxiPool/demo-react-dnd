import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
  ITEM: 'item',
};

interface DraggableItemProps {
  item: string;
  index: number;
  listType: 'inactive' | 'active';
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, listType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.ITEM,
    item: { index, listType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
        backgroundColor: 'lightgray',
        cursor: 'move',
      }}
    >
      {item}
    </div>
  );
};

interface DropZoneProps {
  items: string[];
  listType: 'inactive' | 'active';
  onDrop: (draggedIndex: number, draggedListType: 'inactive' | 'active', targetListType: 'inactive' | 'active') => void;
}

const DropZone: React.FC<DropZoneProps> = ({ items, listType, onDrop }) => {
  const [, drop] = useDrop({
    accept: ItemType.ITEM,
    drop: (draggedItem: { index: number; listType: 'inactive' | 'active' }) => {
      onDrop(draggedItem.index, draggedItem.listType, listType);
    },
  });

  return (
    <div ref={drop} style={{ minHeight: '100px', padding: '8px', border: '1px solid black' }}>
      {items.map((item, index) => (
        <DraggableItem key={index} index={index} item={item} listType={listType} />
      ))}
    </div>
  );
};

const DnDComponent: React.FC = () => {
  const [inactive, setInactive] = useState<string[]>(['a', 'b', 'c', 'd']);
  const [active, setActive] = useState<string[]>([]);

  const handleDrop = (draggedIndex: number, draggedListType: 'inactive' | 'active', targetListType: 'inactive' | 'active') => {
    if (draggedListType === targetListType) return;

    if (draggedListType === 'inactive' && targetListType === 'active') {
      const item = inactive[draggedIndex];
      setInactive((prev) => prev.filter((_, index) => index !== draggedIndex));
      setActive((prev) => [...prev, item]);
    } else if (draggedListType === 'active' && targetListType === 'inactive') {
      const item = active[draggedIndex];
      setActive((prev) => prev.filter((_, index) => index !== draggedIndex));
      setInactive((prev) => [...prev, item]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Inactive</h2>
          <DropZone items={inactive} listType="inactive" onDrop={handleDrop} />
        </div>
        <div>
          <h2>Active</h2>
          <DropZone items={active} listType="active" onDrop={handleDrop} />
        </div>
      </div>
    </DndProvider>
  );
};

export default DnDComponent;
