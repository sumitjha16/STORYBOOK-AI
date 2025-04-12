import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Menu } from 'lucide-react';
import { House } from '../types';
import { useTheme } from '../hooks/useTheme';

const houseColors: Record<House, { primary: string; secondary: string }> = {
  gryffindor: { primary: 'bg-red-700', secondary: 'bg-yellow-500' },
  slytherin: { primary: 'bg-green-800', secondary: 'bg-gray-300' },
  ravenclaw: { primary: 'bg-blue-800', secondary: 'bg-bronze-400' },
  hufflepuff: { primary: 'bg-yellow-400', secondary: 'bg-black' },
};

export const Header: React.FC = () => {
  const { house, setHouse, theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <motion.header 
      className="fixed top-0 w-full bg-opacity-90 backdrop-blur-sm z-50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="container mx-auto px-3 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Wand2 className="h-6 w-6 md:h-8 md:w-8" />
          <h1 className="text-lg md:text-2xl font-bold truncate">HP Storybook AI</h1>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Desktop controls */}
        <div className="hidden md:flex items-center space-x-6">
          <select
            value={house}
            onChange={(e) => setHouse(e.target.value as House)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="gryffindor">Gryffindor</option>
            <option value="slytherin">Slytherin</option>
            <option value="ravenclaw">Ravenclaw</option>
            <option value="hufflepuff">Hufflepuff</option>
          </select>
          
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {theme === 'light' ? 'Nox' : 'Lumos'}
          </button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <select
              value={house}
              onChange={(e) => setHouse(e.target.value as House)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="gryffindor">Gryffindor</option>
              <option value="slytherin">Slytherin</option>
              <option value="ravenclaw">Ravenclaw</option>
              <option value="hufflepuff">Hufflepuff</option>
            </select>
            
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-center"
            >
              {theme === 'light' ? 'Nox' : 'Lumos'}
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};