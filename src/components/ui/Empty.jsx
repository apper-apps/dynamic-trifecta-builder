import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No entities yet",
  message = "Start building your tax and asset protection structure by adding your first entity.",
  actionLabel = "Add First Entity",
  onAction,
  icon = "Layers"
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name={icon} size={48} className="text-blue-500" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            className="flex items-center gap-2 mx-auto"
          >
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </Button>
        )}
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-trust to-green-600 rounded-lg flex items-center justify-center mb-2">
              <ApperIcon name="Shield" size={16} className="text-white" />
            </div>
            <h4 className="font-medium text-green-900 text-sm">Trusts</h4>
            <p className="text-xs text-green-700 mt-1">Asset protection and estate planning</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-llc to-blue-600 rounded-lg flex items-center justify-center mb-2">
              <ApperIcon name="Building2" size={16} className="text-white" />
            </div>
            <h4 className="font-medium text-blue-900 text-sm">LLCs</h4>
            <p className="text-xs text-blue-700 mt-1">Business and investment holdings</p>
          </motion.div>
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <ApperIcon name="Lightbulb" size={16} className="text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium">Pro Tip from Mark Kohler:</p>
              <p className="mt-1">"The best structure is the one that actually gets implemented. Start simple and build complexity as your wealth grows!"</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Empty;