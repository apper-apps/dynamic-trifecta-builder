import React, { useState } from "react";
import { motion } from "framer-motion";
import ComponentToolbar from "@/components/molecules/ComponentToolbar";
import AIChat from "@/components/molecules/AIChat";
import ExportControls from "@/components/molecules/ExportControls";
import PropertiesPanel from "@/components/molecules/PropertiesPanel";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Layout = ({ 
  children, 
  onAddEntity,
  suggestions,
  entities,
  connections,
  selectedEntity,
  onUpdateEntity,
  onDeselectEntity,
  canvasRef
}) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Left Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: leftSidebarOpen ? 320 : 0 }}
        className="hidden lg:block bg-white border-r border-gray-200 overflow-hidden"
      >
        <div className="p-6 w-80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Layers" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trifecta Builder</h1>
                <p className="text-sm text-gray-600">Tax Strategy Designer</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(false)}
              className="lg:hidden"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <ComponentToolbar onAddEntity={onAddEntity} />
        </div>
      </motion.div>

      {/* Mobile Left Sidebar Overlay */}
      <motion.div
        initial={false}
        animate={{ x: leftSidebarOpen ? 0 : -320 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Layers" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trifecta Builder</h1>
                <p className="text-sm text-gray-600">Tax Strategy Designer</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(false)}
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <ComponentToolbar onAddEntity={onAddEntity} />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(true)}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="hidden lg:flex"
            >
              <ApperIcon name="PanelLeft" size={20} />
            </Button>
            
            <div className="text-sm text-gray-600">
              {entities.length} entities • {connections.length} connections
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              <ApperIcon name="PanelRight" size={20} />
            </Button>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>

      {/* Desktop Right Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: rightSidebarOpen ? 320 : 0 }}
        className="hidden lg:block bg-white border-l border-gray-200 overflow-hidden"
      >
        <div className="p-6 w-80 space-y-6">
          <AIChat 
            suggestions={suggestions}
            entities={entities}
            connections={connections}
          />
          
<ExportControls 
            entities={entities}
            connections={connections}
            canvasRef={canvasRef}
          />
          
          {selectedEntity && (
            <PropertiesPanel
              selectedEntity={selectedEntity}
              onUpdateEntity={onUpdateEntity}
              onClose={onDeselectEntity}
            />
          )}
        </div>
      </motion.div>

      {/* Mobile Right Sidebar Overlay */}
      <motion.div
        initial={false}
        animate={{ x: rightSidebarOpen ? 0 : 320 }}
        className="lg:hidden fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-gray-200 shadow-xl"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Assistant</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarOpen(false)}
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <AIChat 
            suggestions={suggestions}
            entities={entities}
            connections={connections}
          />
          
<ExportControls 
            entities={entities}
            connections={connections}
            canvasRef={canvasRef}
          />
          
          {selectedEntity && (
            <PropertiesPanel
              selectedEntity={selectedEntity}
              onUpdateEntity={onUpdateEntity}
              onClose={onDeselectEntity}
            />
          )}
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;