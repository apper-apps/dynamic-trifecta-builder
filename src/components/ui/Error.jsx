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
          className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {showRetry && onRetry && (
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <ApperIcon name="RefreshCw" size={16} />
              Try Again
            </Button>
            
            <div className="text-sm text-gray-500">
              If the problem persists, please refresh the page
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <div className="flex items-start gap-2">
            <ApperIcon name="Lightbulb" size={16} className="text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Troubleshooting Tips:</p>
              <ul className="mt-1 text-left space-y-1">
                <li>• Check your internet connection</li>
                <li>• Clear your browser cache</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Error;