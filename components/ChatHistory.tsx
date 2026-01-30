
import React, { useEffect, useRef } from 'react';
import { ConversationTurn } from '../types';
import { User, Bot, MessageCircle, Download } from 'lucide-react';

interface ChatHistoryProps {
  turns: ConversationTurn[];
  partialUserText: string;
  partialAiText: string;
  isAiSpeaking: boolean;
  audioLevel: number;
  onDownload: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  turns, 
  partialUserText, 
  partialAiText, 
  isAiSpeaking,
  audioLevel,
  onDownload
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, partialUserText, partialAiText]);

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Conversation</h2>
        </div>
        {turns.length > 0 && (
          <button 
            onClick={onDownload}
            className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-500 transition-all"
            title="Download Chat History"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {turns.length === 0 && !partialUserText && !partialAiText && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-4">
            <p className="text-xs font-medium text-slate-500">Your chat will appear here as you speak.</p>
          </div>
        )}

        {turns.map((turn) => (
          <div key={turn.id} className="space-y-3">
            {/* User */}
            <div className="flex flex-col items-end pl-6">
              <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-full">
                <p className="text-xs font-medium leading-relaxed">{turn.userText}</p>
              </div>
            </div>

            {/* AI */}
            <div className="flex flex-col items-start pr-6">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-full">
                <p className="text-xs font-medium text-slate-800 leading-relaxed">{turn.aiResponse}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Partial User Text */}
        {partialUserText && (
          <div className="flex flex-col items-end pl-6 animate-in fade-in slide-in-from-right-1">
            <div className="bg-blue-500/90 text-white p-3 rounded-2xl rounded-tr-none border border-blue-400">
              <p className="text-xs font-medium italic opacity-90">{partialUserText}<span className="inline-block w-1 h-3 bg-white/50 animate-pulse ml-1"></span></p>
            </div>
          </div>
        )}

        {/* Partial AI Text */}
        {partialAiText && (
          <div className="flex flex-col items-start pr-6 animate-in fade-in slide-in-from-left-1">
            <div className="bg-white border-2 border-blue-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <p className="text-xs font-medium text-slate-800 leading-relaxed">
                {partialAiText}
                {isAiSpeaking && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping ml-2"></span>}
              </p>
            </div>
          </div>
        )}

        {/* Listening Indicator */}
        {!isAiSpeaking && audioLevel > 0.02 && !partialUserText && (
          <div className="flex justify-end items-center gap-2 opacity-40 pr-2">
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">Listening</span>
            <div className="flex gap-0.5">
              <div className="w-0.5 h-2 bg-blue-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-0.5 h-2 bg-blue-600 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
