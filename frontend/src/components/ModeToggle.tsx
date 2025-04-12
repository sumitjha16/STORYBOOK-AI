import React from 'react';
import { Feather, Scroll } from 'lucide-react';
import { ResponseMode, ModeToggleProps } from '../types';
import { cn } from '../utils';

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
      <button
        onClick={() => onChange('freeform')}
        className={cn(
          "p-2 rounded-lg transition-all duration-300",
          mode === 'freeform' ? "bg-white/20 shadow-lg scale-110" : "hover:bg-white/10"
        )}
        title="Freeform Mode"
      >
        <Feather className="h-5 w-5" />
      </button>
      <button
        onClick={() => onChange('structured')}
        className={cn(
          "p-2 rounded-lg transition-all duration-300",
          mode === 'structured' ? "bg-white/20 shadow-lg scale-110" : "hover:bg-white/10"
        )}
        title="Structured Mode"
      >
        <Scroll className="h-5 w-5" />
      </button>
    </div>
  );
};