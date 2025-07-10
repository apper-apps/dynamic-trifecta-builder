import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Canvas from "@/components/organisms/Canvas";
import EntityService from "@/services/api/EntityService";
import ConnectionService from "@/services/api/ConnectionService";
import AIService from "@/services/api/AIService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const CanvasPage = () => {
  const [entities, setEntities] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.message || "Failed to load data");
      toast.error("Failed to load your structure");
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
    }
  };

  const handleAddEntity = async (type) => {
    try {
      const newEntity = await EntityService.create({
        type,
        name: `New ${type}`,
        position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
        properties: {
          description: `A new ${type} entity`
        }
      });
      
      setEntities(prev => [...prev, newEntity]);
      setSelectedEntity(newEntity);
      toast.success(`${type} added successfully!`);
    } catch (err) {
      toast.error(`Failed to add ${type}`);
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
      const newConnection = await ConnectionService.create(connectionData);
      setConnections(prev => [...prev, newConnection]);
      toast.success("Connection created successfully!");
    } catch (err) {
      toast.error("Failed to create connection");
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
    <Layout
      onAddEntity={handleAddEntity}
      suggestions={suggestions}
      entities={entities}
      connections={connections}
      selectedEntity={selectedEntity}
      onUpdateEntity={handleUpdateEntity}
      onDeselectEntity={handleDeselectEntity}
    >
      {entities.length === 0 ? (
        <Empty
          title="Start Building Your Trifecta Structure"
          message="Design your tax and asset protection strategy with our intuitive drag-and-drop builder. Add entities, connect them, and get AI-powered suggestions from Mark Kohler's expertise."
          actionLabel="Add First Entity"
          onAction={() => handleAddEntity("Trust")}
          icon="Layers"
        />
      ) : (
        <Canvas
          entities={entities}
          connections={connections}
          selectedEntity={selectedEntity}
          onSelectEntity={handleSelectEntity}
          onUpdateEntity={handleUpdateEntity}
          onDeleteEntity={handleDeleteEntity}
          onAddConnection={handleAddConnection}
          onDeleteConnection={handleDeleteConnection}
        />
      )}
    </Layout>
  );
};

export default CanvasPage;