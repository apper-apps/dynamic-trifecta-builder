import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const OnboardingWelcome = ({ onComplete }) => {
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleStartSetup = () => {
    navigate("/onboarding/setup");
  };

  const handleSkip = () => {
    const confirmed = window.confirm(
      "Are you sure you want to skip the onboarding? You can always access your settings later."
    );
    if (confirmed) {
      onComplete();
      toast.info("Onboarding skipped - Welcome to Trifecta Builder!");
    }
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    toast.success("🎬 Video starting - Get ready to learn the Trifecta strategy!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <ApperIcon 
              name="Zap" 
              size={80} 
              className="mx-auto text-primary mb-4 animate-pulse"
            />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-4">
              Welcome to the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Trifecta
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              🚀 Your journey to financial optimization starts here! 
              Let's build your personalized tax and asset protection strategy.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              ✨ Discover the Power of Strategic Planning
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Watch Mark Kohler explain how the Trifecta strategy can transform your financial future
            </p>
          </div>

          <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-8 aspect-video">
            {!isVideoPlaying ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer"
                onClick={handlePlayVideo}
              >
                <div className="text-center text-white">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ApperIcon name="Play" size={64} className="mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">🎯 The Trifecta Strategy</h3>
                  <p className="text-sm opacity-90">Click to start your journey</p>
                </div>
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <ApperIcon name="Loader" size={32} className="mx-auto mb-4 text-primary" />
                  </motion.div>
                  <p className="text-gray-600">Loading video content...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    🎬 Mark Kohler's energetic introduction to tax optimization
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl"
            >
              <ApperIcon name="Shield" size={40} className="mx-auto mb-3 text-trust" />
              <h3 className="font-semibold text-gray-900 mb-2">🛡️ Asset Protection</h3>
              <p className="text-sm text-gray-600">
                Safeguard your wealth with strategic entity structures
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl"
            >
              <ApperIcon name="TrendingDown" size={40} className="mx-auto mb-3 text-llc" />
              <h3 className="font-semibold text-gray-900 mb-2">💰 Tax Optimization</h3>
              <p className="text-sm text-gray-600">
                Minimize your tax burden through smart planning
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl"
            >
              <ApperIcon name="Rocket" size={40} className="mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-gray-900 mb-2">🚀 Wealth Growth</h3>
              <p className="text-sm text-gray-600">
                Accelerate your financial growth with proven strategies
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleStartSetup}
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ApperIcon name="ArrowRight" size={20} className="mr-2" />
            🎯 Start My Setup Journey
          </Button>
          
          <Button
            onClick={handleSkip}
            variant="outline"
            className="px-8 py-4 text-lg font-semibold border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-300"
          >
            <ApperIcon name="Skip" size={20} className="mr-2" />
            Skip for Now
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            ⚡ Takes just 3 minutes to personalize your experience
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingWelcome;