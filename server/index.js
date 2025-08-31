import express from 'express';
import { createServer } from'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

let waitingUsers = [];
let connectedUsers = new Map();
let chatRooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send current online count to all users
  const broadcastOnlineCount = () => {
    io.emit('onlineCount', io.engine.clientsCount);
  };
  
  broadcastOnlineCount();

  socket.on('findPartner', () => {
    console.log('User looking for partner:', socket.id);
    
    // Remove from any existing room first
    leaveCurrentRoom(socket);
    
    // Check if there's someone waiting
    if (waitingUsers.length > 0) {
      const partnerId = waitingUsers.shift();
      const partnerSocket = io.sockets.sockets.get(partnerId);
      
      if (partnerSocket) {
        // Create a room for these two users
        const roomId = `room_${socket.id}_${partnerId}`;
        
        socket.join(roomId);
        partnerSocket.join(roomId);
        
        connectedUsers.set(socket.id, { partnerId, roomId });
        connectedUsers.set(partnerId, { partnerId: socket.id, roomId });
        
        chatRooms.set(roomId, [socket.id, partnerId]);
        
        // Notify both users they're connected
        socket.emit('partnerFound', { partnerId, roomId });
        partnerSocket.emit('partnerFound', { partnerId: socket.id, roomId });
        
        console.log(`Matched ${socket.id} with ${partnerId} in room ${roomId}`);
      } else {
        // Partner disconnected, add current user to waiting list
        waitingUsers.push(socket.id);
        socket.emit('searching');
      }
    } else {
      // No one waiting, add to waiting list
      waitingUsers.push(socket.id);
      socket.emit('searching');
      console.log('Added to waiting list:', socket.id);
    }
  });

  socket.on('sendMessage', (data) => {
    const userConnection = connectedUsers.get(socket.id);
    if (userConnection) {
      socket.to(userConnection.roomId).emit('messageReceived', {
        text: data.text,
        timestamp: Date.now(),
        senderId: socket.id
      });
    }
  });

  socket.on('typing', (data) => {
    const userConnection = connectedUsers.get(socket.id);
    if (userConnection) {
      socket.to(userConnection.roomId).emit('partnerTyping', data.isTyping);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from waiting list
    waitingUsers = waitingUsers.filter(id => id !== socket.id);
    
    // Handle partner disconnection
    leaveCurrentRoom(socket);
    
    broadcastOnlineCount();
  });

  function leaveCurrentRoom(socket) {
    const userConnection = connectedUsers.get(socket.id);
    if (userConnection) {
      const { partnerId, roomId } = userConnection;
      
      // Notify partner about disconnection
      socket.to(roomId).emit('partnerDisconnected');
      
      // Clean up
      connectedUsers.delete(socket.id);
      connectedUsers.delete(partnerId);
      chatRooms.delete(roomId);
      
      // Remove partner from waiting list if they were waiting
      waitingUsers = waitingUsers.filter(id => id !== partnerId);
      
      console.log(`Cleaned up room ${roomId}`);
    }
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});