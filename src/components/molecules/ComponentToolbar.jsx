import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const ComponentToolbar = ({ onAddEntity }) => {
  const entityTypes = [
    {
      type: "Trust",
      icon: "Shield",
      color: "trust",
      description: "Revocable Living Trust",
      gradient: "from-trust to-green-600"
    },
    {
      type: "LLC",
      icon: "Building2",
      color: "llc",
      description: "Limited Liability Company",
      gradient: "from-llc to-blue-600"
    },
    {
      type: "SCorp",
      icon: "Briefcase",
      color: "scorp",
      description: "S Corporation",
      gradient: "from-scorp to-red-600"
    },
    {
      type: "Form1040",
      icon: "FileText",
      color: "form1040",
      description: "Individual Tax Return",
      gradient: "from-form1040 to-gray-600"
    }
  ];

const [hoveredEntity, setHoveredEntity] = React.useState(null);

  const entityTooltips = {
    Trust: "Asset protection vault - like a security blanket for your stuff! 🛡️",
    LLC: "Business bubble wrap - keeps your assets nice and separate! 📦",
    SCorp: "Tax-smart business structure - pays you a salary AND profits! 💼",
    Form1040: "Your personal tax blender - where all income gets mixed! 📋"
  };

const handleMouseEnter = (entityType, event) => {
    setHoveredEntity({ type: entityType, element: event.currentTarget });
  };

  const handleMouseLeave = () => {
    setHoveredEntity(null);
  };

  return (
    <Card className="p-6 h-fit shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <ApperIcon name="Layers" size={20} className="text-blue-600" />
        </motion.div>
        <h2 className="text-lg font-semibold text-gray-900">Components</h2>
      </div>
      
      <div className="space-y-3">
        {entityTypes.map((entity, index) => (
          <motion.div
            key={entity.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
          >
<div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", entity.type);
                e.dataTransfer.effectAllowed = "copy";
                e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
              }}
              onDragEnd={(e) => {
                // Clean up drag state
                e.currentTarget.style.opacity = "1";
              }}
              className="mb-2 relative"
              onMouseEnter={(e) => handleMouseEnter(entity.type, e)}
              onMouseLeave={handleMouseLeave}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddEntity(entity.type)}
                className="w-full justify-start p-3 h-auto hover:shadow-lg drag-handle transition-all duration-300 hover:scale-105 interactive-element border-2 hover:border-blue-400 touch-target"
                aria-label={`Add ${entity.type} component - ${entityTooltips[entity.type]}`}
              >
                <motion.div 
                  className={`p-2 rounded-lg bg-gradient-to-r ${entity.gradient} mr-3 shadow-md`}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApperIcon name={entity.icon} size={16} className="text-white" />
                </motion.div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{entity.type}</div>
                  <div className="text-xs text-gray-600 font-medium">{entity.description}</div>
                </div>
              </Button>
              
              {/* Playful tooltip */}
{hoveredEntity?.type === entity.type && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute z-50 left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs pointer-events-none"
                  role="tooltip"
                  aria-live="polite"
                >
                  {entityTooltips[entity.type]}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                    <div className="border-4 border-transparent border-r-gray-900"></div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-blue-300 shadow-md"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-2">
          <motion.div
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ApperIcon name="Lightbulb" size={16} className="text-yellow-600 mt-0.5" />
          </motion.div>
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-1">Pro Tip from Mark Kohler!</p>
            <p className="font-medium">Drag components to the canvas or click to add. Connect entities to show relationships and watch the magic happen! ✨</p>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default ComponentToolbar;