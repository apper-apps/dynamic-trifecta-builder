import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ExportControls = ({ entities, connections, canvasRef }) => {
  const [isExporting, setIsExporting] = useState(false);
const handleExportPDF = async () => {
    if (entities.length === 0) {
      toast.warning("Add some entities to your structure before exporting!");
      return;
    }

    if (!canvasRef?.current) {
      toast.error("Canvas not available for export");
      return;
    }

    setIsExporting(true);
    
    try {
      // Capture canvas as image
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: canvasRef.current.scrollHeight,
        width: canvasRef.current.scrollWidth
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // Add metadata
      pdf.setProperties({
        title: 'Trifecta Structure Export',
        subject: `Tax Strategy Structure - ${entities.length} entities, ${connections.length} connections`,
        author: 'Trifecta Builder',
        creator: 'Trifecta Builder',
        producer: 'jsPDF'
      });

      const fileName = `trifecta-structure-${new Date().toISOString().split('T')[0]}-${Date.now()}.pdf`;
      pdf.save(fileName);
      
      toast.success("Structure exported successfully as PDF!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (entities.length === 0) {
      toast.warning("Add some entities to your structure before exporting!");
      return;
    }

    if (!canvasRef?.current) {
      toast.error("Canvas not available for export");
      return;
    }

    setIsExporting(true);
    
    try {
      // Capture canvas as high-quality image
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        allowTaint: true,
        height: canvasRef.current.scrollHeight,
        width: canvasRef.current.scrollWidth
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `trifecta-structure-${new Date().toISOString().split('T')[0]}-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Structure exported successfully as PNG image!");
      }, 'image/png', 1.0);
    } catch (error) {
      console.error("Image export error:", error);
      toast.error("Image export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    if (entities.length === 0) {
      toast.warning("Add some entities to your structure before exporting!");
      return;
    }

    setIsExporting(true);
    
    try {
      const structureData = {
        entities,
        connections,
        exportDate: new Date().toISOString(),
        metadata: {
          entityCount: entities.length,
          connectionCount: connections.length,
          exportVersion: "1.0",
          application: "Trifecta Builder"
        }
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(structureData, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trifecta-structure-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Structure exported successfully as JSON!");
    } catch (error) {
      toast.error("JSON export failed. Please try again.");
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
    <Card className="p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ApperIcon name="Download" size={20} className="text-blue-600" />
        </motion.div>
        <h3 className="text-lg font-bold text-gray-900">Export & Share</h3>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full flex items-center gap-2 hover:bg-red-50 hover:border-red-300 touch-target"
            aria-label="Export structure as PDF document"
          >
            {isExporting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <ApperIcon name="Loader2" size={16} className="text-red-600" />
              </motion.div>
            ) : (
              <ApperIcon name="FileText" size={16} className="text-red-600" />
            )}
            <span className="font-semibold">Export as PDF</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportImage}
            disabled={isExporting}
            className="w-full flex items-center gap-2 hover:bg-green-50 hover:border-green-300 touch-target"
            aria-label="Export structure as high-quality image"
          >
            {isExporting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <ApperIcon name="Loader2" size={16} className="text-green-600" />
              </motion.div>
            ) : (
              <ApperIcon name="Image" size={16} className="text-green-600" />
            )}
            <span className="font-semibold">Export as Image</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            disabled={isExporting}
            className="w-full flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 touch-target"
            aria-label="Export structure as JSON data file"
          >
            {isExporting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <ApperIcon name="Loader2" size={16} className="text-purple-600" />
              </motion.div>
            ) : (
              <ApperIcon name="FileCode" size={16} className="text-purple-600" />
            )}
            <span className="font-semibold">Export as JSON</span>
          </Button>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleShare}
            className="w-full flex items-center gap-2 touch-target"
            aria-label="Share structure with others"
          >
            <ApperIcon name="Share2" size={16} />
            <span className="font-bold">Share Structure 🚀</span>
          </Button>
        </motion.div>
        
        <div className="text-xs text-gray-600 text-center font-medium bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg border border-blue-200">
          📊 Export your structure as PDF/image for presentations or JSON for data backup
        </div>
      </div>
    </Card>
  );
};

export default ExportControls;