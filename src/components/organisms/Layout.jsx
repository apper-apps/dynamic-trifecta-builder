import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import AIChat from "@/components/molecules/AIChat";
import PropertiesPanel from "@/components/molecules/PropertiesPanel";
import ComponentToolbar from "@/components/molecules/ComponentToolbar";
import ExportControls from "@/components/molecules/ExportControls";
import connectionsData from "@/services/mockData/connections.json";
import entitiesData from "@/services/mockData/entities.json";
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
        aria-label="Assets section - Trust and LLC components"
      >
        <div className="p-6 w-80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Shield" size={24} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Assets</h1>
                <p className="text-sm text-green-600 font-medium">Protection & Holdings</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(false)}
              className="lg:hidden touch-target"
              aria-label="Close assets sidebar"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
<ComponentToolbar onAddEntity={onAddEntity} sectionType="assets" />
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
                className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Shield" size={24} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Assets</h1>
                <p className="text-sm text-green-600 font-medium">Protection & Holdings</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(false)}
              className="touch-target"
              aria-label="Close mobile assets sidebar"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <ComponentToolbar onAddEntity={onAddEntity} sectionType="assets" />
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
size="sm"
              onClick={() => setLeftSidebarOpen(true)}
              className="lg:hidden touch-target"
              aria-label="Open assets section"
            >
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <Button
              variant="ghost"
size="sm"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="hidden lg:flex touch-target"
              aria-label={leftSidebarOpen ? "Hide assets section" : "Show assets section"}
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
              aria-label={rightSidebarOpen ? "Hide operations panel" : "Show operations panel"}
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
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="Briefcase" size={24} className="text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Operations</h2>
              <p className="text-sm text-red-600 font-medium">Business & Tax Filing</p>
            </div>
          </div>
          
          <ComponentToolbar onAddEntity={onAddEntity} sectionType="operations" />
          
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
        aria-label="Mobile operations panel"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Briefcase" size={20} className="text-white" />
              </motion.div>
              <h2 className="text-lg font-semibold text-gray-900">Operations</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarOpen(false)}
              className="touch-target"
              aria-label="Close mobile operations panel"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <ComponentToolbar onAddEntity={onAddEntity} sectionType="operations" />
          
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