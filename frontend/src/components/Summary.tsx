import React from 'react';
import { motion } from 'framer-motion';
import { Book, MapPin, Calendar, Home, Wand2, Users } from 'lucide-react';
import { SummaryRequest, Summary as SummaryType, ResponseMode } from '../types';
import { ModeToggle } from './ModeToggle';
import { useTheme } from '../hooks/useTheme';
import { cn, formatStructuredContent } from '../utils';
import { LoadingState } from './LoadingState';

interface SummaryProps {
  onSubmit: (request: SummaryRequest) => void;
  summary: SummaryType | null;
  mode: ResponseMode;
  onModeChange: (mode: ResponseMode) => void;
  isLoading: boolean;
}

export const SummaryComponent: React.FC<SummaryProps> = ({
  onSubmit,
  summary,
  mode,
  onModeChange,
  isLoading
}) => {
  const [type, setType] = React.useState<SummaryRequest['type']>('character');
  const [query, setQuery] = React.useState('');
  const { house } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit({ type, target: query, response_mode: mode });
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'character': return <Book className="h-5 w-5" />;
      case 'chapter': return <MapPin className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      case 'location': return <Home className="h-5 w-5" />;
      case 'spell': return <Wand2 className="h-5 w-5" />;
      case 'house': return <Users className="h-5 w-5" />;
      default: return <Book className="h-5 w-5" />;
    }
  };

  // Helper function to determine if content contains structured formatting
  const hasStructuredContent = (content: string): boolean => {
    return content.includes('**') && content.match(/\*\*(.*?)\*\*/g) !== null;
  };

  return (
    <div className="magical-card flex flex-col h-full w-full">
      <div className="p-4 border-b border-gray-200/30 dark:border-gray-700/30 flex justify-between items-center">
        <h2 className="text-xl font-bold">Magical Encyclopedia</h2>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SummaryRequest['type'])}
              className="magical-input w-full sm:w-auto"
              disabled={isLoading}
            >
              <option value="character">Character</option>
              <option value="chapter">Chapter</option>
              <option value="event">Event</option>
              <option value="location">Location</option>
              <option value="spell">Spell</option>
              <option value="house">House</option>
            </select>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query..."
              className="magical-input flex-1 w-full"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="magical-button w-full flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {getIcon()}
            <span>Reveal Magic</span>
          </button>
        </form>

        {isLoading ? (
          <LoadingState type="summary" />
        ) : summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "magical-card p-4",
              "bg-white/20 dark:bg-gray-800/30 shadow-lg"
            )}
          >
            <h3 className="text-lg font-bold mb-2 break-words">{summary.title}</h3>
            {mode === 'structured' && hasStructuredContent(summary.content) ? (
              <div 
                className="structured-content space-y-3"
                dangerouslySetInnerHTML={{ 
                  __html: formatStructuredContent(summary.content)
                }} 
              />
            ) : (
              <div className="prose prose-sm dark:prose-invert">
                {summary.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-2">{paragraph}</p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};