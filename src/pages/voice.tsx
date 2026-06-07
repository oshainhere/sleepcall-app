import { LiveAPIProvider } from '@/contexts/LiveAPIContext';
import ControlTray from '@/components/console/control-tray/ControlTray';
import { motion } from 'framer-motion';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export default function VoiceAgent() {
  if (!API_KEY) {
    return <div className="text-white p-10">Error: API Key tidak ditemukan. Pastikan GEMINI_API_KEY terpasang di Vercel.</div>;
  }

  return (
    <LiveAPIProvider apiKey={API_KEY}>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight">AI Voice Agent</h1>
          <p className="text-gray-500 text-sm">Real-time Multimodal Interaction</p>
        </motion.div>
        
        {/* Tray ini berisi tombol mikrofon dan status AI */}
        <ControlTray />
      </div>
    </LiveAPIProvider>
  );
}
