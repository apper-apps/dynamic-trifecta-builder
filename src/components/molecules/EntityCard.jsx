import React from "react";
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
      gradient: "from-trust to-green-600"
    },
    LLC: {
      color: "llc",
      bgColor: "bg-llc",
      borderColor: "border-llc",
      textColor: "text-white",
      icon: "Building2",
      gradient: "from-llc to-blue-600"
    },
    SCorp: {
      color: "scorp",
      bgColor: "bg-scorp",
      borderColor: "border-scorp",
      textColor: "text-white",
      icon: "Briefcase",
      gradient: "from-scorp to-red-600"
    },
    Form1040: {
      color: "form1040",
      bgColor: "bg-form1040",
      borderColor: "border-form1040",
      textColor: "text-white",
      icon: "FileText",
      gradient: "from-form1040 to-gray-600"
    }
  };

  const config = entityConfig[entity.type] || entityConfig.Trust;

  return (
<motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: isDragging ? 1.0 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "entity-card w-48 bg-white border-2 cursor-move select-none transition-all duration-200",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
        isDragging && "opacity-70 rotate-1 scale-105 shadow-2xl z-50",
        config.borderColor
      )}
      onClick={onSelect}
      {...props}
    >
      <div className={cn(
        "px-4 py-3 rounded-t-lg bg-gradient-to-r",
        config.gradient
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name={config.icon} size={20} className={config.textColor} />
            <span className={cn("font-semibold", config.textColor)}>
              {entity.type}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entity.id);
            }}
            className="text-white hover:text-red-200 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{entity.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          {entity.properties.description && (
            <p>{entity.properties.description}</p>
          )}
          {entity.properties.state && (
            <p className="font-medium">State: {entity.properties.state}</p>
          )}
          {entity.properties.taxElection && (
            <p className="font-medium">Tax: {entity.properties.taxElection}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EntityCard;