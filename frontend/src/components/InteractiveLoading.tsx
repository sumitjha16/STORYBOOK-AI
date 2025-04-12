import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveLoadingProps {
  type: 'chat' | 'summary';
  onComplete?: () => void;
}

export const InteractiveLoading: React.FC<InteractiveLoadingProps> = ({ 
  type, 
  onComplete 
}) => {
  const [currentBook, setCurrentBook] = useState(1);
  const [currentQuote, setCurrentQuote] = useState('');
  const [finalMessage, setFinalMessage] = useState(false);
  const maxBooks = 4;
  const bookDuration = 4000; // each book shows for 4 seconds
  
  // Book details with quotes
  const books = [
    {
      number: 1,
      title: "Philosopher's Stone",
      chatQuote: "Searching for the Philosopher's Stone...",
      summaryQuote: "Reading through 'Hogwarts: A History'..."
    },
    {
      number: 2,
      title: "Chamber of Secrets",
      chatQuote: "Following the spiders into the Forbidden Forest...",
      summaryQuote: "Exploring the Chamber of Secrets..."
    },
    {
      number: 3,
      title: "Prisoner of Azkaban",
      chatQuote: "Using the Time-Turner to find answers...",
      summaryQuote: "Consulting the Marauder's Map..."
    },
    {
      number: 4,
      title: "Goblet of Fire",
      chatQuote: "Looking into the Pensieve for memories...",
      summaryQuote: "Searching through the Triwizard Tournament records..."
    }
  ];
  
  // Final success messages
  const successMessages = {
    chat: "Eureka! The answer has been revealed by the Mirror of Erised!",
    summary: "Found it in the Hogwarts Library! Now serving your magical knowledge..."
  };

  useEffect(() => {
    // Set initial quote
    setCurrentQuote(type === 'chat' ? books[0].chatQuote : books[0].summaryQuote);
    
    // Setup timers for each book
    let timeoutIds: NodeJS.Timeout[] = [];
    
    // Schedule book changes
    books.forEach((_, index) => {
      if (index < books.length - 1) {
        const timeoutId = setTimeout(() => {
          setCurrentBook(index + 2); // +2 because index starts at 0 and we want to show book 2,3,4
          setCurrentQuote(type === 'chat' 
            ? books[index + 1].chatQuote 
            : books[index + 1].summaryQuote
          );
        }, (index + 1) * bookDuration);
        
        timeoutIds.push(timeoutId);
      }
    });
    
    // Schedule final success message
    const finalTimeoutId = setTimeout(() => {
      setFinalMessage(true);
      setCurrentQuote(successMessages[type]);
      
      // Wait a bit with the success message before completing
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
      
    }, maxBooks * bookDuration);
    
    timeoutIds.push(finalTimeoutId);
    
    // Cleanup all timeouts on unmount
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 magical-blur rounded-lg text-center"
    >
      <AnimatePresence mode="wait">
        {!finalMessage ? (
          <motion.div
            key={`book-${currentBook}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 relative"
          >
            {/* Book with page turning animation */}
            <div className="w-32 h-44 mx-auto mb-4 relative perspective">
              {/* Book cover */}
              <motion.div
                className="w-full h-full absolute rounded-r-md bg-gradient-to-br from-amber-800 to-amber-600 shadow-lg border-l-8 border-amber-900"
                style={{ transformOrigin: "left center" }}
                animate={currentBook % 2 === 0 ? { rotateY: -25 } : { rotateY: 0 }}
                transition={{ duration: 1 }}
              >
                {/* Book title */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <span className="text-sm font-bold text-center text-amber-100">
                    {books[currentBook-1].title}
                  </span>
                </div>
                
                {/* Book number */}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-amber-900 text-amber-100 flex items-center justify-center text-sm font-bold">
                  {currentBook}
                </div>
              </motion.div>
              
              {/* Flipping pages */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`page-${i}`}
                  className="w-[90%] h-[95%] absolute top-[2.5%] left-[5%] bg-amber-50 rounded-r-sm z-10"
                  style={{ 
                    transformOrigin: "left center",
                    zIndex: 10 - i
                  }}
                  animate={{ 
                    rotateY: [-5, -120],
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.5 + (currentBook - 1) * 0.2, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    repeatDelay: 2
                  }}
                >
                  {/* Page content - faint text lines */}
                  <div className="p-3">
                    {[...Array(5)].map((_, j) => (
                      <div 
                        key={j} 
                        className="h-2 bg-amber-200 rounded-full mb-2" 
                        style={{ width: `${Math.random() * 50 + 40}%` }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Progress text */}
            <div className="text-sm font-bold mt-2 mb-4">
              {currentBook}/{maxBooks} Books Searched
            </div>
            
            {/* Wand loading indicator */}
            <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full relative mt-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full relative"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${(currentBook/maxBooks) * 100}%`
                }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className="absolute -right-3 -top-4 w-6 h-6 text-xl"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg flex items-center justify-center"
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0.4)", "0 0 0 20px rgba(245, 158, 11, 0)"],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <span className="text-2xl">⚡</span>
              </motion.div>
            </div>
            
            <div className="text-lg font-bold font-harry mt-2">
              Magic Complete!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Quote text with animation */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentQuote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center font-medium mt-4"
        >
          {currentQuote}
        </motion.p>
      </AnimatePresence>
      
      {/* Floating magical particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-300 opacity-70"
            initial={{ 
              x: Math.random() * 100 - 50 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, `-${Math.random() * 50 + 20}%`],
              x: [null, `${(Math.random() - 0.5) * 20}%`],
              opacity: [0.7, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.7
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
