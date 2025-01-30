import React from 'react';
import { User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  leftElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, leftElement }) => {
  return (
    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white">
      
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {leftElement}
      
      <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="text-gray-700">John Doe</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
};

export default Header;