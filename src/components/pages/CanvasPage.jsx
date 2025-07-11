import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Canvas from "@/components/organisms/Canvas";
import Layout from "@/components/organisms/Layout";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import EntityService from "@/services/api/EntityService";
import ConnectionService from "@/services/api/ConnectionService";
import AIService from "@/services/api/AIService";
const CanvasPage = () => {
  const [entities, setEntities] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Generate AI suggestions when structure changes
  useEffect(() => {
    if (entities.length > 0 || connections.length > 0) {
      generateSuggestions();
    }
  }, [entities, connections]);

const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [entitiesData, connectionsData] = await Promise.all([
        EntityService.getAll(),
        ConnectionService.getAll()
      ]);
      
      setEntities(entitiesData);
      setConnections(connectionsData);
      
      // Show welcome message for new users
      if (entitiesData.length === 0) {
        setTimeout(() => {
          toast.info("Welcome to Trifecta Builder! Start by adding your first entity from the sidebar. 🚀");
        }, 1000);
      }
    } catch (err) {
      setError(err.message || "Failed to load data");
      toast.error("Failed to load your structure - please check your connection");
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async () => {
    try {
      const newSuggestions = await AIService.generateSuggestions(entities, connections);
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error("Failed to generate suggestions:", err);
      // Don't show error to user as this is not critical
    }
  };

const handleAddEntity = async (type, customPosition = null) => {
    try {
      setIsDragging(true);
      
      // Validation: Only one Form1040 allowed
      if (type === "Form1040" && entities.some(e => e.type === "Form1040")) {
        toast.error("Only one Form 1040 allowed per structure");
        return;
      }
      
      // Smart positioning system - distribute entities intelligently
      const defaultPositions = {
        Trust: { x: 300, y: 400 },      // Center bottom
        Form1040: { x: 300, y: 600 },  // Below Trust
        LLC: { x: 500, y: 300 },       // Right side
        SCorp: { x: 100, y: 300 }      // Left side
      };
      
      let position = customPosition || defaultPositions[type] || 
        { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 };
      
      // Enhanced collision detection with spiral search
      const entitySize = { width: 200, height: 150 };
      let attempts = 0;
      const maxAttempts = 20;
      const searchRadius = 50;
      
      while (attempts < maxAttempts) {
        const overlap = entities.some(e => 
          Math.abs(e.position.x - position.x) < entitySize.width * 0.9 &&
          Math.abs(e.position.y - position.y) < entitySize.height * 0.9
        );
        
        if (!overlap) break;
        
        // Spiral search for free space
        const angle = (attempts / maxAttempts) * Math.PI * 2;
        const radius = searchRadius + (attempts * 10);
        position = {
          x: Math.max(50, Math.min(900, defaultPositions[type].x + Math.cos(angle) * radius)),
          y: Math.max(50, Math.min(600, defaultPositions[type].y + Math.sin(angle) * radius))
        };
        attempts++;
      }
      
      if (attempts >= maxAttempts && !customPosition) {
        toast.warning("Canvas is crowded - entity placed in available space");
      }
      
      const entityLabels = {
        Trust: "Foundation Trust",
        LLC: "Asset Holdings LLC",
        SCorp: "Business Operations", 
        Form1040: "Personal Tax Return"
      };
      
      const newEntity = await EntityService.create({
        type,
        name: entityLabels[type] || `New ${type}`,
        position,
        properties: {
          description: `A new ${type} entity for your structure`,
          state: "NV", // Default state
          taxElection: type === "LLC" ? "Partnership" : type === "SCorp" ? "S-Corp" : "Default"
        }
      });
      
      setEntities(prev => [...prev, newEntity]);
      setSelectedEntity(newEntity);
      toast.success(`${type} added successfully! 🎉`);
    } catch (err) {
      toast.error(`Failed to add ${type}: ${err.message}`);
    } finally {
      setIsDragging(false);
    }
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
  };

  const handleUpdateEntity = async (id, updatedEntity) => {
    try {
      const updated = await EntityService.update(id, updatedEntity);
      setEntities(prev => prev.map(e => e.id === id ? updated : e));
      setSelectedEntity(updated);
    } catch (err) {
      toast.error("Failed to update entity");
    }
  };

  const handleDeleteEntity = async (id) => {
    try {
      await EntityService.delete(id);
      setEntities(prev => prev.filter(e => e.id !== id));
      setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
      if (selectedEntity?.id === id) {
        setSelectedEntity(null);
      }
      toast.success("Entity deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete entity");
    }
  };

const handleAddConnection = async (connectionData) => {
    try {
      // Enhanced validation at the page level
      const fromEntity = entities.find(e => e.id === connectionData.from);
      const toEntity = entities.find(e => e.id === connectionData.to);
      
      if (!fromEntity || !toEntity) {
        toast.error("Invalid connection - entities not found");
        return;
      }
      
      // Check for duplicate connections (bidirectional)
      const isDuplicate = connections.some(c => 
        (c.from === connectionData.from && c.to === connectionData.to) ||
        (c.from === connectionData.to && c.to === connectionData.from)
      );
      
      if (isDuplicate) {
        toast.error("Connection already exists between these entities");
        return;
      }
      
      // Business logic validation
      if (fromEntity.type === "Form1040") {
        toast.error("Form 1040 cannot own other entities");
        return;
      }
      
      if (fromEntity.type === "Trust" && toEntity.type === "Trust") {
        toast.error("Trusts cannot directly own other Trusts");
        return;
      }
      
      const newConnection = await ConnectionService.create(connectionData);
      setConnections(prev => [...prev, newConnection]);
      toast.success(`Connection created: ${fromEntity.name} → ${toEntity.name} 🔗`);
    } catch (err) {
      toast.error(`Failed to create connection: ${err.message}`);
    }
  };

const handleDeleteConnection = async (id) => {
    try {
      await ConnectionService.delete(id);
      setConnections(prev => prev.filter(c => c.id !== id));
      toast.success("Connection deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete connection");
    }
  };
  const handleSuggestionAction = async (suggestion) => {
    try {
      if (suggestion.type === 'add_entity') {
        await handleAddEntity(suggestion.entityType, suggestion.position);
      } else if (suggestion.type === 'add_connection') {
        await handleAddConnection(suggestion.connectionData);
      } else if (suggestion.type === 'optimize_structure') {
        toast.info(suggestion.message || 'Optimization suggestion applied');
      }
    } catch (err) {
      toast.error('Failed to apply suggestion');
    }
  };

  const handleDeselectEntity = () => {
    setSelectedEntity(null);
  };
  if (loading) {
    return <Loading message="Loading your Trifecta structure..." />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load structure"
        message={error}
        onRetry={loadData}
      />
    );
  }

