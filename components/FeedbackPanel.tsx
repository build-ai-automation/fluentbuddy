import React from 'react';
import { ConversationTurn } from '../types';
import { CheckCircle2, XCircle, Sparkles, MessageSquareQuote } from 'lucide-react';

interface FeedbackPanelProps {
  turns: ConversationTurn[];
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ turns }) => {
  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Live Tutor Feedback
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {turns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <MessageSquareQuote className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-slate-500 text-xs font-medium">Your corrections will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-4">
            {turns.map((turn) => {
              const isCorrect = turn.corrections.length === 0;
              
              return (
                <div key={turn.id} className="animate-in slide-in-from-right-2 duration-300 space-y-2">
                  {/* Row 1: Spoken Sentence */}
                  <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                    isCorrect ? 'bg-green-50/30 border-green-100' : 'bg-red-50/30 border-red-100'
                  }`}>
                    <p className={`text-sm font-medium leading-relaxed ${isCorrect ? 'text-slate-700' : 'text-slate-600'}`}>
                      {turn.userText}
                    </p>
                    <div className="shrink-0 ml-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Row 2: Correction (Only if incorrect) */}
                  {!isCorrect && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-1">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 leading-relaxed">
                          {turn.corrections[0]?.corrected}
                        </p>
                        {turn.corrections[0]?.explanation && (
                          <p className="text-[10px] text-blue-600 mt-1 font-medium italic">
                            Tip: {turn.corrections[0].explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-[9px] text-slate-400 text-center uppercase tracking-widest font-bold">
        Listening for mistakes...
      </div>
    </div>
  );
};

export default FeedbackPanel;
