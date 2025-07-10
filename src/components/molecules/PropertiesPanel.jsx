import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PropertiesPanel = ({ selectedEntity, onUpdateEntity, onClose }) => {
  if (!selectedEntity) return null;

  const handlePropertyChange = (key, value) => {
    onUpdateEntity(selectedEntity.id, {
      ...selectedEntity,
      properties: {
        ...selectedEntity.properties,
        [key]: value
      }
    });
  };

  const handleNameChange = (value) => {
    onUpdateEntity(selectedEntity.id, {
      ...selectedEntity,
      name: value
    });
  };

  const getEntityFields = () => {
    switch (selectedEntity.type) {
case "Trust":
        return (
          <>
            <div className="space-y-2">
              <Label>Trust Type</Label>
              <Select
                value={selectedEntity.properties.trustType || "revocable"}
                onChange={(e) => handlePropertyChange("trustType", e.target.value)}
              >
                <option value="revocable">Revocable Living Trust</option>
                <option value="irrevocable">Irrevocable Trust</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Trust Name</Label>
              <Input
                value={selectedEntity.properties.trustName || ""}
                onChange={(e) => handlePropertyChange("trustName", e.target.value)}
                placeholder="Enter full trust name..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Grantor/Settlor</Label>
              <Input
                value={selectedEntity.properties.grantor || ""}
                onChange={(e) => handlePropertyChange("grantor", e.target.value)}
                placeholder="Enter grantor name..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Trustee</Label>
              <Input
                value={selectedEntity.properties.trustee || ""}
                onChange={(e) => handlePropertyChange("trustee", e.target.value)}
                placeholder="Enter trustee name..."
              />
            </div>
            
            <div className="space-y-3">
              <Label>Assets to Include</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEntity.properties.includeHome || false}
                    onChange={(e) => handlePropertyChange("includeHome", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Primary Residence</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEntity.properties.includeInvestments || false}
                    onChange={(e) => handlePropertyChange("includeInvestments", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Investment Accounts</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Primary Beneficiary</Label>
              <Input
                value={selectedEntity.properties.primaryBeneficiary || ""}
                onChange={(e) => handlePropertyChange("primaryBeneficiary", e.target.value)}
                placeholder="Enter primary beneficiary..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Contingent Beneficiary</Label>
              <Input
                value={selectedEntity.properties.contingentBeneficiary || ""}
                onChange={(e) => handlePropertyChange("contingentBeneficiary", e.target.value)}
                placeholder="Enter contingent beneficiary..."
              />
            </div>
            
            <div className="space-y-3">
              <Label>Privacy Options</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEntity.properties.managerManagedLLC || false}
                    onChange={(e) => handlePropertyChange("managerManagedLLC", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Use Manager-Managed LLC Structure</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={selectedEntity.properties.state || ""}
                onChange={(e) => handlePropertyChange("state", e.target.value)}
              >
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NV">Nevada</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <option value="WY">Wyoming</option>
              </Select>
            </div>
          </>
        );
      case "LLC":
        return (
          <>
            <div className="space-y-2">
              <Label>Tax Election</Label>
              <Select
                value={selectedEntity.properties.taxElection || "disregarded"}
                onChange={(e) => handlePropertyChange("taxElection", e.target.value)}
              >
                <option value="disregarded">Disregarded Entity</option>
                <option value="partnership">Partnership</option>
                <option value="scorp">S Corporation</option>
                <option value="ccorp">C Corporation</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={selectedEntity.properties.state || ""}
                onChange={(e) => handlePropertyChange("state", e.target.value)}
              >
                <option value="">Select State</option>
                <option value="WY">Wyoming</option>
                <option value="NV">Nevada</option>
                <option value="DE">Delaware</option>
                <option value="TX">Texas</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Select
                value={selectedEntity.properties.purpose || ""}
                onChange={(e) => handlePropertyChange("purpose", e.target.value)}
              >
                <option value="">Select Purpose</option>
                <option value="real-estate">Real Estate Holdings</option>
                <option value="investments">Investment Holdings</option>
                <option value="business">Business Operations</option>
                <option value="equipment">Equipment Holdings</option>
              </Select>
            </div>
          </>
        );
      case "SCorp":
        return (
          <>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select
                value={selectedEntity.properties.industry || ""}
                onChange={(e) => handlePropertyChange("industry", e.target.value)}
              >
                <option value="">Select Industry</option>
                <option value="consulting">Consulting</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="services">Services</option>
                <option value="technology">Technology</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={selectedEntity.properties.state || ""}
                onChange={(e) => handlePropertyChange("state", e.target.value)}
              >
                <option value="">Select State</option>
                <option value="NV">Nevada</option>
                <option value="WY">Wyoming</option>
                <option value="DE">Delaware</option>
                <option value="TX">Texas</option>
              </Select>
            </div>
          </>
        );
      case "Form1040":
        return (
          <>
            <div className="space-y-2">
              <Label>Filing Status</Label>
              <Select
                value={selectedEntity.properties.filingStatus || ""}
                onChange={(e) => handlePropertyChange("filingStatus", e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married-joint">Married Filing Jointly</option>
                <option value="married-separate">Married Filing Separately</option>
                <option value="head-of-household">Head of Household</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tax Year</Label>
              <Select
                value={selectedEntity.properties.taxYear || "2024"}
                onChange={(e) => handlePropertyChange("taxYear", e.target.value)}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </Select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="p-6 shadow-xl border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Settings" size={20} className="text-blue-600" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-900">Properties ⚙️</h3>
          </div>
          <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 touch-target hover:bg-red-100"
              aria-label="Close properties panel"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div 
            className="space-y-2"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <Label>Entity Name</Label>
            <Input
              value={selectedEntity.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter entity name..."
              className="font-semibold"
              aria-label="Entity name input"
            />
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <Label>Description</Label>
            <Input
              value={selectedEntity.properties.description || ""}
              onChange={(e) => handlePropertyChange("description", e.target.value)}
              placeholder="Enter description..."
              aria-label="Entity description input"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {getEntityFields()}
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default PropertiesPanel;