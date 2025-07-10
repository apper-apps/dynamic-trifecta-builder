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
    <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ApperIcon name={icon} size={48} className="text-blue-600" />
          </motion.div>
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 mb-6 font-medium">{message}</p>
        
        {onAction && (
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              onClick={onAction}
              className="flex items-center gap-2 mx-auto shadow-lg touch-target"
              aria-label={actionLabel}
            >
              <ApperIcon name="Plus" size={16} />
              <span className="font-bold">{actionLabel} 🚀</span>
            </Button>
          </motion.div>
        )}
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-300 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-trust to-green-700 rounded-lg flex items-center justify-center mb-2 shadow-md"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <ApperIcon name="Shield" size={16} className="text-white" />
            </motion.div>
            <h4 className="font-bold text-green-900 text-sm">Trusts 🛡️</h4>
            <p className="text-xs text-green-800 mt-1 font-medium">Asset protection and estate planning</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-llc to-blue-700 rounded-lg flex items-center justify-center mb-2 shadow-md"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <ApperIcon name="Building2" size={16} className="text-white" />
            </motion.div>
            <h4 className="font-bold text-blue-900 text-sm">LLCs 🏢</h4>
            <p className="text-xs text-blue-800 mt-1 font-medium">Business and investment holdings</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-4 p-4 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg border-2 border-yellow-300 shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-2">
            <motion.div
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ApperIcon name="Lightbulb" size={16} className="text-yellow-600 mt-0.5" />
            </motion.div>
            <div className="text-sm text-yellow-900">
              <p className="font-bold">💡 Pro Tip from Mark Kohler:</p>
              <p className="mt-1 font-semibold">"The best structure is the one that actually gets implemented. Start simple and build complexity as your wealth grows!" 🎯</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Empty;