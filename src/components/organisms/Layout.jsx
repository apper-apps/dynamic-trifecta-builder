import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [exportPanelOpen, setExportPanelOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Desktop Left Sidebar - Assets */}
      <motion.div 
        initial={false}
        animate={{ width: leftSidebarOpen ? 280 : 0 }}
        className="hidden lg:block bg-white border-r border-gray-200 overflow-hidden shadow-lg"
        role="complementary"
        aria-label="Assets section - Trust and LLC components"
      >
        <div className="p-4 w-70">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Shield" size={16} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Assets</h1>
                <p className="text-xs text-green-600 font-medium">Protection & Holdings</p>
              </div>
            </div>
          </div>
          <ComponentToolbar onAddEntity={onAddEntity} sectionType="assets" />
        </div>
      </motion.div>

      {/* Mobile Left Sidebar Overlay */}
      <motion.div
        initial={false}
        animate={{ x: leftSidebarOpen ? 0 : -280 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-70 bg-white border-r border-gray-200 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile component library"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Shield" size={16} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Assets</h1>
                <p className="text-xs text-green-600 font-medium">Protection & Holdings</p>
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
        {/* Enhanced Header with Quick Actions */}
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
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className="touch-target"
              aria-label="Toggle AI Assistant"
            >
              <ApperIcon name="Bot" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExportPanelOpen(!exportPanelOpen)}
              className="touch-target"
              aria-label="Toggle Export & Share"
            >
              <ApperIcon name="Download" size={20} />
            </Button>
            
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
        
        {/* Enhanced Canvas Area */}
        <main className="flex-1 p-6 relative overflow-hidden" role="main">
          <div className="h-full w-full relative">
            {children}
          </div>
        </main>
      </div>

      {/* Desktop Right Sidebar - Operations */}
      <motion.div 
        initial={false}
        animate={{ width: rightSidebarOpen ? 280 : 0 }}
        className="hidden lg:block bg-white border-l border-gray-200 overflow-hidden shadow-lg"
        role="complementary"
        aria-label="Operations section"
      >
        <div className="p-4 w-70 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="Briefcase" size={16} className="text-white" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Operations</h2>
              <p className="text-xs text-red-600 font-medium">Business & Tax Filing</p>
            </div>
          </div>
          
          <ComponentToolbar onAddEntity={onAddEntity} sectionType="operations" />
          
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
        animate={{ x: rightSidebarOpen ? 0 : 280 }}
        className="lg:hidden fixed inset-y-0 right-0 z-50 w-70 bg-white border-l border-gray-200 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile operations panel"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Briefcase" size={16} className="text-white" />
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
          
          {selectedEntity && (
            <PropertiesPanel
              selectedEntity={selectedEntity}
              onUpdateEntity={onUpdateEntity}
              onClose={onDeselectEntity}
            />
          )}
        </div>
      </motion.div>

      {/* Floating AI Assistant Panel */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 300 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 300 }}
            className="fixed top-20 right-4 w-96 z-60 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="AI Assistant Panel"
          >
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Bot" size={20} />
                  <span className="font-semibold">AI Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiPanelOpen(false)}
                  className="text-white hover:bg-white/20 touch-target"
                  aria-label="Close AI Assistant"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              <div className="p-4">
                <AIChat 
                  suggestions={suggestions}
                  entities={entities}
                  connections={connections}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Export & Share Panel */}
      <AnimatePresence>
        {exportPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 300 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 300 }}
            className="fixed top-20 right-4 w-80 z-60 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Export & Share Panel"
          >
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500 to-blue-600 text-white">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Download" size={20} />
                  <span className="font-semibold">Export & Share</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExportPanelOpen(false)}
                  className="text-white hover:bg-white/20 touch-target"
                  aria-label="Close Export & Share"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              <div className="p-4">
                <ExportControls 
                  entities={entities}
                  connections={connections}
                  canvasRef={canvasRef}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Floating Panel Backdrop */}
      {(aiPanelOpen || exportPanelOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-50"
          onClick={() => {
            setAiPanelOpen(false);
            setExportPanelOpen(false);
          }}
          role="button"
          tabIndex={0}
          aria-label="Close floating panels"
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              setAiPanelOpen(false);
              setExportPanelOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default Layout;