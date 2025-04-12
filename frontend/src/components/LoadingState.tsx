import React from 'react';
import { InteractiveLoading } from './InteractiveLoading';

interface LoadingStateProps {
  type: 'chat' | 'summary';
  onComplete?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ type, onComplete }) => {
  return <InteractiveLoading type={type} onComplete={onComplete} />;
};
