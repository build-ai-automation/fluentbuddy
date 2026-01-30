import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { 
  LearningMode, 
  VoiceStyle, 
  AvatarGender, 
  AvatarAge, 
  ConversationTurn, 
  Correction 
} from './types';
import { getSystemInstruction, VOICE_MAP, GEMINI_MODEL } from './constants';
import Avatar from './components/Avatar';
import Controls from './components/Controls';
import FeedbackPanel from './components/FeedbackPanel';
import ChatHistory from './components/ChatHistory';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import SettingsModal from './components/SettingsModal';

// Audio Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [learningMode, setLearningMode] = useState<LearningMode>(LearningMode.FREE_CONVERSATION);
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>(VoiceStyle.NEUTRAL);
  const [gender, setGender] = useState<AvatarGender>(AvatarGender.FEMALE);
  const [age, setAge] = useState<AvatarAge>(AvatarAge.YOUNG_ADULT);
  
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [partialUserText, setPartialUserText] = useState('');
  const [partialAiText, setPartialAiText] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  
  const currentInputText = useRef('');
  const currentOutputText = useRef('');

  const stopConversation = useCallback((cleanupHistory = true) => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    
    setIsConnecting(false);
    setIsAiSpeaking(false);
    setAudioLevel(0);
    setPartialAiText('');
    setPartialUserText('');
    
    if (cleanupHistory) {
      setIsStarted(false);
      setTurns([]);
    }
  }, []);

  const startConversation = async (keepHistory = false) => {
    setIsConnecting(true);
    if (!keepHistory) setIsStarted(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: GEMINI_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_MAP[voiceStyle] } },
          },
          systemInstruction: getSystemInstruction(learningMode, voiceStyle, gender, age),
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              setAudioLevel(Math.sqrt(sum / inputData.length));

              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              currentInputText.current += message.serverContent.inputTranscription.text;
              setPartialUserText(currentInputText.current);
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputText.current += message.serverContent.outputTranscription.text;
              
              const raw = currentOutputText.current;
              let clean = raw;
              
              if (raw.includes('[FEEDBACK]')) {
                const parts = raw.split('[/FEEDBACK]');
                if (parts.length > 1) {
                  clean = parts[1].trim();
                } else {
                  clean = ''; 
                }
              }
              setPartialAiText(clean);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsAiSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsAiSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.turnComplete) {
              const rawAiText = currentOutputText.current;
              
              // Robust extraction: Check for tags first
              let feedbackMatch = rawAiText.match(/\[FEEDBACK\]([\s\S]*?)\[\/FEEDBACK\]/);
              
              // Fallback: If tags are missing, try to find a JSON object in the first 200 chars
              if (!feedbackMatch) {
                const jsonLike = rawAiText.match(/\{[\s\S]*?\}/);
                if (jsonLike && rawAiText.indexOf(jsonLike[0]) < 100) {
                  feedbackMatch = jsonLike;
                }
              }

              let parsedCorrections: Correction[] = [];
              let cleanAiText = rawAiText;
              
              if (feedbackMatch) {
                try {
                  const content = feedbackMatch[1] || feedbackMatch[0];
                  const feedbackJson = JSON.parse(content);
                  parsedCorrections = Array.isArray(feedbackJson) ? feedbackJson : [feedbackJson];
                  
                  // Cleanup the text shown in chat
                  if (rawAiText.includes('[/FEEDBACK]')) {
                    cleanAiText = rawAiText.split('[/FEEDBACK]')[1].trim();
                  } else {
                    cleanAiText = rawAiText.replace(content, '').trim();
                  }
                } catch (e) {
                  console.error("Feedback JSON Parse Error", e);
                }
              }

              const newTurn: ConversationTurn = {
                id: Math.random().toString(36).substr(2, 9),
                userText: currentInputText.current.trim() || "(Silence)",
                aiResponse: cleanAiText || "(Response)",
                corrections: parsedCorrections,
                timestamp: Date.now(),
              };

              setTurns(prev => [...prev, newTurn]);
              currentInputText.current = '';
              currentOutputText.current = '';
              setPartialUserText('');
              setPartialAiText('');
            }

            if (message.serverContent?.interrupted) {
              for (const s of sourcesRef.current) {
                try { s.stop(); } catch(e) {}
                sourcesRef.current.delete(s);
              }
              nextStartTimeRef.current = 0;
              setIsAiSpeaking(false);
              setPartialAiText('');
            }
          },
          onerror: (e) => {
            console.error("Gemini Error", e);
            stopConversation(false);
          },
          onclose: () => {
            console.log("Gemini Connection Closed");
            setIsConnecting(false);
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Start failed", err);
      setIsConnecting(false);
      setIsStarted(false);
    }
  };

  const handleSettingsUpdate = () => {
    setIsSettingsOpen(false);
    stopConversation(false);
    startConversation(true);
  };

  const downloadHistory = () => {
    if (turns.length === 0) return;
    const content = turns.map(t => `YOU: ${t.userText}\nBUDDY: ${t.aiResponse}\n${t.corrections.length ? 'FEEDBACK: ' + t.corrections[0].corrected : ''}\n`).join('\n---\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FluentBuddy_Session_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isStarted && !isConnecting) {
    return (
      <WelcomeScreen 
        onStart={() => startConversation(false)}
        learningMode={learningMode}
        setLearningMode={setLearningMode}
        voiceStyle={voiceStyle}
        setVoiceStyle={setVoiceStyle}
        gender={gender}
        setGender={setGender}
        age={age}
        setAge={setAge}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <div className="w-full md:w-1/4 flex flex-col min-h-0">
          <ChatHistory 
            turns={turns} 
            partialUserText={partialUserText}
            partialAiText={partialAiText}
            isAiSpeaking={isAiSpeaking}
            audioLevel={audioLevel}
            onDownload={downloadHistory}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden flex items-center justify-center p-4">
            {isConnecting ? (
              <div className="text-center animate-pulse">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-600 font-bold">Connecting Tutor...</p>
              </div>
            ) : (
              <Avatar 
                isSpeaking={isAiSpeaking} 
                audioLevel={audioLevel}
                gender={gender}
                age={age}
              />
            )}
          </div>
          
          <Controls 
            onStop={() => stopConversation(true)} 
            onOpenSettings={() => setIsSettingsOpen(true)}
            isAiSpeaking={isAiSpeaking}
            audioLevel={audioLevel}
          />
        </div>

        <div className="w-full md:w-1/4 flex flex-col overflow-hidden">
          <FeedbackPanel turns={turns} />
        </div>
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)}
          onApply={handleSettingsUpdate}
          learningMode={learningMode}
          setLearningMode={setLearningMode}
          voiceStyle={voiceStyle}
          setVoiceStyle={setVoiceStyle}
          gender={gender}
          setGender={setGender}
          age={age}
          setAge={setAge}
        />
      )}
    </div>
  );
};

export default App;
