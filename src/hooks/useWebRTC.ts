import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';

interface UseWebRTCProps {
  onMessage: (message: string) => void;
  onPartnerConnected: () => void;
  onPartnerDisconnected: () => void;
  onPartnerTyping: (isTyping: boolean) => void;
}

export const useWebRTC = ({
  onMessage,
  onPartnerConnected,
  onPartnerDisconnected,
  onPartnerTyping
}: UseWebRTCProps) => {
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCode, setConnectionCode] = useState<string>('');
  const [isInitiator, setIsInitiator] = useState(false);
  
  const createPeer = useCallback((initiator: boolean, partnerSignal?: SimplePeer.SignalData) => {
    const newPeer = new SimplePeer({
      initiator,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    newPeer.on('signal', (signal) => {
      if (initiator) {
        setConnectionCode(JSON.stringify(signal));
      }
    });

    newPeer.on('connect', () => {
      setIsConnected(true);
      onPartnerConnected();
    });

    newPeer.on('data', (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'chat') {
        onMessage(message.text);
      } else if (message.type === 'typing') {
        onPartnerTyping(message.isTyping);
      }
    });

    newPeer.on('close', () => {
      setIsConnected(false);
      onPartnerDisconnected();
      setPeer(null);
    });

    newPeer.on('error', (err) => {
      console.error('WebRTC error:', err);
      setIsConnected(false);
      onPartnerDisconnected();
      setPeer(null);
    });

    if (partnerSignal) {
      newPeer.signal(partnerSignal);
    }

    setPeer(newPeer);
    setIsInitiator(initiator);
  }, [onMessage, onPartnerConnected, onPartnerDisconnected, onPartnerTyping]);

  const startAsInitiator = useCallback(() => {
    createPeer(true);
  }, [createPeer]);

  const connectToPartner = useCallback((signalData: string) => {
    try {
      const signal = JSON.parse(signalData);
      createPeer(false, signal);
    } catch (error) {
      console.error('Invalid connection code:', error);
    }
  }, [createPeer]);

  const sendMessage = useCallback((text: string) => {
    if (peer && isConnected) {
      peer.send(JSON.stringify({ type: 'chat', text }));
    }
  }, [peer, isConnected]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (peer && isConnected) {
      peer.send(JSON.stringify({ type: 'typing', isTyping }));
    }
  }, [peer, isConnected]);

  const disconnect = useCallback(() => {
    if (peer) {
      peer.destroy();
    }
    setPeer(null);
    setIsConnected(false);
    setConnectionCode('');
    setIsInitiator(false);
  }, [peer]);

  return {
    isConnected,
    connectionCode,
    isInitiator,
    startAsInitiator,
    connectToPartner,
    sendMessage,
    sendTyping,
    disconnect
  };
};