return (
    <div 
      className="h-screen flex flex-col" 
      role="application" 
      aria-label="Trifecta Tax Strategy Builder"
    >
      <Layout
        onAddEntity={handleAddEntity}
        suggestions={suggestions}
        entities={entities}
        connections={connections}
        selectedEntity={selectedEntity}
        onUpdateEntity={handleUpdateEntity}
        onDeselectEntity={handleDeselectEntity}
        onSuggestionAction={handleSuggestionAction}
        canvasRef={canvasRef}
      >
        {entities.length === 0 ? (
          <Empty
            title="Start Building Your Trifecta Structure 🏗️"
            message="Design your tax and asset protection strategy with our intuitive drag-and-drop builder. Add entities, connect them, and get AI-powered suggestions from Mark Kohler's expertise! ✨"
            actionLabel="Add First Entity 🚀"
            onAction={() => handleAddEntity("Trust")}
            icon="Layers"
          />
        ) : (
          <Canvas
            ref={canvasRef}
            entities={entities}
            connections={connections}
            selectedEntity={selectedEntity}
            onSelectEntity={handleSelectEntity}
            onUpdateEntity={handleUpdateEntity}
            onDeleteEntity={handleDeleteEntity}
            onAddConnection={handleAddConnection}
            onDeleteConnection={handleDeleteConnection}
            onAddEntity={handleAddEntity}
          />
        )}
      </Layout>
    </div>
  );
};

export default CanvasPage;