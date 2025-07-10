import React, { forwardRef, useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import EntityCard from "@/components/molecules/EntityCard";

const Canvas = forwardRef(({ 
  entities, 
  connections, 
  selectedEntity, 
  onSelectEntity, 
  onUpdateEntity,
  onDeleteEntity,
  onAddConnection,
  onDeleteConnection,
  onAddEntity 
}, ref) => {
const [draggedEntity, setDraggedEntity] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedFromLibrary, setDraggedFromLibrary] = useState(null);
  const [validDropZone, setValidDropZone] = useState(true);
  const [connectionPreview, setConnectionPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const canvasRef = useRef(null);

  // Grid snap helper
  const snapToGrid = (position, gridSize = 20) => {
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
};

  // Validation helpers
  const validateEntityPosition = (entity, position) => {
    const errors = [];
    
    // Check canvas bounds
    if (position.x < 0 || position.y < 0) {
      errors.push("Entity must be within canvas bounds");
    }
    
    // Check for entity overlap
    const entitySize = { width: 200, height: 150 };
    const overlap = entities.some(e => 
      e.id !== entity.id &&
      Math.abs(e.position.x - position.x) < entitySize.width &&
      Math.abs(e.position.y - position.y) < entitySize.height
    );
    
    if (overlap) {
      errors.push("Entities cannot overlap");
    }
    
    return errors;
  };

  const validateConnection = (fromId, toId) => {
    const fromEntity = entities.find(e => e.id === fromId);
    const toEntity = entities.find(e => e.id === toId);
    
    if (!fromEntity || !toEntity) {
      return ["Invalid entity selection"];
    }
    
    // Check for existing connection
    const existingConnection = connections.find(c => 
      (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)
    );
    
    if (existingConnection) {
      return ["Connection already exists between these entities"];
    }
    
    // Business logic validation
    const errors = [];
    
    // Form1040 can only receive connections, not initiate them
    if (fromEntity.type === "Form1040") {
      errors.push("Form 1040 cannot own other entities");
    }
    
    // Trust cannot connect to another Trust
    if (fromEntity.type === "Trust" && toEntity.type === "Trust") {
      errors.push("Trusts cannot directly own other Trusts");
    }
    
    // Self-connection prevention
    if (fromId === toId) {
      errors.push("Entity cannot connect to itself");
    }
    
    return errors;
  };

const handleMouseDown = useCallback((e, entity) => {
    if (e.target.closest(".connection-handle")) return;
    
    // Prevent null reference error and ensure canvas is available
    if (!canvasRef.current || !e.currentTarget) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const entityRect = e.currentTarget.getBoundingClientRect();
    
    // Clear previous validation errors
    setValidationErrors([]);
    
    setDraggedEntity(entity);
    setDragOffset({
      x: e.clientX - entityRect.left,
      y: e.clientY - entityRect.top
    });
    onSelectEntity(entity);
    
    // Add mouse move and up listeners to document for better tracking
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onSelectEntity]);

const handleMouseMove = useCallback((e) => {
    if (!draggedEntity || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    };
    
    // Snap to grid
    const snappedPosition = snapToGrid(newPosition);
    
    // Constrain to canvas bounds with better edge handling
    const entityWidth = 200;
    const entityHeight = 150;
    snappedPosition.x = Math.max(0, Math.min(rect.width - entityWidth, snappedPosition.x));
    snappedPosition.y = Math.max(0, Math.min(rect.height - entityHeight, snappedPosition.y));
    
    // Real-time validation with immediate feedback
    const errors = validateEntityPosition(draggedEntity, snappedPosition);
    setValidationErrors(errors);
    setValidDropZone(errors.length === 0);
    
    // Update entity position immediately for smooth dragging
    onUpdateEntity(draggedEntity.id, {
      ...draggedEntity,
      position: snappedPosition
    });
  }, [draggedEntity, dragOffset, onUpdateEntity, entities]);
const handleMouseUp = useCallback(() => {
    setDraggedEntity(null);
    setDragOffset({ x: 0, y: 0 });
    setValidationErrors([]);
    setValidDropZone(true);
    
    // Clean up event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
// Handle drag from library with enhanced validation
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
    
    // Visual feedback for valid drop zone
    const entityType = e.dataTransfer.getData("text/plain");
    if (entityType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const dropPosition = {
        x: e.clientX - rect.left - 100,
        y: e.clientY - rect.top - 75
      };
      
      const snappedPosition = snapToGrid(dropPosition);
      snappedPosition.x = Math.max(0, Math.min(rect.width - 200, snappedPosition.x));
      snappedPosition.y = Math.max(0, Math.min(rect.height - 150, snappedPosition.y));
      
      const tempEntity = { id: 'temp', type: entityType, position: snappedPosition };
      const errors = validateEntityPosition(tempEntity, snappedPosition);
      
      if (entityType === "Form1040" && entities.some(e => e.type === "Form1040")) {
        errors.push("Only one Form 1040 allowed per structure");
      }
      
      setValidDropZone(errors.length === 0);
      setValidationErrors(errors);
    }
  }, [entities, validateEntityPosition]);

  const handleDragLeave = useCallback((e) => {
    if (!canvasRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
      setValidDropZone(true);
      setValidationErrors([]);
    }
  }, []);

const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const entityType = e.dataTransfer.getData("text/plain");
    if (entityType && onAddEntity && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const dropPosition = {
        x: e.clientX - rect.left - 100, // Center the entity
        y: e.clientY - rect.top - 75
      };
      
      const snappedPosition = snapToGrid(dropPosition);
      
      // Ensure position is within bounds
      snappedPosition.x = Math.max(0, Math.min(rect.width - 200, snappedPosition.x));
      snappedPosition.y = Math.max(0, Math.min(rect.height - 150, snappedPosition.y));
      
      // Validation for new entity placement
      const tempEntity = { id: 'temp', type: entityType, position: snappedPosition };
      const errors = validateEntityPosition(tempEntity, snappedPosition);
      
      // Business rule validation
      if (entityType === "Form1040" && entities.some(e => e.type === "Form1040")) {
        errors.push("Only one Form 1040 allowed per structure");
      }
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        setTimeout(() => setValidationErrors([]), 3000);
        return;
      }
      
      onAddEntity(entityType, snappedPosition);
    }
    
    // Clean up drag state
    setValidDropZone(true);
    setValidationErrors([]);
  }, [onAddEntity, entities, validateEntityPosition]);
