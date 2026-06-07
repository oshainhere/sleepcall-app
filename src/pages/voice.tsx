import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function VoiceAgent() {
  const [status, setStatus] = useState('Tekan mikrofon untuk mulai');
  const recognition = useRef<any>(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true; // Terus mendengar
      recognition.current.interimResults = false;
      recognition.current.lang = 'id-ID';

      recognition.current.onresult = (event: any) => {
        // Hentikan mendengar saat AI memproses
        recognition.current.stop();
        const text = event.results[event.results.length - 1][0].transcript;
        handleSend(text);
      };
    }
  }, []);

  const handleSend = async (text: string) => {
    setStatus('AI sedang berpikir...');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    speak(data.reply);
  };

  const speak = (text: string) => {
    setStatus('AI sedang bicara...');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    
    // Setelah AI selesai bicara, kembali mendengarkan
    utterance.onend = () => {
      setStatus('Mendengarkan...');
      recognition.current?.start();
    };
    
    synth.speak(utterance);
  };

  const startAgent = () => {
    setStatus('Mendengarkan...');
    recognition.current?.start();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={startAgent}
        className="w-32 h-32 rounded-full bg-white text-black text-4xl shadow-2xl flex items-center justify-center"
      >
        🎙️
      </motion.button>
      <p className="mt-8 text-gray-400 font-medium tracking-wide">{status}</p>
    </div>
  );
}
