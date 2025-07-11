import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
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
  const [selectedEntities, setSelectedEntities] = useState(new Set());
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [clipboard, setClipboard] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);
  const [showAlignmentGuides, setShowAlignmentGuides] = useState(true);
  const [alignmentGuides, setAlignmentGuides] = useState([]);
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

// Enhanced mouse down handler with multi-select support
  const handleMouseDown = useCallback((e, entity) => {
    if (e.target.closest(".connection-handle")) return;
    
    // Prevent null reference error and ensure canvas is available
    if (!canvasRef.current || !e.currentTarget) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const entityRect = e.currentTarget.getBoundingClientRect();
    
    // Handle multi-select with Ctrl/Cmd key
    if (e.ctrlKey || e.metaKey) {
      setIsMultiSelect(true);
      const newSelection = new Set(selectedEntities);
      if (newSelection.has(entity.id)) {
        newSelection.delete(entity.id);
      } else {
        newSelection.add(entity.id);
      }
      setSelectedEntities(newSelection);
      return;
    }
    
    // Clear previous validation errors
    setValidationErrors([]);
    
    // If entity is not in current selection, start new selection
    if (!selectedEntities.has(entity.id)) {
      setSelectedEntities(new Set([entity.id]));
      onSelectEntity(entity);
    }
    
    setDraggedEntity(entity);
    setDragOffset({
      x: e.clientX - entityRect.left,
      y: e.clientY - entityRect.top
    });
    
    // Add mouse move and up listeners to document for better tracking
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onSelectEntity, selectedEntities]);

  // Enhanced mouse move handler with multi-entity support
  const handleMouseMove = useCallback((e) => {
    if (!draggedEntity || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = e.clientX - rect.left - dragOffset.x - draggedEntity.position.x;
    const deltaY = e.clientY - rect.top - dragOffset.y - draggedEntity.position.y;
    
    // Move all selected entities
    selectedEntities.forEach(entityId => {
      const entity = entities.find(e => e.id === entityId);
      if (!entity) return;
      
      const newPosition = {
        x: entity.position.x + deltaX,
        y: entity.position.y + deltaY
      };
      
      // Snap to grid
      const snappedPosition = snapToGrid(newPosition);
      
      // Constrain to canvas bounds
      const entityWidth = 200;
      const entityHeight = 150;
      snappedPosition.x = Math.max(0, Math.min(rect.width - entityWidth, snappedPosition.x));
      snappedPosition.y = Math.max(0, Math.min(rect.height - entityHeight, snappedPosition.y));
      
      // Update alignment guides
      if (showAlignmentGuides) {
        updateAlignmentGuides(entity, snappedPosition);
      }
      
      // Update entity position immediately for smooth dragging
      onUpdateEntity(entity.id, {
        ...entity,
        position: snappedPosition
      });
    });
  }, [draggedEntity, dragOffset, onUpdateEntity, entities, selectedEntities, showAlignmentGuides]);

  const handleMouseUp = useCallback(() => {
    setDraggedEntity(null);
    setDragOffset({ x: 0, y: 0 });
    setValidationErrors([]);
    setValidDropZone(true);
    setAlignmentGuides([]);
    
    // Clean up event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
// Enhanced keyboard navigation and shortcuts
  const handleKeyDown = useCallback((e) => {
    if (!canvasRef.current) return;
    
    // Check if we're in an input field
    const isInputField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true';
    if (isInputField) return;
    
    // Prevent default for handled keys
    const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'KeyC', 'KeyV', 'KeyZ', 'KeyY', 'KeyA', 'Escape', 'Space'];
    if (handledKeys.includes(e.code) || (e.ctrlKey && handledKeys.includes(e.code))) {
      e.preventDefault();
    }
    
    // Enhanced movement with arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      if (selectedEntities.size === 0) return;
      
      const moveDistance = e.shiftKey ? 40 : e.ctrlKey ? 5 : 20; // Fine/normal/large movement
      const deltaX = e.code === 'ArrowLeft' ? -moveDistance : e.code === 'ArrowRight' ? moveDistance : 0;
      const deltaY = e.code === 'ArrowUp' ? -moveDistance : e.code === 'ArrowDown' ? moveDistance : 0;
      
      selectedEntities.forEach(entityId => {
        const entity = entities.find(e => e.id === entityId);
        if (!entity) return;
        
        const newPosition = {
          x: Math.max(0, Math.min(1200, entity.position.x + deltaX)), // Canvas bounds
          y: Math.max(0, Math.min(800, entity.position.y + deltaY))
        };
        
        // Snap to grid if enabled
        const snappedPosition = snapToGrid(newPosition);
        
        onUpdateEntity(entity.id, {
          ...entity,
          position: snappedPosition
        });
      });
    }
    
    // Enhanced delete with confirmation for multiple items
    if (e.code === 'Delete' || e.code === 'Backspace') {
      if (selectedEntities.size === 0) return;
      
      if (selectedEntities.size > 1) {
        const confirmed = window.confirm(`Delete ${selectedEntities.size} selected entities?`);
        if (!confirmed) return;
      }
      
      selectedEntities.forEach(entityId => {
        onDeleteEntity(entityId);
      });
      setSelectedEntities(new Set());
    }
    
    // Copy (Ctrl+C)
    if (e.ctrlKey && e.code === 'KeyC') {
      handleCopy();
    }
    
    // Paste (Ctrl+V)
    if (e.ctrlKey && e.code === 'KeyV') {
      handlePaste();
    }
    
    // Undo (Ctrl+Z)
    if (e.ctrlKey && e.code === 'KeyZ' && !e.shiftKey) {
      handleUndo();
    }
    
    // Redo (Ctrl+Y or Ctrl+Shift+Z)
    if ((e.ctrlKey && e.code === 'KeyY') || (e.ctrlKey && e.shiftKey && e.code === 'KeyZ')) {
      handleRedo();
    }
    
    // Select all (Ctrl+A)
    if (e.ctrlKey && e.code === 'KeyA') {
      setSelectedEntities(new Set(entities.map(e => e.id)));
    }
    
    // Escape to clear selection
    if (e.code === 'Escape') {
      setSelectedEntities(new Set());
      setIsConnecting(false);
      setConnectionStart(null);
      setConnectionPreview(null);
    }
    
    // Space to toggle grid
    if (e.code === 'Space' && !e.ctrlKey) {
      setShowGrid(!showGrid);
    }
  }, [entities, selectedEntities, onUpdateEntity, onDeleteEntity, showGrid, snapToGrid]);

// Enhanced zoom and pan functionality
  const handleWheel = useCallback((e) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom with Ctrl/Cmd + wheel
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(3, Math.max(0.25, zoom * delta));
      
      // Zoom towards mouse position
      const zoomFactor = newZoom / zoom;
      setPan(prev => ({
        x: prev.x - (mouseX - prev.x) * (zoomFactor - 1),
        y: prev.y - (mouseY - prev.y) * (zoomFactor - 1)
      }));
      
      setZoom(newZoom);
    } else {
      // Enhanced pan with wheel - smoother and more responsive
      const panSpeed = 1.5;
      setPan(prev => ({
        x: Math.max(-500, Math.min(500, prev.x - e.deltaX * panSpeed)),
        y: Math.max(-500, Math.min(500, prev.y - e.deltaY * panSpeed))
      }));
    }
  }, [zoom]);

  // Enhanced pan start handler with touch support
  const handlePanStart = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && (e.altKey || e.ctrlKey))) { // Middle mouse or Alt/Ctrl+Left mouse
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
      canvasRef.current.style.cursor = 'grabbing';
    }
  }, [pan]);

  // Enhanced pan move handler
  const handlePanMove = useCallback((e) => {
    if (!isPanning) return;
    
    const newPan = {
      x: Math.max(-500, Math.min(500, e.clientX - panStart.x)),
      y: Math.max(-500, Math.min(500, e.clientY - panStart.y))
    };
    
    setPan(newPan);
  }, [isPanning, panStart]);

  // Enhanced pan end handler
  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
  }, []);

  // Copy functionality
  const handleCopy = useCallback(() => {
    const entitiesToCopy = entities.filter(e => selectedEntities.has(e.id));
    setClipboard(entitiesToCopy);
  }, [entities, selectedEntities]);

  // Paste functionality
  const handlePaste = useCallback(() => {
    if (clipboard.length === 0) return;
    
    const pastedEntities = [];
    clipboard.forEach(entity => {
      const newPosition = {
        x: entity.position.x + 50,
        y: entity.position.y + 50
      };
      
      // Create new entity with offset position
      const newEntity = {
        ...entity,
        id: Date.now() + Math.random(),
        position: newPosition,
        name: `${entity.name} (Copy)`
      };
      
      pastedEntities.push(newEntity);
      onAddEntity(entity.type, newPosition);
    });
    
    // Select pasted entities
    setTimeout(() => {
      setSelectedEntities(new Set(pastedEntities.map(e => e.id)));
    }, 100);
  }, [clipboard, onAddEntity]);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      // Apply previous state - this would need integration with parent state
    }
  }, [history, historyIndex]);

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      // Apply next state - this would need integration with parent state
    }
  }, [history, historyIndex]);

  // Selection rectangle functionality
  const handleSelectionStart = useCallback((e) => {
    if (e.button !== 0 || e.target !== canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setIsSelecting(true);
    setSelectionRect({
      startX,
      startY,
      endX: startX,
      endY: startY
    });
  }, []);

  const handleSelectionMove = useCallback((e) => {
    if (!isSelecting || !selectionRect) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    setSelectionRect(prev => ({
      ...prev,
      endX,
      endY
    }));
    
    // Update selected entities based on rectangle
    const minX = Math.min(selectionRect.startX, endX);
    const maxX = Math.max(selectionRect.startX, endX);
    const minY = Math.min(selectionRect.startY, endY);
    const maxY = Math.max(selectionRect.startY, endY);
    
    const entitiesInRect = entities.filter(entity => {
      const entityX = entity.position.x;
      const entityY = entity.position.y;
      return entityX >= minX && entityX <= maxX && entityY >= minY && entityY <= maxY;
    });
    
    setSelectedEntities(new Set(entitiesInRect.map(e => e.id)));
  }, [isSelecting, selectionRect, entities]);

  const handleSelectionEnd = useCallback(() => {
    setIsSelecting(false);
    setSelectionRect(null);
  }, []);

  // Alignment guides
  const updateAlignmentGuides = useCallback((movingEntity, newPosition) => {
    const guides = [];
    const threshold = 10;
    
    entities.forEach(entity => {
      if (entity.id === movingEntity.id) return;
      
      // Vertical alignment
      if (Math.abs(entity.position.x - newPosition.x) < threshold) {
        guides.push({
          type: 'vertical',
          position: entity.position.x,
          start: Math.min(entity.position.y, newPosition.y),
          end: Math.max(entity.position.y + 150, newPosition.y + 150)
        });
      }
      
      // Horizontal alignment
      if (Math.abs(entity.position.y - newPosition.y) < threshold) {
        guides.push({
          type: 'horizontal',
          position: entity.position.y,
          start: Math.min(entity.position.x, newPosition.x),
          end: Math.max(entity.position.x + 200, newPosition.x + 200)
        });
      }
    });
    
    setAlignmentGuides(guides);
  }, [entities]);

  // Canvas tools
  const handleAlignLeft = useCallback(() => {
    if (selectedEntities.size < 2) return;
    
    const entitiesArray = entities.filter(e => selectedEntities.has(e.id));
    const minX = Math.min(...entitiesArray.map(e => e.position.x));
    
    entitiesArray.forEach(entity => {
      onUpdateEntity(entity.id, {
        ...entity,
        position: { ...entity.position, x: minX }
      });
    });
  }, [entities, selectedEntities, onUpdateEntity]);

  const handleAlignTop = useCallback(() => {
    if (selectedEntities.size < 2) return;
    
    const entitiesArray = entities.filter(e => selectedEntities.has(e.id));
    const minY = Math.min(...entitiesArray.map(e => e.position.y));
    
    entitiesArray.forEach(entity => {
      onUpdateEntity(entity.id, {
        ...entity,
        position: { ...entity.position, y: minY }
      });
    });
  }, [entities, selectedEntities, onUpdateEntity]);

  const handleDistributeHorizontally = useCallback(() => {
    if (selectedEntities.size < 3) return;
    
    const entitiesArray = entities.filter(e => selectedEntities.has(e.id))
      .sort((a, b) => a.position.x - b.position.x);
    
    const totalWidth = entitiesArray[entitiesArray.length - 1].position.x - entitiesArray[0].position.x;
    const spacing = totalWidth / (entitiesArray.length - 1);
    
    entitiesArray.forEach((entity, index) => {
      if (index === 0 || index === entitiesArray.length - 1) return;
      
      onUpdateEntity(entity.id, {
        ...entity,
        position: {
          ...entity.position,
          x: entitiesArray[0].position.x + (spacing * index)
        }
      });
    });
  }, [entities, selectedEntities, onUpdateEntity]);

// Enhanced keyboard and mouse event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Make canvas focusable for keyboard events
    canvas.setAttribute('tabindex', '0');
    
    const handleKeyDownWrapper = (e) => {
      handleKeyDown(e);
    };
    
    const handleWheelWrapper = (e) => {
      handleWheel(e);
    };
    
    const handleMouseDownWrapper = (e) => {
      handlePanStart(e);
    };
    
    canvas.addEventListener('keydown', handleKeyDownWrapper);
    canvas.addEventListener('wheel', handleWheelWrapper, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDownWrapper);
    
    // Focus canvas on mount for immediate keyboard access
    canvas.focus();
    
    return () => {
      canvas.removeEventListener('keydown', handleKeyDownWrapper);
      canvas.removeEventListener('wheel', handleWheelWrapper);
      canvas.removeEventListener('mousedown', handleMouseDownWrapper);
    };
  }, [handleKeyDown, handleWheel, handlePanStart]);

  // Enhanced pan event listeners with proper cleanup
  useEffect(() => {
    if (!isPanning) return;
    
    const handlePanMoveWrapper = (e) => {
      handlePanMove(e);
    };
    
    const handlePanEndWrapper = () => {
      handlePanEnd();
    };
    
    document.addEventListener('mousemove', handlePanMoveWrapper);
    document.addEventListener('mouseup', handlePanEndWrapper);
    document.addEventListener('mouseleave', handlePanEndWrapper);
    
    return () => {
      document.removeEventListener('mousemove', handlePanMoveWrapper);
      document.removeEventListener('mouseup', handlePanEndWrapper);
      document.removeEventListener('mouseleave', handlePanEndWrapper);
    };
  }, [isPanning, handlePanMove, handlePanEnd]);

  // Add selection rectangle listeners
  useEffect(() => {
    if (!isSelecting) return;
    
    document.addEventListener('mousemove', handleSelectionMove);
    document.addEventListener('mouseup', handleSelectionEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleSelectionMove);
      document.removeEventListener('mouseup', handleSelectionEnd);
    };
  }, [isSelecting, handleSelectionMove, handleSelectionEnd]);
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
      className={`relative w-full h-full ${showGrid ? 'canvas-grid' : ''} bg-white rounded-lg border-2 transition-all duration-300 overflow-hidden shadow-inner ${
        isDragOver ? 'border-blue-500 bg-blue-50 shadow-blue-500/20' : 'border-gray-300'
      } ${validDropZone ? 'shadow-lg' : 'border-red-500 bg-red-50 shadow-red-500/20'} ${
        isPanning ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleSelectionStart}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="application"
      aria-label="Interactive canvas for building tax and asset protection structures. Use keyboard shortcuts: Arrow keys to move, Ctrl+C/V to copy/paste, Space to toggle grid, Escape to clear selection."
      tabIndex="0"
      aria-describedby="canvas-instructions"
      style={{ 
        minHeight: '100%',
        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        transformOrigin: '0 0',
        transition: isPanning ? 'none' : 'transform 0.2s ease-out'
      }}
    >
      {/* Hidden instructions for screen readers */}
      <div id="canvas-instructions" className="sr-only">
        Canvas navigation: Use arrow keys to move selected entities, Ctrl+wheel to zoom, 
        drag with mouse to pan, Space to toggle grid, Escape to clear selection.
        Currently {entities.length} entities and {connections.length} connections.
        Zoom level: {Math.round(zoom * 100)}%
      </div>
      {/* Canvas Tools Overlay */}
      {selectedEntities.size > 0 && (
        <div className="absolute top-4 left-4 z-40 bg-white rounded-lg shadow-lg border p-2 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAlignLeft}
            className="p-2 hover:bg-gray-100 rounded"
            title="Align Left"
          >
            <ApperIcon name="AlignLeft" size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAlignTop}
            className="p-2 hover:bg-gray-100 rounded"
            title="Align Top"
          >
            <ApperIcon name="AlignTop" size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDistributeHorizontally}
            className="p-2 hover:bg-gray-100 rounded"
            title="Distribute Horizontally"
            disabled={selectedEntities.size < 3}
          >
            <ApperIcon name="DistributeHorizontal" size={16} />
          </motion.button>
          <div className="border-l mx-2" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded"
            title="Copy (Ctrl+C)"
          >
            <ApperIcon name="Copy" size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePaste}
            className="p-2 hover:bg-gray-100 rounded"
            title="Paste (Ctrl+V)"
            disabled={clipboard.length === 0}
          >
            <ApperIcon name="Clipboard" size={16} />
          </motion.button>
        </div>
      )}
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-40 bg-white rounded-lg shadow-lg border p-2 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setZoom(Math.min(3, zoom * 1.2))}
          className="p-2 hover:bg-gray-100 rounded"
          title="Zoom In"
        >
          <ApperIcon name="ZoomIn" size={16} />
        </motion.button>
        <div className="text-xs text-center font-mono">{Math.round(zoom * 100)}%</div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setZoom(Math.max(0.5, zoom * 0.8))}
          className="p-2 hover:bg-gray-100 rounded"
          title="Zoom Out"
        >
          <ApperIcon name="ZoomOut" size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="p-2 hover:bg-gray-100 rounded"
          title="Reset View"
        >
          <ApperIcon name="Home" size={16} />
        </motion.button>
      </div>
      
      {/* Selection Rectangle */}
      {isSelecting && selectionRect && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20 pointer-events-none"
          style={{
            left: Math.min(selectionRect.startX, selectionRect.endX),
            top: Math.min(selectionRect.startY, selectionRect.endY),
            width: Math.abs(selectionRect.endX - selectionRect.startX),
            height: Math.abs(selectionRect.endY - selectionRect.startY)
          }}
        />
      )}
      
      {/* Alignment Guides */}
      {showAlignmentGuides && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
          {alignmentGuides.map((guide, index) => (
            <line
              key={index}
              x1={guide.type === 'vertical' ? guide.position : guide.start}
              y1={guide.type === 'vertical' ? guide.start : guide.position}
              x2={guide.type === 'vertical' ? guide.position : guide.end}
              y2={guide.type === 'vertical' ? guide.end : guide.position}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.7"
            />
          ))}
        </svg>
      )}
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
              isSelected={selectedEntity?.id === entity.id || selectedEntities.has(entity.id)}
              isMultiSelected={selectedEntities.has(entity.id)}
              onSelect={() => onSelectEntity(entity)}
              onDelete={onDeleteEntity}
              isDragging={draggedEntity?.id === entity.id}
            />
            
            {/* Multi-select indicator */}
            {selectedEntities.has(entity.id) && selectedEntities.size > 1 && (
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">{Array.from(selectedEntities).indexOf(entity.id) + 1}</span>
              </div>
            )}
            
            {/* Enhanced Connection handles with touch support */}
{/* Enhanced Connection handles with improved touch support */}
            <div className="absolute -top-2 -right-2 connection-handle">
              <button
                className={`w-10 h-10 rounded-full border-2 border-white shadow-lg transition-all duration-200 flex items-center justify-center touch-target ${
                  isConnecting && connectionStart === entity.id
                    ? 'bg-green-500 hover:bg-green-600 scale-110 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-110 active:scale-95'
                }`}
                onMouseDown={(e) => handleConnectionStart(entity.id, e)}
                onMouseUp={(e) => handleConnectionEnd(entity.id, e)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleConnectionStart(entity.id, e);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleConnectionEnd(entity.id, e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleConnectionStart(entity.id, e);
                  }
                }}
                title={`Connect ${entity.type} to another entity`}
                aria-label={`Create connection from ${entity.type} ${entity.name}. Click and drag to another entity to create a connection.`}
                tabIndex="0"
              >
                <ApperIcon 
                  name={isConnecting && connectionStart === entity.id ? "Link" : "Plus"} 
                  size={16} 
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
      
      {/* Enhanced help overlay */}
      {entities.length > 0 && selectedEntities.size === 0 && (
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 max-w-sm">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <ApperIcon name="Info" size={16} className="text-blue-500" />
            Quick Tips
          </h4>
          <div className="space-y-1 text-sm text-gray-700">
            <p>• <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Click</kbd> to select entities</p>
            <p>• <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+Click</kbd> for multi-select</p>
            <p>• <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Arrow keys</kbd> to move selected</p>
            <p>• <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+Wheel</kbd> to zoom</p>
<p>• <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Space</kbd> to toggle grid</p>
          </div>
        </div>
      )}
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;