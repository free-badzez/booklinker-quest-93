
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookMarked, 
  AlertTriangle, 
  MonitorUp, 
  LayoutTemplate, 
  MoveHorizontal, 
  ArrowDownToLine,
  Check,
  X,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReaderControlsProps {
  currentPage: number;
  bookmarks: number[];
  isDarkMode: boolean;
  isHeaderSticky: boolean;
  viewMode: 'default' | 'longStrip' | 'fitBoth';
  toggleBookmark: (page: number) => void;
  toggleHeaderSticky: () => void;
  changeViewMode: (mode: 'default' | 'longStrip' | 'fitBoth') => void;
  goToLastReadPage: () => void;
}

export const ReaderControls = ({
  currentPage,
  bookmarks,
  isDarkMode,
  isHeaderSticky,
  viewMode,
  toggleBookmark,
  toggleHeaderSticky,
  changeViewMode,
  goToLastReadPage,
}: ReaderControlsProps) => {
  const { toast } = useToast();
  const [zoom, setZoom] = useState(100); // Store zoom level as percentage

  useEffect(() => {
    // Initialize zoom level in the iframe
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const style = document.createElement('style');
            style.textContent = `
              body {
                transform: scale(${zoom / 100});
                transform-origin: top left;
                width: ${100 / (zoom / 100)}% !important;
                height: auto !important;
              }
            `;
            iframeDoc.head.appendChild(style);
          }
        } catch (e) {
          console.error('Error accessing iframe content:', e);
        }
      };
    }
  }, [zoom]);

  const handleZoomIn = () => {
    if (zoom < 200) { // Maximum zoom of 200%
      setZoom(prev => prev + 10);
      toast({
        title: "Zoom In",
        description: `Zoom level: ${zoom + 10}%`,
        duration: 1000,
      });
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) { // Minimum zoom of 50%
      setZoom(prev => prev - 10);
      toast({
        title: "Zoom Out",
        description: `Zoom level: ${zoom - 10}%`,
        duration: 1000,
      });
    }
  };

  const handleReportError = () => {
    toast({
      title: "Error Reported",
      description: "Thank you for reporting this issue. We'll look into it.",
      duration: 3000,
    });
  };

  const handleViewModeChange = (mode: 'default' | 'longStrip' | 'fitBoth') => {
    changeViewMode(mode);
    toast({
      title: `View Mode Changed`,
      description: `Changed to ${mode === 'longStrip' ? 'Long Strip' : 'Fit Both'} mode`,
      duration: 2000,
    });
  };

  const handleBookmarkToggle = () => {
    toggleBookmark(currentPage);
    toast({
      title: bookmarks.includes(currentPage) ? "Bookmark Removed" : "Bookmark Added",
      description: `Page ${currentPage} has been ${bookmarks.includes(currentPage) ? "removed from" : "added to"} bookmarks`,
      duration: 2000,
    });
  };

  const handleHeaderStickyToggle = () => {
    toggleHeaderSticky();
    toast({
      title: "Header Setting Changed",
      description: `Header is now ${!isHeaderSticky ? 'sticky' : 'not sticky'}`,
      duration: 2000,
    });
  };

  const handleGoToLastPage = () => {
    goToLastReadPage();
    toast({
      title: "Navigation",
      description: "Jumped to last read page",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <motion.button 
          onClick={handleZoomIn}
          className={`flex-1 flex items-center justify-center space-x-2 p-2 ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
          } rounded transition-colors duration-200`}
          whileTap={{ scale: 0.95 }}
        >
          <ZoomIn className="w-4 h-4" />
          <span>Zoom In</span>
        </motion.button>
        
        <motion.button 
          onClick={handleZoomOut}
          className={`flex-1 flex items-center justify-center space-x-2 p-2 ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
          } rounded transition-colors duration-200`}
          whileTap={{ scale: 0.95 }}
        >
          <ZoomOut className="w-4 h-4" />
          <span>Zoom Out</span>
        </motion.button>
      </div>

      <motion.button 
        onClick={handleBookmarkToggle}
        className={`w-full flex items-center space-x-2 p-2 ${
          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
        } rounded transition-colors duration-200`}
        whileTap={{ scale: 0.95 }}
      >
        <BookMarked className={`w-4 h-4 ${bookmarks.includes(currentPage) ? 'text-yellow-500' : ''}`} />
        <span>Bookmark</span>
        {bookmarks.includes(currentPage) && <Check className="w-4 h-4 ml-auto text-green-500" />}
      </motion.button>
      
      <motion.button 
        onClick={handleReportError}
        className={`w-full flex items-center space-x-2 p-2 ${
          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
        } rounded transition-colors duration-200`}
        whileTap={{ scale: 0.95 }}
      >
        <AlertTriangle className="w-4 h-4" />
        <span>Report Error</span>
      </motion.button>
      
      <motion.button 
        onClick={handleHeaderStickyToggle}
        className={`w-full flex items-center space-x-2 p-2 ${
          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
        } rounded transition-colors duration-200`}
        whileTap={{ scale: 0.95 }}
      >
        <MonitorUp className="w-4 h-4" />
        <span>Header Sticky</span>
        {isHeaderSticky ? 
          <Check className="w-4 h-4 ml-auto text-green-500" /> : 
          <X className="w-4 h-4 ml-auto text-gray-500" />
        }
      </motion.button>
      
      <motion.button 
        onClick={() => handleViewModeChange('longStrip')}
        className={`w-full flex items-center space-x-2 p-2 ${
          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
        } rounded transition-colors duration-200`}
        whileTap={{ scale: 0.95 }}
      >
        <LayoutTemplate className="w-4 h-4" />
        <span>Long Strip</span>
        {viewMode === 'longStrip' && <Check className="w-4 h-4 ml-auto text-green-500" />}
      </motion.button>
      
      <motion.button 
        onClick={() => handleViewModeChange('fitBoth')}
        className={`w-full flex items-center space-x-2 p-2 ${
          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
        } rounded transition-colors duration-200`}
        whileTap={{ scale: 0.95 }}
      >
        <MoveHorizontal className="w-4 h-4" />
        <span>Fit Both</span>
        {viewMode === 'fitBoth' && <Check className="w-4 h-4 ml-auto text-green-500" />}
      </motion.button>
      
      <motion.button 
        onClick={handleGoToLastPage}
        className={`w-full flex items-center space-x-2 p-2 ${
          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
        } rounded transition-colors duration-200`}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowDownToLine className="w-4 h-4" />
        <span>Bottom Progress</span>
      </motion.button>
    </div>
  );
};
