import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [profil, setProfil] = useState({ nama: '', bio: '', wa: '', gopay: '', foto: '', background_url: '' });
  const [paket, setPaket] = useState('');

  useEffect(() => {
    async function loadProfil() {
      try {
        const response = await fetch('/api/get-profil');
        const data = await response.json();
        if (data) setProfil(data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    loadProfil();
  }, []);

  const handleOrder = () => {
    if (!paket) return alert("Pilih paket terlebih dahulu!");
    const text = `Halo, saya ingin pesan ${paket}. Saya sudah melakukan transfer ke GoPay Anda. Mohon konfirmasinya.`;
    window.open(`https://wa.me/${profil.wa}?text=${encodeURIComponent(text)}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-gray-100 p-4 md:p-8 font-sans flex items-center justify-center bg-cover bg-center bg-no-repeat transition-all duration-700"
      style={{ backgroundImage: profil.background_url ? `url(${profil.background_url})` : 'none' }}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none" />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="relative z-10 max-w-sm w-full bg-[#0a0a0a]/70 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/5 shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)]"
      >
        {/* Avatar */}
        <div className="mx-auto mb-8 w-28 h-28 rounded-full border border-white/10 shadow-inner overflow-hidden flex items-center justify-center">
            {profil.foto ? <img src={profil.foto} alt="Profil" className="w-full h-full object-cover" /> : <span className="text-gray-500 text-sm">Foto</span>}
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{profil.nama || "Nama"}</h1>
          <p className="text-sm text-gray-400 font-medium">{profil.bio || "Bio"}</p>
        </div>

        {/* Voice Review */}
        {profil.voice_url && (
          <div className="bg-white/[0.03] p-4 rounded-2xl mb-8 border border-white/5">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Voice Review</p>
            <audio src={profil.voice_url} controls className="w-full h-10" />
          </div>
        )}

        {/* Payment Box */}
        <div className="bg-white/[0.03] p-6 rounded-2xl mb-6 border border-white/5">
            <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">GoPay ID</p>
                <button 
                    onClick={() => {navigator.clipboard.writeText(profil.gopay); alert('Nomor disalin!');}}
                    className="text-[10px] bg-white/5 hover:bg-white/10 transition text-gray-300 px-3 py-1 rounded-full font-bold uppercase tracking-wide"
                >
                    Salin
                </button>
            </div>
            <div className="text-2xl font-mono font-semibold text-white tracking-tight">
                {profil.gopay}
            </div>
        </div>

        {/* Important Instructions Box */}
        <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl mb-8">
          <p className="text-[11px] font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
            Catatan Penting
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Lakukan pembayaran di atas, screenshot bukti, dan kirim ke konfirmasi WA.
          </p>
        </div>

        {/* Action Area */}
        <div className="space-y-4">
          <select className="w-full p-4 bg-[#111] border border-white/5 rounded-2xl text-white appearance-none focus:ring-1 focus:ring-white/20 outline-none transition-all text-sm font-medium" onChange={(e) => setPaket(e.target.value)}>
            <option value="" className="text-gray-500">Pilih Paket Layanan</option>
            <option value="3 Jam - 50k" className="text-white">3 Jam - 50k</option>
            <option value="6 Jam - 100k" className="text-white">6 Jam - 100k</option>
          </select>

          <motion.button 
            whileHover={{ scale: 1.01, backgroundColor: "#ffffff" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOrder} 
            className="w-full p-4 bg-white text-black font-bold rounded-2xl transition-all duration-300 text-sm uppercase tracking-wider"
          >
            Konfirmasi Via WA
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
