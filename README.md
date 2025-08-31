# Anonymous Random Chat Application

A real-time anonymous chat application that connects strangers from around the world instantly using WebRTC technology.

## Features

- **Anonymous Connections**: No registration required, completely anonymous
- **Real-time Messaging**: Instant message delivery using WebRTC
- **Partner Matching**: Automatic matching with available users
- **Typing Indicators**: See when your partner is typing
- **Mobile Responsive**: Works seamlessly on all devices
- **Clean UI**: Modern, intuitive interface with smooth animations
- **Serverless**: Uses WebRTC for direct peer-to-peer connections

## Development

### Prerequisites
- Node.js 18+ 
- npm

### Running Locally

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## How It Works

1. Users connect to the landing page and see the current online count
2. Click "Start Anonymous Chat" to find a random partner
3. The system matches users using WebRTC for direct peer-to-peer connections
4. Once matched, users can chat instantly with typing indicators
5. Users can find new partners or disconnect at any time

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Real-time**: WebRTC for peer-to-peer messaging
- **Icons**: Lucide React

## Deployment

The application is optimized for static hosting and can be deployed to any static hosting provider like Netlify, Vercel, or GitHub Pages.