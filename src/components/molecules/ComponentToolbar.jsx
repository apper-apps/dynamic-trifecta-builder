import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

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

  return (
    <Card className="p-6 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="Layers" size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Components</h2>
      </div>
      
      <div className="space-y-3">
{entityTypes.map((entity, index) => (
          <motion.div
            key={entity.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", entity.type);
                e.dataTransfer.effectAllowed = "copy";
              }}
              className="mb-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddEntity(entity.type)}
                className="w-full justify-start p-3 h-auto hover:shadow-md drag-handle transition-all duration-200 hover:scale-105"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${entity.gradient} mr-3`}>
                  <ApperIcon name={entity.icon} size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{entity.type}</div>
                  <div className="text-xs text-gray-500">{entity.description}</div>
                </div>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      
<div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <ApperIcon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Pro Tip!</p>
            <p>Drag components to the canvas or click to add. Connect entities to show relationships.</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComponentToolbar;