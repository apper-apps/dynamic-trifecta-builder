import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";

const OnboardingSetup = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    income: '',
    assets: '',
    businessType: '',
    state: '',
    goals: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const businessTypes = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'llc', label: 'LLC' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'none', label: 'No Business' },
    { value: 'other', label: 'Other' }
  ];

  const states = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
  ];

  const goals = [
    { id: 'tax_reduction', label: '💰 Reduce Tax Burden', description: 'Minimize annual tax payments' },
    { id: 'asset_protection', label: '🛡️ Protect Assets', description: 'Shield wealth from lawsuits and creditors' },
    { id: 'business_growth', label: '🚀 Grow Business', description: 'Optimize business structure for growth' },
    { id: 'retirement_planning', label: '🏖️ Plan Retirement', description: 'Build long-term wealth for retirement' },
    { id: 'estate_planning', label: '🏛️ Estate Planning', description: 'Prepare wealth transfer to heirs' },
    { id: 'real_estate', label: '🏠 Real Estate Investment', description: 'Optimize property investment strategies' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleGoalToggle = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.income || formData.income <= 0) {
          newErrors.income = 'Please enter your annual income';
        }
        break;
      case 2:
        if (!formData.assets || formData.assets < 0) {
          newErrors.assets = 'Please enter your total assets';
        }
        break;
      case 3:
        if (!formData.businessType) {
          newErrors.businessType = 'Please select your business type';
        }
        if (!formData.state) {
          newErrors.state = 'Please select your state';
        }
        break;
      case 4:
        if (formData.goals.length === 0) {
          newErrors.goals = 'Please select at least one goal';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      await userService.create(formData);
      toast.success("🎉 Setup complete! Welcome to your personalized Trifecta Builder!");
      onComplete();
    } catch (error) {
      toast.error("Failed to save your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/onboarding");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "💰 Your Income";
      case 2: return "🏦 Your Assets";
      case 3: return "🏢 Business & Location";
      case 4: return "🎯 Your Goals";
      default: return "Setup";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Let's start with your annual income to understand your tax situation";
      case 2: return "Tell us about your assets to determine protection needs";
      case 3: return "Help us understand your business structure and location";
      case 4: return "What are your primary financial goals?";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income (USD)
              </label>
              <Input
                type="number"
                value={formData.income}
                onChange={(e) => handleInputChange('income', e.target.value)}
                placeholder="e.g., 75000"
                className={`w-full text-lg p-4 ${errors.income ? 'border-red-500' : ''}`}
              />
              {errors.income && (
                <p className="text-red-500 text-sm mt-1">{errors.income}</p>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <ApperIcon name="Info" size={16} className="inline mr-1" />
                This information helps us recommend the right tax strategies for your income level.
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Assets (USD)
              </label>
              <Input
                type="number"
                value={formData.assets}
                onChange={(e) => handleInputChange('assets', e.target.value)}
                placeholder="e.g., 250000"
                className={`w-full text-lg p-4 ${errors.assets ? 'border-red-500' : ''}`}
              />
              {errors.assets && (
                <p className="text-red-500 text-sm mt-1">{errors.assets}</p>
              )}
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                <ApperIcon name="Shield" size={16} className="inline mr-1" />
                Include real estate, investments, business assets, and personal property.
              </p>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type
              </label>
              <Select
                value={formData.businessType}
                onChange={(value) => handleInputChange('businessType', value)}
                className={`w-full text-lg p-4 ${errors.businessType ? 'border-red-500' : ''}`}
              >
                <option value="">Select your business type</option>
                {businessTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              {errors.businessType && (
                <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <Select
                value={formData.state}
                onChange={(value) => handleInputChange('state', value)}
                className={`w-full text-lg p-4 ${errors.state ? 'border-red-500' : ''}`}
              >
                <option value="">Select your state</option>
                {states.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </Select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700">
                <ApperIcon name="MapPin" size={16} className="inline mr-1" />
                State laws vary significantly for business formation and tax planning.
              </p>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Your Primary Goals (choose all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map(goal => (
                  <motion.div
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.goals.includes(goal.id)
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleGoalToggle(goal.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                        formData.goals.includes(goal.id)
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {formData.goals.includes(goal.id) && (
                          <ApperIcon name="Check" size={14} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{goal.label}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {errors.goals && (
                <p className="text-red-500 text-sm mt-2">{errors.goals}</p>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">
                <ApperIcon name="Target" size={16} className="inline mr-1" />
                We'll customize your Trifecta strategy based on these goals.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-4 mx-auto"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Welcome
          </Button>
          
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            🛠️ Personalize Your Strategy
          </h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps} • {getStepTitle()}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {getStepTitle()}
            </h2>
            <p className="text-gray-600">{getStepDescription()}</p>
          </div>

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 1}
            className="px-6 py-3"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Next
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Check" size={16} className="mr-2" />
                  🎉 Complete Setup
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSetup;