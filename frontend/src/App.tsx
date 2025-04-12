import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Header } from './components/Header';
import { Chat } from './components/Chat';
import { SummaryComponent } from './components/Summary';
import { Message, SummaryRequest, Summary as SummaryType, ResponseMode } from './types';
import { api } from './api';
import { LoadingState } from './components/LoadingState';

const queryClient = new QueryClient();

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [chatMode, setChatMode] = useState<ResponseMode>('freeform');
  const [summaryMode, setSummaryMode] = useState<ResponseMode>('structured');
  const [chatLoading, setChatLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setChatLoading(true);

    try {
      const chatRequest = {
        messages: [...messages, newMessage].map(({ role, content }) => ({ role, content })),
        response_mode: chatMode,
        stream: false,
      };

      const response = await api.sendMessage(chatRequest);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message.content,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, something went wrong with the magic. Please try again later.',
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    try {
      await api.clearMemory();
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  };

  const handleSummaryRequest = async (request: SummaryRequest) => {
    setSummaryLoading(true);
    
    try {
      const summaryRequest = {
        ...request,
        response_mode: summaryMode,
      };
      
      const response = await api.summarize(summaryRequest);
      
      // Extract title from first line (assuming the format "**Character Summary: Name**")
      const contentLines = response.message.content.split('\n');
      const titleMatch = contentLines[0].match(/\*\*(.*?)\*\*/);
      const title = titleMatch ? titleMatch[1] : `${request.type}: ${request.target}`;
      
      // Remove the first line (title) from content
      const content = contentLines.slice(1).join('\n').trim();
      
      const mockSummary: SummaryType = {
        title,
        content,
        sources: response.sources.map(source => {
          // Parse sources like "Harry Potter Book 2, Chapter 6"
          const match = source.match(/Book (\d+), Chapter (\d+)/);
          return { 
            book: match ? parseInt(match[1]) : 1, 
            chapter: match ? parseInt(match[2]) : 1 
          };
        }),
      };

      setSummary(mockSummary);
    } catch (error) {
      console.error('Error getting summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100">
        <Header />
        
        {/* This is a spacer div that takes up the same height as the header */}
        <div className="h-24"></div>
        
        {/* Main content container that starts after the header */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[calc(100vh-10rem)] w-full">
              <Chat
                messages={messages}
                onSend={handleSendMessage}
                onClear={handleClearChat}
                mode={chatMode}
                onModeChange={setChatMode}
                isLoading={chatLoading}
              />
            </div>
            <div className="h-[calc(100vh-10rem)] w-full">
              <SummaryComponent
                onSubmit={handleSummaryRequest}
                summary={summary}
                mode={summaryMode}
                onModeChange={setSummaryMode}
                isLoading={summaryLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;