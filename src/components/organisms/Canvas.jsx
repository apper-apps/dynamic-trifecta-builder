import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EntityCard from "@/components/molecules/EntityCard";
import ApperIcon from "@/components/ApperIcon";

const Canvas = ({ 
  entities, 
  connections, 
  selectedEntity, 
  onSelectEntity, 
  onUpdateEntity,
  onDeleteEntity,
  onAddConnection,
  onDeleteConnection 
}) => {
  const [draggedEntity, setDraggedEntity] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);
  const canvasRef = useRef(null);

  const handleMouseDown = useCallback((e, entity) => {
    if (e.target.closest(".connection-handle")) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const entityRect = e.currentTarget.getBoundingClientRect();
    
    setDraggedEntity(entity);
    setDragOffset({
      x: e.clientX - entityRect.left,
      y: e.clientY - entityRect.top
    });
    onSelectEntity(entity);
  }, [onSelectEntity]);

  const handleMouseMove = useCallback((e) => {
    if (!draggedEntity) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    };
    
    // Constrain to canvas bounds
    newPosition.x = Math.max(0, Math.min(rect.width - 200, newPosition.x));
    newPosition.y = Math.max(0, Math.min(rect.height - 150, newPosition.y));
    
    onUpdateEntity(draggedEntity.id, {
      ...draggedEntity,
      position: newPosition
    });
  }, [draggedEntity, dragOffset, onUpdateEntity]);

  const handleMouseUp = useCallback(() => {
    setDraggedEntity(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleConnectionStart = (entityId, e) => {
    e.stopPropagation();
    setIsConnecting(true);
    setConnectionStart(entityId);
  };

  const handleConnectionEnd = (entityId, e) => {
    e.stopPropagation();
    if (isConnecting && connectionStart && connectionStart !== entityId) {
      onAddConnection({
        from: connectionStart,
        to: entityId,
        type: "ownership",
        label: "owns"
      });
    }
    setIsConnecting(false);
    setConnectionStart(null);
    setTempConnection(null);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      onSelectEntity(null);
      setIsConnecting(false);
      setConnectionStart(null);
    }
  };

  const renderConnection = (connection) => {
    const fromEntity = entities.find(e => e.id === connection.from);
    const toEntity = entities.find(e => e.id === connection.to);
    
    if (!fromEntity || !toEntity) return null;
    
    const fromPos = {
      x: fromEntity.position.x + 96, // Half width of entity card
      y: fromEntity.position.y + 75  // Approximate center height
    };
    
    const toPos = {
      x: toEntity.position.x + 96,
      y: toEntity.position.y + 75
    };
    
    const midX = (fromPos.x + toPos.x) / 2;
    const midY = (fromPos.y + toPos.y) / 2;
    
    return (
      <g key={connection.id}>
        <defs>
          <marker
            id={`arrowhead-${connection.id}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6B7280"
            />
          </marker>
        </defs>
        
        <path
          d={`M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY - 50} ${toPos.x} ${toPos.y}`}
          stroke="#6B7280"
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrowhead-${connection.id})`}
          className="hover:stroke-blue-500 cursor-pointer"
          onClick={() => onDeleteConnection(connection.id)}
        />
        
        <text
          x={midX}
          y={midY - 25}
          textAnchor="middle"
          className="text-sm fill-gray-600 font-medium"
        >
          {connection.label}
        </text>
      </g>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full canvas-grid bg-white rounded-lg border-2 border-gray-200 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map(renderConnection)}
      </svg>
      
      {/* Empty state */}
      {entities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Layers" size={48} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Building Your Structure
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Drag components from the toolbar to visualize your tax and asset protection strategy
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <ApperIcon name="MousePointer" size={16} />
              <span>Click and drag to get started</span>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Entity cards */}
      <AnimatePresence>
        {entities.map((entity) => (
          <motion.div
            key={entity.id}
            style={{
              position: "absolute",
              left: entity.position.x,
              top: entity.position.y,
              zIndex: selectedEntity?.id === entity.id ? 10 : 5
            }}
            onMouseDown={(e) => handleMouseDown(e, entity)}
            className="pointer-events-auto"
          >
            <EntityCard
              entity={entity}
              isSelected={selectedEntity?.id === entity.id}
              onSelect={() => onSelectEntity(entity)}
              onDelete={onDeleteEntity}
              isDragging={draggedEntity?.id === entity.id}
            />
            
            {/* Connection handles */}
            <div className="absolute -top-2 -right-2 connection-handle">
              <button
                className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                onMouseDown={(e) => handleConnectionStart(entity.id, e)}
                onMouseUp={(e) => handleConnectionEnd(entity.id, e)}
                title="Connect to another entity"
              >
                <ApperIcon name="Plus" size={12} className="text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Canvas;