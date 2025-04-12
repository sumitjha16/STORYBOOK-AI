import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import { Message, ResponseMode } from '../types';
import { cn, formatStructuredContent } from '../utils';
import { ModeToggle } from './ModeToggle';
import { LoadingState } from './LoadingState';

interface ChatProps {
  messages: Message[];
  onSend: (message: string) => void;
  onClear: () => void;
  mode: ResponseMode;
  onModeChange: (mode: ResponseMode) => void;
  isLoading: boolean;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  onSend,
  onClear,
  mode,
  onModeChange,
  isLoading
}) => {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  // Helper function to determine if message contains structured content
  const hasStructuredContent = (content: string): boolean => {
    return content.includes('**') && content.match(/\*\*(.*?)\*\*/g) !== null;
  };

  return (
    <div className="magical-card flex flex-col h-full w-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">Magical Chat</h2>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "max-w-[80%] rounded-lg p-4 mb-4 magical-blur break-words",
                message.role === 'user'
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              )}
            >
              {mode === 'structured' && hasStructuredContent(message.content) ? (
                <div 
                  className="structured-content"
                  dangerouslySetInnerHTML={{ 
                    __html: formatStructuredContent(message.content)
                  }} 
                />
              ) : (
                <div>{message.content}</div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-[80%] rounded-lg mb-4"
            >
              <LoadingState type="chat" />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 sticky bottom-0 bg-white/10 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cast your spell..."
            className="magical-input flex-1 w-full"
            disabled={isLoading}
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="magical-button flex-1 sm:flex-none"
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onClear}
              className="magical-button bg-red-600 flex-1 sm:flex-none"
              disabled={isLoading}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};