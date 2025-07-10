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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Settings" size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Entity Name</Label>
            <Input
              value={selectedEntity.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter entity name..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={selectedEntity.properties.description || ""}
              onChange={(e) => handlePropertyChange("description", e.target.value)}
              placeholder="Enter description..."
            />
          </div>
          
          {getEntityFields()}
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertiesPanel;