// hooks/useTheme.ts
import { useState, useEffect } from 'react';
import { House } from '../types';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check for saved theme preference or use dark as default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Use dark as fallback instead of system preference
    return 'dark';
  });

  const [house, setHouse] = useState<House>(() => {
    // Check for saved house preference or default to hufflepuff
    const savedHouse = localStorage.getItem('house') as House;
    return savedHouse || 'hufflepuff';
  });

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Toggle dark mode class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply house theme to body
  useEffect(() => {
    const body = window.document.body;
    
    // Remove all house classes first
    body.classList.remove('house-gryffindor', 'house-slytherin', 'house-ravenclaw', 'house-hufflepuff');
    
    // Add the selected house class
    body.classList.add(`house-${house}`);
    
    // Save house preference
    localStorage.setItem('house', house);
  }, [house]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme, house, setHouse };
}