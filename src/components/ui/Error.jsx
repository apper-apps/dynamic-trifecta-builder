import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your structure. Please try again.",
  onRetry,
  showRetry = true
}) => {
return (
    <div className="flex items-center justify-center min-h-[400px]" role="alert" aria-live="assertive">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          >
            <ApperIcon name="AlertTriangle" size={32} className="text-white" />
          </motion.div>
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title} ❌</h3>
        <p className="text-gray-700 mb-6 font-medium">{message}</p>
        
        {showRetry && onRetry && (
          <div className="space-y-3">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                onClick={onRetry}
                className="flex items-center gap-2 touch-target"
                aria-label="Retry the failed operation"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <ApperIcon name="RefreshCw" size={16} />
                </motion.div>
                <span className="font-bold">Try Again 🔄</span>
              </Button>
            </motion.div>
            
            <div className="text-sm text-gray-600 font-medium">
              If the problem persists, please refresh the page 🔄
            </div>
          </div>
        )}
        
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-lg border-2 border-red-300 shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-2">
            <motion.div
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ApperIcon name="Lightbulb" size={16} className="text-red-700 mt-0.5" />
            </motion.div>
            <div className="text-sm text-red-900">
              <p className="font-bold">🔧 Troubleshooting Tips:</p>
              <ul className="mt-1 text-left space-y-1 font-medium">
                <li>• 🌐 Check your internet connection</li>
                <li>• 🗑️ Clear your browser cache</li>
                <li>• 🔄 Try refreshing the page</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;