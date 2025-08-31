export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

export interface ChatState {
  isConnected: boolean;
  isSearching: boolean;
  partnerId: string | null;
  chatId: string | null;
  messages: Message[];
  partnerTyping: boolean;
  onlineCount: number;
}

export type ChatStatus = 'disconnected' | 'searching' | 'connected';