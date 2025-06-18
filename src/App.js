import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket connection setup
  useEffect(() => {
    if (!username) return;

    // For demo purposes, we'll simulate WebSocket with a mock server
    // In a real app, you would connect to an actual WebSocket server
    const mockWebSocket = {
      send: (data) => {
        // Simulate message broadcast - removed automatic message generation
        console.log('Message sent:', data);
      },
      close: () => {
        setIsConnected(false);
      }
    };

    wsRef.current = mockWebSocket;
    setIsConnected(true);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [username]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setShowUsernameModal(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && wsRef.current) {
      const messageData = {
        text: inputMessage.trim(),
        username: username
      };

      // Add own message to the chat
      const ownMessage = {
        id: Date.now(),
        text: inputMessage.trim(),
        username: username,
        timestamp: new Date().toISOString(),
        isOwn: true
      };
      setMessages(prev => [...prev, ownMessage]);

      // Send message through WebSocket
      wsRef.current.send(JSON.stringify(messageData));
      setInputMessage('');
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (showUsernameModal) {
    return (
      <div className="username-modal">
        <div className="username-modal-content">
          <h2>Welcome to Chat App</h2>
          <p>Please enter your username to start chatting:</p>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="username-input"
              autoFocus
            />
            <button type="submit" className="username-button">
              Start Chatting
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h1>React Chat App</h1>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <button onClick={clearChat} className="clear-button">
            Clear Chat
          </button>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isOwn ? 'own-message' : 'other-message'}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    <span className="username">{message.username}</span>
                    <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="message-input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            disabled={!isConnected}
          />
          <button type="submit" className="send-button" disabled={!isConnected || !inputMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App; 