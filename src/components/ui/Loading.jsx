import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading your structure...", showIcon = true }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {showIcon && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
          >
            <ApperIcon name="Layers" size={32} className="text-white" />
          </motion.div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">{message} ⏳</h3>
          
          {/* Enhanced skeleton elements */}
          <div className="space-y-3">
            <div className="flex gap-3 justify-center">
              <motion.div 
                className="w-32 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg shadow-md"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div 
                className="w-32 h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-lg shadow-md"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: 0.3
                }}
              />
              <motion.div 
                className="w-32 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg shadow-md"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: 0.6
                }}
              />
            </div>
            
            <div className="flex gap-2 justify-center">
              <motion.div 
                className="w-24 h-3 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div 
                className="w-16 h-3 bg-gradient-to-r from-green-300 to-blue-300 rounded-full"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  delay: 0.2
                }}
              />
              <motion.div 
                className="w-20 h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  delay: 0.4
                }}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-600 font-medium">✨ Building something amazing...</p>
        </div>
      </motion.div>
      <span className="sr-only">Loading content, please wait</span>
    </div>
  );
};

export default Loading;