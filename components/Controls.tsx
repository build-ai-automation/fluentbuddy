
import React from 'react';
import { PhoneOff, MicOff, Mic, Settings } from 'lucide-react';

interface ControlsProps {
  onStop: () => void;
  onOpenSettings: () => void;
  isAiSpeaking: boolean;
  audioLevel: number;
}

const Controls: React.FC<ControlsProps> = ({ onStop, onOpenSettings, isAiSpeaking, audioLevel }) => {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          {audioLevel > 0.01 ? (
            <Mic className="text-blue-600 w-5 h-5 animate-pulse" />
          ) : (
            <MicOff className="text-slate-400 w-5 h-5" />
          )}
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Microphone</div>
          <div className="text-sm font-semibold text-slate-700">
            {audioLevel > 0.01 ? 'Capturing Audio' : 'Silence'}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-3 rounded-2xl font-bold transition-all active:scale-95 border border-slate-200"
          title="Change Tutor Settings"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden md:inline">Settings</span>
        </button>
        <button
          onClick={onStop}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 md:px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 border border-red-200"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden md:inline">End Session</span>
          <span className="md:hidden">End</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;
