import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function VoiceAgent() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  
  const recognition = useRef<any>(null);

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.lang = 'id-ID';

      recognition.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleSend(text);
      };
      
      recognition.current.onend = () => setIsListening(false);
    }
  }, []);

  const handleSend = async (text: string) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    setResponse(data.reply);
    speak(data.reply);
  };

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    
    // Pilih suara yang lebih natural jika tersedia (opsional)
    const voices = synth.getVoices();
    const neuralVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Neural'));
    if (neuralVoice) utterance.voice = neuralVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current.stop();
    } else {
      setIsListening(true);
      recognition.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      <motion.button
        animate={{ scale: isListening ? 1.2 : 1 }}
        onClick={toggleListening}
        className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl ${isListening ? 'bg-red-500' : 'bg-white text-black'}`}
      >
        {isListening ? '🎙️' : '🗣️'}
      </motion.button>

      <div className="mt-8 text-center max-w-sm">
        <p className="text-gray-400 text-sm italic">{transcript || 'Tekan tombol untuk bicara...'}</p>
        <p className="mt-4 text-white font-semibold">{isSpeaking ? 'AI sedang bicara...' : response}</p>
      </div>
    </div>
  );
}
