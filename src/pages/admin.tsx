import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState({ nama: '', bio: '', wa: '', gopay: '', foto: '', background_url: '', voice_url: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
        const response = await fetch('/api/get-profil');
        const result = await response.json();
        if (result) setData(result);
    } catch (err) {
        console.error("Error fetching data:", err);
    }
  }

  async function updateData() {
    setLoading(true);
    try {
        const response = await fetch('/api/update-profil', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert('Data berhasil diupdate!');
        } else {
            alert('Gagal update: ' + (result.error || 'Terjadi kesalahan'));
        }
    } catch (err) {
        alert('Gagal update: ' + err);
    }
    setLoading(false);
  }

  async function uploadFile(e: any, type: 'foto' | 'voice') {
    // Fungsi ini perlu disesuaikan dengan backend API route agar tidak kena masalah header
    alert('Fungsi upload foto/audio perlu disesuaikan dengan API route.');
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center w-full max-w-sm shadow-2xl"
        >
          <h2 className="text-white text-lg mb-6 font-semibold">Akses Owner</h2>
          <input type="password" placeholder="Kata sandi" className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 border border-gray-700 focus:ring-1 focus:ring-gray-500 outline-none" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => password === "admin123" && setIsAuthenticated(true)} className="w-full bg-white text-gray-950 p-3 rounded-lg font-semibold hover:bg-gray-200 transition">Login</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-2 md:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl"
      >
        <h1 className="text-xl font-bold mb-6 text-center text-white">Dasbor Admin</h1>
        <div className="space-y-4">
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Foto Profil</label>
            <input type="file" onChange={(e) => uploadFile(e, 'foto')} className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700 text-xs file:bg-gray-700 file:border-0 file:text-white file:px-2 file:py-1 file:rounded-md cursor-pointer" />
          </div>
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Voice Review (Audio)</label>
            <input type="file" accept="audio/*" onChange={(e) => uploadFile(e, 'voice')} className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700 text-xs file:bg-gray-700 file:border-0 file:text-white file:px-2 file:py-1 file:rounded-md cursor-pointer" />
          </div>
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Nama</label>
            <input className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-gray-500 outline-none" value={data.nama} onChange={e => setData({...data, nama: e.target.value})} />
          </div>
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Bio</label>
            <textarea className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white h-16 focus:ring-1 focus:ring-gray-500 outline-none" value={data.bio} onChange={e => setData({...data, bio: e.target.value})} />
          </div>
          <div className="space-y-0.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">URL Background</label>
            <input className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-gray-500 outline-none" value={data.background_url} placeholder="https://..." onChange={e => setData({...data, background_url: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Nomor WA</label>
              <input className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-gray-500 outline-none" value={data.wa} onChange={e => setData({...data, wa: e.target.value})} />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Nomor GoPay</label>
              <input className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-gray-500 outline-none" value={data.gopay} onChange={e => setData({...data, gopay: e.target.value})} />
            </div>
          </div>
          <button 
            onClick={updateData} 
            disabled={loading}
            className="w-full p-3 bg-white text-gray-950 font-semibold rounded-lg hover:bg-gray-200 transition mt-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