const handleConnectionStart = (entityId, e) => {
    e.stopPropagation();
    setIsConnecting(true);
    setConnectionStart(entityId);
    setValidationErrors([]);
    
    // Add mouse tracking for connection preview
    document.addEventListener('mousemove', handleConnectionPreview);
    document.addEventListener('mouseup', handleConnectionCancel);
  };

  const handleConnectionPreview = useCallback((e) => {
    if (!isConnecting || !connectionStart || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    const startEntity = entities.find(e => e.id === connectionStart);
    if (startEntity) {
      setConnectionPreview({
        from: {
          x: startEntity.position.x + 96,
          y: startEntity.position.y + 75
        },
        to: mousePos
      });
    }
  }, [isConnecting, connectionStart, entities]);

  const handleConnectionCancel = useCallback((e) => {
    if (isConnecting && !e.target.closest('.connection-handle')) {
      setIsConnecting(false);
      setConnectionStart(null);
      setConnectionPreview(null);
      document.removeEventListener('mousemove', handleConnectionPreview);
      document.removeEventListener('mouseup', handleConnectionCancel);
    }
  }, [isConnecting, handleConnectionPreview]);

  const handleConnectionEnd = (entityId, e) => {
    e.stopPropagation();
    if (isConnecting && connectionStart && connectionStart !== entityId) {
      // Validate connection before creating
      const errors = validateConnection(connectionStart, entityId);
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        setTimeout(() => setValidationErrors([]), 3000);
        setIsConnecting(false);
        setConnectionStart(null);
        setConnectionPreview(null);
        return;
      }
      
      const fromEntity = entities.find(e => e.id === connectionStart);
      const toEntity = entities.find(e => e.id === entityId);
      
      // Determine connection type based on entity types
      let connectionType = "ownership";
      let label = "owns";
      
      if (toEntity?.type === "Form1040") {
        connectionType = "income";
        label = "reports to";
      }
      
      onAddConnection({
        from: connectionStart,
        to: entityId,
        type: connectionType,
        label: label
      });
    }
    
    // Clean up connection state
    setIsConnecting(false);
    setConnectionStart(null);
    setConnectionPreview(null);
    document.removeEventListener('mousemove', handleConnectionPreview);
    document.removeEventListener('mouseup', handleConnectionCancel);
  };

