import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading your structure...", showIcon = true }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {showIcon && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ApperIcon name="Layers" size={32} className="text-white" />
          </motion.div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
          
          {/* Skeleton elements */}
          <div className="space-y-3">
            <div className="flex gap-3 justify-center">
              <div className="w-32 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              <div className="w-32 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              <div className="w-32 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            </div>
            
            <div className="flex gap-2 justify-center">
              <div className="w-24 h-3 bg-gray-300 rounded animate-pulse" />
              <div className="w-16 h-3 bg-gray-300 rounded animate-pulse" />
              <div className="w-20 h-3 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;