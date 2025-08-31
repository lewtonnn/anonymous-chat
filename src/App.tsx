import React, { useState, useCallback } from 'react';
import { useSocket } from './hooks/useSocket';
import { LandingScreen } from './components/LandingScreen';
import { SearchingScreen } from './components/SearchingScreen';
import { ChatInterface } from './components/ChatInterface';
import { Message } from './types/chat';

type AppState = 'landing' | 'searching' | 'chatting';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const handlePartnerFound = useCallback((partnerId: string) => {
    setAppState('chatting');
    setMessages([]);
    setPartnerTyping(false);
  }, []);

  const handlePartnerDisconnected = useCallback(() => {
    setAppState('landing');
    setMessages([]);
    setPartnerTyping(false);
    setCurrentMessage('');
  }, []);

  const handleMessageReceived = useCallback((messageData: { text: string; timestamp: number; senderId: string }) => {
    const message: Message = {
      id: Date.now().toString(),
      text: messageData.text,
      sender: 'partner',
      timestamp: messageData.timestamp
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const handlePartnerTyping = useCallback((isTyping: boolean) => {
    setPartnerTyping(isTyping);
  }, []);

  const {
    isConnected,
    isSearching,
    onlineCount,
    partnerId,
    findPartner,
    sendMessage,
    sendTyping,
    disconnect
  } = useSocket({
    onPartnerFound: handlePartnerFound,
    onPartnerDisconnected: handlePartnerDisconnected,
    onMessageReceived: handleMessageReceived,
    onPartnerTyping: handlePartnerTyping
  });

  const handleSendMessage = useCallback(() => {
    if (currentMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: currentMessage.trim(),
        sender: 'me',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, message]);
      sendMessage(currentMessage.trim());
      setCurrentMessage('');
    }
  }, [currentMessage, sendMessage]);

  const handleMessageChange = useCallback((message: string) => {
    setCurrentMessage(message);
    sendTyping(message.length > 0);
  }, [sendTyping]);

  const handleFindPartner = useCallback(() => {
    findPartner();
    setAppState('searching');
  }, [findPartner]);

  const handleCancelSearch = useCallback(() => {
    disconnect();
    setAppState('landing');
  }, [disconnect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setAppState('landing');
  }, [disconnect]);

  const handleFindNewPartner = useCallback(() => {
    disconnect();
    setTimeout(() => {
      findPartner();
      setAppState('searching');
    }, 100);
  }, [disconnect, findPartner]);

  if (appState === 'searching' || isSearching) {
    return (
      <SearchingScreen onCancel={handleCancelSearch} />
    );
  }

  if (appState === 'chatting' && partnerId) {
    return (
      <ChatInterface
        partnerId="Anonymous Partner"
        messages={messages}
        currentMessage={currentMessage}
        partnerTyping={partnerTyping}
        mySocketId="me"
        onMessageChange={handleMessageChange}
        onSendMessage={handleSendMessage}
        onFindNewPartner={handleFindNewPartner}
        onDisconnect={handleDisconnect}
      />
    );
  }

  return (
    <LandingScreen 
      onlineCount={onlineCount}
      onFindPartner={handleFindPartner}
    />
  );
}

export default App;