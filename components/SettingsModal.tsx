
import React from 'react';
import { 
  LearningMode, 
  VoiceStyle, 
  AvatarGender, 
  AvatarAge 
} from '../types';
import { Settings, X, Save, GraduationCap, UserCircle } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onApply: () => void;
  learningMode: LearningMode;
  setLearningMode: (mode: LearningMode) => void;
  voiceStyle: VoiceStyle;
  setVoiceStyle: (style: VoiceStyle) => void;
  gender: AvatarGender;
  setGender: (g: AvatarGender) => void;
  age: AvatarAge;
  setAge: (a: AvatarAge) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onApply,
  learningMode,
  setLearningMode,
  voiceStyle,
  setVoiceStyle,
  gender,
  setGender,
  age,
  setAge,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Session Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Practice Mode */}
          <div className="space-y-4">
            <h3 className="flex items-center text-sm font-bold text-slate-400 gap-2 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              Learning Mode
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(LearningMode).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLearningMode(mode)}
                  className={`p-3 rounded-xl text-left border-2 text-sm transition-all ${
                    learningMode === mode 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Avatar & Voice */}
          <div className="space-y-6">
            <h3 className="flex items-center text-sm font-bold text-slate-400 gap-2 uppercase tracking-wider">
              <UserCircle className="w-4 h-4" />
              Tutor Persona
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1 uppercase">Voice & Accent</label>
                <select 
                  value={voiceStyle}
                  onChange={(e) => setVoiceStyle(e.target.value as VoiceStyle)}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm focus:border-blue-500 outline-none"
                >
                  {Object.values(VoiceStyle).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1 uppercase">Gender</label>
                  <div className="flex bg-slate-50 p-1 rounded-xl border-2 border-slate-100">
                    {Object.values(AvatarGender).map(g => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                          gender === g ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1 uppercase">Age</label>
                  <select
                    value={age}
                    onChange={(e) => setAge(e.target.value as AvatarAge)}
                    className="w-full p-2 rounded-xl border-2 border-slate-100 bg-slate-50 text-xs focus:border-blue-500 outline-none"
                  >
                    {Object.values(AvatarAge).map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="flex-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Apply & Update Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
