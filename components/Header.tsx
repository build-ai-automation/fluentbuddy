
import React from 'react';
import { Mic, Settings, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <Mic className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">FluentBuddy</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Your Private English Tutor</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onSettingsClick && (
          <button 
            onClick={onSettingsClick}
            className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Tune Tutor</span>
          </button>
        )}
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">JS</div>
          <span className="text-sm font-semibold">User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
