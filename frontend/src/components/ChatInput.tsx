import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
  placeholder?: string;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  loading = false,
  placeholder = "Describe your app or changes...",
  inputValue,
  setInputValue
}) => {
  const handleSend = () => {
    if (!inputValue.trim() || loading) return;
    onSend(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-white relative">
      <div className="flex items-center">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={loading}
          className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 hide-scrollbar"
          style={{
            height: '6rem',
            overflowY: 'auto',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !inputValue.trim()}
          className={`ml-2 rounded-full p-2 transition duration-200 ${
            inputValue.trim() 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 text-gray-400'
          }`}
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput; 