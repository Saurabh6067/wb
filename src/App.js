import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Safe localStorage functions with error handling
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      setError('Unable to save messages. Please check your browser settings.');
    }
  };

  const loadFromLocalStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setError('Unable to load saved messages. Please check your browser settings.');
      return null;
    }
  };

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = loadFromLocalStorage('chatMessages');
    if (savedMessages && Array.isArray(savedMessages)) {
      setMessages(savedMessages);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveToLocalStorage('chatMessages', messages);
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket connection setup
  useEffect(() => {
    if (!username) return;

    // Connect to PieSocket demo WebSocket server
    const ws = new window.WebSocket(
      'wss://demo.piesocket.com/v3/channel_1?api_key=DEMOKEY&notify_self'
    );

    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      setError('WebSocket error. Please try again later.');
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.username && data.text) {
          const newMsg = {
            id: Date.now() + Math.random(),
            text: data.text,
            username: data.username,
            timestamp: new Date().toISOString(),
            isOwn: data.username === username
          };
          setMessages(prev => {
            const newMessages = [...prev, newMsg];
            saveToLocalStorage('chatMessages', newMessages);
            return newMessages;
          });
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    return () => {
      ws.close();
    };
  }, [username]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setShowUsernameModal(false);
      setError(''); // Clear any previous errors
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
        id: Date.now() + Math.random(), // Ensure unique ID
        text: inputMessage.trim(),
        username: username,
        timestamp: new Date().toISOString(),
        isOwn: true
      };
      
      setMessages(prev => {
        const newMessages = [...prev, ownMessage];
        // Immediately save to localStorage
        saveToLocalStorage('chatMessages', newMessages);
        return newMessages;
      });

      // Send message through WebSocket
      wsRef.current.send(JSON.stringify(messageData));
      setInputMessage('');
      setError(''); // Clear any previous errors
    }
  };

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem('chatMessages');
      setError('');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      setError('Unable to clear messages. Please refresh the page.');
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Invalid time';
    }
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

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

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