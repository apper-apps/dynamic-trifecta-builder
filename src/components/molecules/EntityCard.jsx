import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const EntityCard = ({ 
  entity, 
  isSelected, 
  onSelect, 
  onDelete,
  isDragging,
  ...props 
}) => {
const entityConfig = {
    Trust: {
      color: "trust",
      bgColor: "bg-trust",
      borderColor: "border-trust",
      textColor: "text-white",
      icon: "Shield",
      gradient: "from-trust to-green-600",
      category: "asset",
      categoryLabel: "Asset Protection"
    },
    LLC: {
      color: "llc",
      bgColor: "bg-llc",
      borderColor: "border-llc",
      textColor: "text-white",
      icon: "Building2",
      gradient: "from-llc to-blue-600",
      category: "asset",
      categoryLabel: "Asset Holdings"
    },
    SCorp: {
      color: "scorp",
      bgColor: "bg-scorp",
      borderColor: "border-scorp",
      textColor: "text-white",
      icon: "Briefcase",
      gradient: "from-scorp to-red-600",
      category: "operation",
      categoryLabel: "Business Operations"
    },
    Form1040: {
      color: "form1040",
      bgColor: "bg-form1040",
      borderColor: "border-form1040",
      textColor: "text-white",
      icon: "FileText",
      gradient: "from-form1040 to-gray-600",
      category: "operation",
      categoryLabel: "Tax Filing"
    }
  };

const config = entityConfig[entity.type] || entityConfig.Trust;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Voice narration for entity details
    const entityInfo = `${entity.type}: ${entity.name}. ${entity.properties.description || 'No description available.'}`;
    if ('speechSynthesis' in window && isHovered) {
      const utterance = new SpeechSynthesisUtterance(entityInfo);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.6;
      window.speechSynthesis.speak(utterance);
    }
  };

const handleMouseLeave = () => {
    setIsHovered(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
whileHover={{ scale: isDragging ? 1.0 : 1.08, y: isDragging ? 0 : -5 }}
      whileTap={{ scale: 0.95 }}
className={cn(
        "entity-card w-48 bg-white border-2 cursor-move select-none transition-all duration-300 shadow-lg hover:shadow-2xl",
        isSelected && "ring-4 ring-blue-500 ring-offset-2 shadow-blue-500/25",
        isDragging && "opacity-90 rotate-3 scale-105 shadow-2xl z-50 ring-2 ring-purple-400 border-purple-400",
        isHovered && !isDragging && "shadow-xl transform scale-105",
        config.borderColor,
        config.category === "asset" ? "entity-asset" : "entity-operation"
      )}
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label={`${entity.type} entity: ${entity.name}. Click to select, drag to move. ${entity.properties.description || ''}`}
      tabIndex="0"
      {...props}
    >
      <div className={cn(
        "px-4 py-3 rounded-t-lg bg-gradient-to-r shadow-inner",
        config.gradient
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={isHovered ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ApperIcon name={config.icon} size={20} className={config.textColor} />
            </motion.div>
            <span className={cn("font-bold text-lg", config.textColor)}>
              {entity.type}
            </span>
          </div>
<motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entity.id);
            }}
            className="text-white hover:text-red-200 transition-colors touch-target min-w-[44px] min-h-[44px] flex items-center justify-center"
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Delete ${entity.type} entity`}
          >
            <ApperIcon name="X" size={16} />
          </motion.button>
        </div>
      </div>
      
<div className="p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg">{entity.name}</h3>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-semibold",
            config.category === "asset" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}>
            {config.categoryLabel}
          </span>
        </div>
        <div className="space-y-1 text-sm text-gray-700">
          {entity.properties.description && (
            <p className="font-medium">{entity.properties.description}</p>
          )}
          {entity.properties.state && (
            <p className="font-semibold text-blue-700">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              State: {entity.properties.state}
            </p>
          )}
          {entity.properties.taxElection && (
            <p className="font-semibold text-green-700">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Tax: {entity.properties.taxElection}
            </p>
          )}
        </div>
      </div>
      
      {/* Visual enhancement indicators */}
      {isSelected && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      
      {isDragging && (
        <motion.div
          className="absolute inset-0 border-2 border-dashed border-purple-400 rounded-lg pointer-events-none"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default EntityCard;