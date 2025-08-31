import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketProps {
  onPartnerFound: (partnerId: string) => void;
  onPartnerDisconnected: () => void;
  onMessageReceived: (message: { text: string; timestamp: number; senderId: string }) => void;
  onPartnerTyping: (isTyping: boolean) => void;
}

export const useSocket = ({
  onPartnerFound,
  onPartnerDisconnected,
  onMessageReceived,
  onPartnerTyping
}: UseSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? "anonymous-chat-production-4962.up.railway.app"
      : 'http://localhost:3001';
    
    socketRef.current = io(serverUrl);

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setIsSearching(false);
      setPartnerId(null);
    });

    socketRef.current.on('onlineCount', (count: number) => {
      setOnlineCount(count);
    });

    socketRef.current.on('searching', () => {
      setIsSearching(true);
    });

    socketRef.current.on('partnerFound', (data: { partnerId: string }) => {
      setIsSearching(false);
      setPartnerId(data.partnerId);
      onPartnerFound(data.partnerId);
    });

    socketRef.current.on('partnerDisconnected', () => {
      setPartnerId(null);
      onPartnerDisconnected();
    });

    socketRef.current.on('messageReceived', onMessageReceived);

    socketRef.current.on('partnerTyping', onPartnerTyping);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onPartnerFound, onPartnerDisconnected, onMessageReceived, onPartnerTyping]);

  const findPartner = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('findPartner');
      setIsSearching(true);
    }
  };

  const sendMessage = (text: string) => {
    if (socketRef.current && partnerId) {
      socketRef.current.emit('sendMessage', { text });
    }
  };

  const sendTyping = (isTyping: boolean) => {
    if (socketRef.current && partnerId) {
      socketRef.current.emit('typing', { isTyping });
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
    setPartnerId(null);
    setIsSearching(false);
  };

  return {
    isConnected,
    isSearching,
    onlineCount,
    partnerId,
    findPartner,
    sendMessage,
    sendTyping,
    disconnect
  };
};