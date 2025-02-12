import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ReaderHeader } from "@/components/reader/ReaderHeader";
import { ReaderControls } from "@/components/reader/ReaderControls";
import { BookmarksList } from "@/components/reader/BookmarksList";

const bookPDFs = {
  "a-memory-called-empire": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "project-hail-mary": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "dune": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "foundation": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "three-body-problem": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "neuromancer": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "snow-crash": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "red-rising": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "hyperion": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "left-hand-of-darkness": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "children-of-time": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "rich-dad-poor-dad": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "psychology-of-money": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "atomic-habits": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "think-and-grow-rich": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "7-habits": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "how-to-win-friends": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "power-of-now": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "the-alchemist": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "subtle-art": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "4-hour-work-week": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "mindset": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "deep-work": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview",
  "compound-effect": "https://drive.google.com/file/d/1NE3LMVzkHzMlGEoRqSiyMykAU3uSlvR4/preview"
};

const BookReader = () => {
  const { bookId } = useParams();
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(52);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [viewMode, setViewMode] = useState<'default' | 'longStrip' | 'fitBoth'>('default');
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedBookmarks = localStorage.getItem(`bookmarks-${bookId}`);
        const savedPage = localStorage.getItem(`currentPage-${bookId}`);
        const savedTheme = localStorage.getItem('theme');
        const savedViewMode = localStorage.getItem('viewMode');
        const savedHeaderSticky = localStorage.getItem('headerSticky');
        
        if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
        if (savedPage) setCurrentPage(parseInt(savedPage));
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');
        if (savedViewMode) setViewMode(savedViewMode as 'default' | 'longStrip' | 'fitBoth');
        if (savedHeaderSticky) setIsHeaderSticky(savedHeaderSticky === 'true');
        
        document.documentElement.classList.toggle('dark', isDarkMode);
      } catch (err) {
        console.error('Error loading settings:', err);
        toast({
          title: "Error",
          description: "Failed to load settings. Using defaults.",
          variant: "destructive",
        });
      }
    };

    loadSettings();
  }, [bookId, toast]);

  const toggleBookmark = (page: number) => {
    try {
      const newBookmarks = bookmarks.includes(page)
        ? bookmarks.filter(b => b !== page)
        : [...bookmarks, page];
      
      setBookmarks(newBookmarks);
      localStorage.setItem(`bookmarks-${bookId}`, JSON.stringify(newBookmarks));
      
      toast({
        title: bookmarks.includes(page) ? "Bookmark removed" : "Bookmark added",
        description: `Page ${page} has been ${bookmarks.includes(page) ? "removed from" : "added to"} bookmarks`,
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleHeaderSticky = () => {
    const newValue = !isHeaderSticky;
    setIsHeaderSticky(newValue);
    localStorage.setItem('headerSticky', String(newValue));
  };

  const changeViewMode = (mode: 'default' | 'longStrip' | 'fitBoth') => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newValue);
  };

  const goToLastReadPage = () => {
    const savedPage = localStorage.getItem(`currentPage-${bookId}`);
    if (savedPage) {
      updateCurrentPage(parseInt(savedPage));
      toast({
        title: "Navigation",
        description: `Returned to page ${savedPage}`,
      });
    }
  };

  const updateCurrentPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      localStorage.setItem(`currentPage-${bookId}`, page.toString());
    }
  };

  const pdfUrl = bookId ? bookPDFs[bookId as keyof typeof bookPDFs] : null;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-black' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <ReaderHeader 
        currentPage={currentPage}
        totalPages={totalPages}
        isDarkMode={isDarkMode}
        isHeaderSticky={isHeaderSticky}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex">
        <main className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateCurrentPage(currentPage - 1)}
                className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors duration-200`}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateCurrentPage(currentPage + 1)}
                className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors duration-200`}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>

            <div className={`rounded-lg mb-4 ${
              viewMode === 'longStrip' ? 'h-auto' : 
              viewMode === 'fitBoth' ? 'h-[calc(100vh-12rem)]' : 
              'h-[calc(100vh-12rem)]'
            }`}>
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full rounded-lg"
                  allow="autoplay"
                  loading="lazy"
                ></iframe>
              ) : (
                <div className={`w-full h-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>
                  <p className="text-center p-8">PDF not available</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {isSidebarOpen && (
          <ScrollArea className={`w-64 ${isDarkMode ? 'bg-black border-gray-800' : 'bg-gray-100 border-gray-200'} border-l p-4 space-y-4 transition-colors duration-200`}>
            <ReaderControls 
              currentPage={currentPage}
              bookmarks={bookmarks}
              isDarkMode={isDarkMode}
              isHeaderSticky={isHeaderSticky}
              viewMode={viewMode}
              toggleBookmark={toggleBookmark}
              toggleHeaderSticky={toggleHeaderSticky}
              changeViewMode={changeViewMode}
              goToLastReadPage={goToLastReadPage}
            />
            
            <BookmarksList 
              bookmarks={bookmarks}
              updateCurrentPage={updateCurrentPage}
              isDarkMode={isDarkMode}
            />
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default BookReader;