const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      onSelectEntity(null);
      setIsConnecting(false);
      setConnectionStart(null);
      setValidationErrors([]);
      setConnectionPreview(null);
    }
  };

  const handleConnectionClick = (connection) => {
    const fromEntity = entities.find(e => e.id === connection.from);
    const toEntity = entities.find(e => e.id === connection.to);
    
    if (connection.type === "ownership") {
      alert(`Ownership Connection:\n${fromEntity?.name} owns ${toEntity?.name}\n\nOwnership Percentage: 100%\nVoting Rights: Full Control\nTax Implications: Pass-through taxation`);
    } else if (connection.type === "income") {
      alert(`Income Flow Connection:\n${fromEntity?.name} reports income to ${toEntity?.name}\n\nIncome Type: Business Income\nTax Treatment: Schedule C/E\nFlow-through: Yes`);
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
    
    // Enhanced connection styling based on relationship type
    const isIncomeFlow = connection.type === "income";
    const isOwnership = connection.type === "ownership";
    
    let strokeColor = "#6B7280";
    let strokeWidth = 3;
    let strokeDasharray = "none";
    
    if (isIncomeFlow) {
      strokeColor = "#10B981";
      strokeWidth = 4;
      strokeDasharray = "8,4";
    } else if (isOwnership) {
      strokeColor = "#2563EB";
      strokeWidth = 3;
      strokeDasharray = "none";
    }
    
    // Validation indicator
    const isValid = validateConnection(connection.from, connection.to).length === 0;
    const validationColor = isValid ? strokeColor : "#EF4444";
    
    // Determine relationship strength for visual enhancement
    const isAssetToOperation = 
      (fromEntity.type === "Trust" || fromEntity.type === "LLC") &&
      (toEntity.type === "SCorp" || toEntity.type === "Form1040");
    
    const enhancedStrokeWidth = isAssetToOperation ? strokeWidth + 1 : strokeWidth;
    
    return (
      <g key={connection.id}>
        <defs>
          <marker
            id={`arrowhead-${connection.id}`}
            markerWidth="12"
            markerHeight="8"
            refX="10"
            refY="4"
            orient="auto"
          >
            <polygon
              points="0 0, 12 4, 0 8"
              fill={validationColor}
            />
          </marker>
          
          {/* Enhanced glow effect for important connections */}
          <filter id={`glow-${connection.id}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path
          d={`M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY - 50} ${toPos.x} ${toPos.y}`}
          stroke={validationColor}
          strokeWidth={enhancedStrokeWidth}
          strokeDasharray={!isValid ? "4,4" : strokeDasharray}
          fill="none"
          markerEnd={`url(#arrowhead-${connection.id})`}
          filter={isAssetToOperation ? `url(#glow-${connection.id})` : "none"}
          className={`hover:stroke-blue-500 cursor-pointer transition-all duration-200 ${
            isIncomeFlow ? 'animate-pulse-slow' : ''
          } ${!isValid ? 'opacity-60' : ''} ${
            isAssetToOperation ? 'connection-trifecta' : ''
          }`}
          onClick={() => handleConnectionClick(connection)}
        />
        
        {/* Enhanced connection label with background */}
        <rect
          x={midX - 35}
          y={midY - 35}
          width="70"
          height="20"
          fill="white"
          stroke={validationColor}
          strokeWidth="1"
          rx="10"
          className="opacity-90 shadow-sm"
        />
        
        <text
          x={midX}
          y={midY - 22}
          textAnchor="middle"
          className="text-sm font-bold pointer-events-none"
          fill={validationColor}
        >
          {connection.label}
        </text>
        
        {/* Connection type indicator */}
        <circle
          cx={midX}
          cy={midY + 10}
          r="4"
          fill={validationColor}
          className="opacity-80"
        >
          <title>{isIncomeFlow ? "Income Flow" : isOwnership ? "Ownership" : "Connection"}</title>
        </circle>
        
        {!isValid && (
          <circle
            cx={midX}
            cy={midY}
            r="8"
            fill="#EF4444"
            className="animate-pulse"
          >
            <title>Invalid Connection</title>
          </circle>
        )}
      </g>
    );
  };

return (
    <div
      ref={ref || canvasRef}
      className={`relative w-full h-full canvas-grid bg-white rounded-lg border-2 transition-all duration-300 overflow-hidden shadow-inner ${
        isDragOver ? 'border-blue-500 bg-blue-50 shadow-blue-500/20' : 'border-gray-300'
      } ${validDropZone ? 'shadow-lg' : 'border-red-500 bg-red-50 shadow-red-500/20'}`}
      onMouseMove={handleMouseMove}
onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="application"
      aria-label="Canvas for building tax and asset protection structures"
      tabIndex="0"
      style={{ minHeight: '100%' }}
    >
{/* Validation Error Display */}
      {validationErrors.length > 0 && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-30 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="AlertCircle" size={16} />
            <span className="font-semibold">Validation Error</span>
          </div>
          <ul className="text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
{/* SVG for connections */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 1 }}
        role="img"
        aria-label="Connection diagram showing relationships between entities"
      >
        <defs>
          <filter id="connection-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
{connections.map(renderConnection)}
        
        {/* Enhanced Connection Preview */}
        {isConnecting && connectionStart && connectionPreview && (
          <g>
            <defs>
              <marker
                id="preview-arrowhead"
                markerWidth="12"
                markerHeight="8"
                refX="10"
                refY="4"
                orient="auto"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="#3b82f6"
                  className="animate-pulse"
                />
              </marker>
            </defs>
            <path
              d={`M ${connectionPreview.from.x} ${connectionPreview.from.y} L ${connectionPreview.to.x} ${connectionPreview.to.y}`}
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="8,4"
              fill="none"
              markerEnd="url(#preview-arrowhead)"
              className="animate-pulse"
              filter="url(#connection-glow)"
            />
            <circle
              cx={connectionPreview.from.x}
              cy={connectionPreview.from.y}
              r="6"
              fill="#3b82f6"
              className="animate-pulse"
            />
          </g>
        )}
      </svg>
      
{/* Empty state */}
      {entities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
            role="status"
            aria-live="polite"
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ApperIcon name="Layers" size={48} className="text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Building Your Structure
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Drag components from the toolbar to visualize your tax and asset protection strategy
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <ApperIcon name="MousePointer" size={16} />
              <span>Drag from library or click to add</span>
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
            
{/* Enhanced Connection handles with touch support */}
            <div className="absolute -top-2 -right-2 connection-handle">
              <button
                className={`w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all duration-200 flex items-center justify-center touch-target ${
                  isConnecting && connectionStart === entity.id 
                    ? 'bg-green-500 hover:bg-green-600 scale-110' 
                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-110'
                }`}
                onMouseDown={(e) => handleConnectionStart(entity.id, e)}
                onMouseUp={(e) => handleConnectionEnd(entity.id, e)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleConnectionStart(entity.id, e);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleConnectionEnd(entity.id, e);
                }}
                title="Connect to another entity"
                aria-label={`Create connection from ${entity.type} ${entity.name}`}
              >
                <ApperIcon 
                  name={isConnecting && connectionStart === entity.id ? "Link" : "Plus"} 
                  size={14} 
                  className="text-white" 
                />
              </button>
            </div>
            
            {/* Validation indicator for entity */}
            {validationErrors.length > 0 && draggedEntity?.id === entity.id && (
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <ApperIcon name="AlertCircle" size={12} className="text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
);
});

Canvas.displayName = 'Canvas';

export default Canvas;