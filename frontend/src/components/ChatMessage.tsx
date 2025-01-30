import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

// Add the cn utility function directly in the component
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface Message {
  sender: string;
  message: string;
  type: string;
  created_at: string;
}

interface ChatMessageProps {
  message: Message;
  hasNextMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, hasNextMessage }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const isUser = message.sender.toLowerCase() === 'user';
  
  useEffect(() => {
    // If this message is a loading message and there's a message after it,
    // mark it as completed
    if (message.type === 'loading' && hasNextMessage) {
      setIsCompleted(true);
    }
  }, [message, hasNextMessage]);

  const getMessageStyle = () => {
    
    switch (message.type) {
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'loading':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900';
    }
  };

  const getIcon = () => {
    
    switch (message.type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'loading':
        if (isCompleted) 
          return <CheckCircle className="w-4 h-4 text-blue-500" />;
        else return <Loader2 className="w-4 h-4 text-grey-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4 flex items-start gap-2',
          getMessageStyle()
        )}
      >
        {getIcon()}
        <div>
          <p className="text-sm whitespace-pre-wrap">
            {message.message}
            {isCompleted && (
              <span className="text-blue-600 font-medium">. Completed!</span>
            )}
          </p>
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.created_at).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 