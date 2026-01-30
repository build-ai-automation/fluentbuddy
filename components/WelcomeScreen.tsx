
import React from 'react';
import { 
  LearningMode, 
  VoiceStyle, 
  AvatarGender, 
  AvatarAge 
} from '../types';
import { Settings, Mic, GraduationCap, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  learningMode: LearningMode;
  setLearningMode: (mode: LearningMode) => void;
  voiceStyle: VoiceStyle;
  setVoiceStyle: (style: VoiceStyle) => void;
  gender: AvatarGender;
  setGender: (g: AvatarGender) => void;
  age: AvatarAge;
  setAge: (a: AvatarAge) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Mic className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">FluentBuddy AI</h1>
          <p className="text-slate-500 text-lg">Next-gen Spoken English Tutoring with Real-time Avatar Feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Practice Mode */}
          <div className="space-y-4">
            <h2 className="flex items-center text-lg font-bold text-slate-800 gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Learning Mode
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(LearningMode).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLearningMode(mode)}
                  className={`p-4 rounded-xl text-left border-2 transition-all ${
                    learningMode === mode 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="font-semibold">{mode}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Avatar & Voice */}
          <div className="space-y-6">
            <h2 className="flex items-center text-lg font-bold text-slate-800 gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Customize Your Tutor
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-2 uppercase tracking-wider">Speaking Accent & Speed</label>
                <select 
                  value={voiceStyle}
                  onChange={(e) => setVoiceStyle(e.target.value as VoiceStyle)}
                  className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-blue-500 transition-all outline-none"
                >
                  {Object.values(VoiceStyle).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-2 uppercase tracking-wider">Tutor Gender</label>
                  <div className="flex bg-slate-50 p-1 rounded-xl border-2 border-slate-100">
                    {Object.values(AvatarGender).map(g => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                          gender === g ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-2 uppercase tracking-wider">Tutor Age</label>
                  <select
                    value={age}
                    onChange={(e) => setAge(e.target.value as AvatarAge)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-blue-500 outline-none"
                  >
                    {Object.values(AvatarAge).map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onStart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <Play className="fill-current w-5 h-5" />
                Start Practicing
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">Microphone access required for real-time conversation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
