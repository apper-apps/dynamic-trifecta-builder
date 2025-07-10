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
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Desktop Left Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: leftSidebarOpen ? 320 : 0 }}
        className="hidden lg:block bg-white border-r border-gray-200 overflow-hidden shadow-lg"
        role="complementary"
        aria-label="Component library and tools"
      >
        <div className="p-6 w-80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Layers" size={24} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trifecta Builder</h1>
                <p className="text-sm text-blue-600 font-medium">Tax Strategy Designer</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(false)}
              className="lg:hidden touch-target"
              aria-label="Close sidebar"
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
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile component library"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Layers" size={24} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trifecta Builder</h1>
                <p className="text-sm text-blue-600 font-medium">Tax Strategy Designer</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(false)}
              className="touch-target"
              aria-label="Close mobile sidebar"
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
        <header 
          className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm"
          role="banner"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(true)}
              className="lg:hidden touch-target"
              aria-label="Open component library"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="hidden lg:flex touch-target"
              aria-label={leftSidebarOpen ? "Hide component library" : "Show component library"}
            >
              <ApperIcon name="PanelLeft" size={20} />
            </Button>
            
            <div className="text-sm text-gray-600 font-medium">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {entities.length} entities
              </span>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {connections.length} connections
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="touch-target"
              aria-label={rightSidebarOpen ? "Hide assistant panel" : "Show assistant panel"}
            >
              <ApperIcon name="PanelRight" size={20} />
            </Button>
          </div>
        </header>
{/* Canvas Area */}
        <main className="flex-1 p-4 relative overflow-hidden" role="main">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
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
        role="dialog"
        aria-modal="true"
        aria-label="Mobile assistant panel"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Assistant</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarOpen(false)}
              className="touch-target"
              aria-label="Close mobile assistant panel"
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
          role="button"
          tabIndex={0}
          aria-label="Close mobile panels"
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              setLeftSidebarOpen(false);
              setRightSidebarOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default Layout;