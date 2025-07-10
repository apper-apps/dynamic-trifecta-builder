import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ExportControls = ({ entities, connections }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    if (entities.length === 0) {
      toast.warning("Add some entities to your structure before exporting!");
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const structureData = {
        entities,
        connections,
        exportDate: new Date().toISOString(),
        format
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(structureData, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trifecta-structure-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Structure exported successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        entities,
        connections,
        sharedDate: new Date().toISOString()
      };
      
      const shareUrl = `${window.location.origin}/shared/${btoa(JSON.stringify(shareData))}`;
      
      if (navigator.share) {
        await navigator.share({
          title: "Trifecta Structure",
          text: "Check out my tax and asset protection structure!",
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Sharing failed. Please try again.");
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="Download" size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Export & Share</h3>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="FileCode" size={16} />
            )}
            JSON
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="FileText" size={16} />
            )}
            PDF
          </Button>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={handleShare}
          className="w-full flex items-center gap-2"
        >
          <ApperIcon name="Share2" size={16} />
          Share Structure
        </Button>
        
        <div className="text-xs text-gray-500 text-center">
          Export your structure for professional use or share with advisors
        </div>
      </div>
    </Card>
  );
};

export default ExportControls;