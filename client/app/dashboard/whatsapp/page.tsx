"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const BaileysQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.qr) {
        setQrCode(data.qr);
      }

      if (data.message === "Conectado a WhatsApp") {
        setIsConnected(true);
        setQrCode(null);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex justify-center items-center mt-4">
      {isConnected ? (
        <p>Conectado a WhatsApp</p>
      ) : qrCode ? (
        <QRCodeCanvas value={qrCode} size={256} />
      ) : (
        <p>Esperando código QR...</p>
      )}
    </div>
  );
};

export default BaileysQR;
