import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { transaction_status, order_id, gross_amount } = req.body;

  // Cek apakah pembayaran sukses
  if (transaction_status === 'settlement') {
    // Kirim notifikasi ke WhatsApp
    const message = `Ada pesanan baru! Order ID: ${order_id}, Nominal: ${gross_amount}. Mohon segera diproses.`;
    
    try {
      await fetch(process.env.WHATSAPP_API_URL || '', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': process.env.WHATSAPP_API_TOKEN || ''
        },
        body: JSON.stringify({ 
            target: process.env.ADMIN_WA_NUMBER, 
            message: message 
        }),
      });
    } catch (error) {
      console.error('Gagal kirim WA:', error);
    }
  }

  res.status(200).json({ message: 'OK' });
}
