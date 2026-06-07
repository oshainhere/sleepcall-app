import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function VoiceAgent() {
  const [status, setStatus] = useState('Klik tombol untuk bicara');
  const recognition = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.lang = 'id-ID';

      recognition.current.onresult = (event: any) => {
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
    playVoice(data.reply);
  };

  const playVoice = async (text: string) => {
    setStatus('AI sedang bicara...');
    const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error('TTS Error:', errorData);
        alert('Gagal memutar suara: ' + JSON.stringify(errorData));
        setStatus('Error memutar suara');
        return;
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    audio.onended = () => {
      setStatus('Mendengarkan...');
      recognition.current?.start();
    };
    audio.play();
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
