import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const AIChat = ({ suggestions, entities, connections }) => {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [suggestions]);

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
    <Card className="p-6 h-96">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <ApperIcon name="Bot" size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
          <p className="text-sm text-gray-500">Mark Kohler Style</p>
        </div>
      </div>
      
      <div ref={chatRef} className="space-y-4 h-72 overflow-y-auto pr-2">
        <AnimatePresence>
          {suggestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <ApperIcon name="MessageSquare" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Start building your structure to get AI suggestions!</p>
            </motion.div>
          ) : (
            suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="ai-bubble"
              >
                <div className="flex items-start gap-2">
                  <ApperIcon
                    name={getSuggestionIcon(suggestion.type)}
                    size={16}
                    className={`mt-1 ${getSuggestionColor(suggestion.type)}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {suggestion.message}
                    </p>
                    {suggestion.type === "warning" && (
                      <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                        <ApperIcon name="AlertTriangle" size={12} className="inline mr-1" />
                        Action recommended
                      </div>
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