
import React from 'react';
import { AvatarGender, AvatarAge } from '../types';

interface AvatarProps {
  isSpeaking: boolean;
  audioLevel: number;
  gender: AvatarGender;
  age: AvatarAge;
}

const Avatar: React.FC<AvatarProps> = ({ isSpeaking, audioLevel, gender, age }) => {
  // Map gender/age to visual features (colors/hair)
  const skinColor = "#FFD1AA";
  const hairColor = gender === AvatarGender.MALE ? "#4A2C2C" : "#2D1B1B";
  const shirtColor = gender === AvatarGender.MALE ? "#3B82F6" : "#EC4899";
  
  // Mouth animation logic
  const mouthHeight = isSpeaking ? 10 + (Math.random() * 20) : 2;
  const micRippleScale = 1 + (audioLevel * 3);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Audio Visualizer Background Ripple */}
        {!isSpeaking && audioLevel > 0.01 && (
          <div 
            className="absolute inset-0 rounded-full bg-blue-400 opacity-20 transition-transform"
            style={{ transform: `scale(${micRippleScale})` }}
          ></div>
        )}

        {/* Simple Stylized Avatar SVG */}
        <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-2xl">
          {/* Background Circle */}
          <circle cx="100" cy="100" r="95" fill="#F1F5F9" />
          
          {/* Hair Back (Long for female) */}
          {gender === AvatarGender.FEMALE && (
             <path d="M40 100 Q40 40 100 40 Q160 40 160 100 L165 160 Q100 170 35 160 Z" fill={hairColor} />
          )}

          {/* Face */}
          <path d="M60 110 Q60 160 100 160 Q140 160 140 110 Q140 60 100 60 Q60 60 60 110" fill={skinColor} />
          
          {/* Hair Top */}
          <path d="M55 90 Q55 50 100 50 Q145 50 145 90 Q100 70 55 90" fill={hairColor} />

          {/* Eyes */}
          <g>
            <circle cx="85" cy="100" r="4" fill="#2D3748" />
            <circle cx="115" cy="100" r="4" fill="#2D3748" />
            {/* Blinking or expressions would go here */}
          </g>

          {/* Mouth */}
          <rect 
            x="85" 
            y={125 - (mouthHeight/2)} 
            width="30" 
            height={mouthHeight} 
            rx={mouthHeight/2} 
            fill="#4A1D1D" 
            className="transition-all duration-75"
          />

          {/* Shirt */}
          <path d="M50 160 Q100 150 150 160 L170 200 L30 200 Z" fill={shirtColor} />
        </svg>

        {/* Status Indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-100">
          <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : audioLevel > 0.01 ? 'bg-blue-500 animate-bounce' : 'bg-slate-300'}`}></div>
          <span className="text-xs font-bold text-slate-600 uppercase">
            {isSpeaking ? 'Buddy Speaking' : audioLevel > 0.01 ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold text-slate-800">
          Buddy {gender === AvatarGender.MALE ? 'is' : 'is'} your {age.toLowerCase()} tutor
        </h3>
        <p className="text-slate-500 text-sm">Always listening and ready to help.</p>
      </div>
    </div>
  );
};

export default Avatar;
