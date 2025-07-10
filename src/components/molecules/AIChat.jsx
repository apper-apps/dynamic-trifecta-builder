import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const AIChat = ({ suggestions, entities, connections }) => {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [suggestions]);

  const handleActionClick = (suggestion, action) => {
    try {
      switch (action.type) {
        case "create_entity":
          console.log("Creating entity:", action.data);
          // Handle entity creation logic here
          break;
        case "create_connection":
          console.log("Creating connection:", action.data);
          // Handle connection creation logic here
          break;
        case "show_info":
          console.log("Showing info:", action.data);
          // Handle info display logic here
          break;
        default:
          console.log("Unknown action type:", action.type);
      }
    } catch (error) {
      console.error("Error handling action:", error);
    }
  };
  const getSuggestionIcon = (type) => {
    switch (type) {
      case "tip":
        return "Lightbulb";
      case "warning":
        return "AlertTriangle";
      case "optimization":
        return "Zap";
      default:
        return "MessageCircle";
    }
  };

  const getSuggestionColor = (type) => {
    switch (type) {
      case "tip":
        return "text-blue-600";
      case "warning":
        return "text-amber-600";
      case "optimization":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

return (
    <Card className="p-6 h-96 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <motion.div 
          className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <ApperIcon name="Bot" size={20} className="text-white" />
        </motion.div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
          <p className="text-sm text-purple-600 font-semibold">Mark Kohler Style 🎯</p>
        </div>
      </div>
      
      <div 
        ref={chatRef} 
        className="space-y-4 h-72 overflow-y-auto pr-2"
        role="log"
        aria-live="polite"
        aria-label="AI suggestions and recommendations"
      >
        <AnimatePresence>
          {suggestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ApperIcon name="MessageSquare" size={48} className="text-blue-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-600 font-medium">Start building your structure to get AI suggestions! 🚀</p>
            </motion.div>
          ) : (
            suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20, x: 10 }}
                className="ai-bubble shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <ApperIcon
                      name={getSuggestionIcon(suggestion.type)}
                      size={16}
                      className={`mt-1 ${getSuggestionColor(suggestion.type)}`}
                    />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
                      {suggestion.message}
                    </p>
                    
                    {suggestion.actions && suggestion.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {suggestion.actions.map((action) => (
                          <motion.button
                            key={action.id}
                            onClick={() => handleActionClick(suggestion, action)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg touch-target"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Action: ${action.label}`}
                          >
                            <ApperIcon 
                              name={action.type === "create_entity" ? "Plus" : "Info"} 
                              size={12} 
                            />
                            {action.label}
                          </motion.button>
                        ))}
                      </div>
                    )}
                    
                    {suggestion.type === "warning" && (
                      <motion.div 
                        className="mt-2 text-xs text-amber-800 bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-2 rounded-lg border border-amber-300 shadow-sm"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ApperIcon name="AlertTriangle" size={12} className="inline mr-1" />
                        <span className="font-bold">Action recommended ⚡</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default AIChat;