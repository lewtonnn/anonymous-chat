import React from 'react';

interface SearchingScreenProps {
  onCancel: () => void;
}

export const SearchingScreen: React.FC<SearchingScreenProps> = ({ onCancel }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Finding your chat partner...</h2>
        <p className="text-white/80">Connecting you with someone new</p>
        
        <button
          onClick={onCancel}
          className="mt-8 px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};