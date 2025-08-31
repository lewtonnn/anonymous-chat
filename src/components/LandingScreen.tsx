import React from 'react';
import { MessageCircle, Users, Zap } from 'lucide-react';

interface LandingScreenProps {
  onlineCount: number;
  onFindPartner: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onlineCount, onFindPartner }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">AnonChat</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Connect with strangers around the world instantly. 
            Anonymous, secure, and completely free.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between text-white/80 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{onlineCount.toLocaleString()} online</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant match</span>
            </div>
          </div>
          
          <button
            onClick={onFindPartner}
            className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-xl hover:bg-white/90 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Anonymous Chat
          </button>
        </div>
        
        <div className="text-center text-white/60 text-sm">
          <p>No registration required • Completely anonymous • Safe & secure</p>
        </div>
      </div>
    </div>
  );
};