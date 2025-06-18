# React Chat Application

A real-time chat application built with React.js featuring WebSocket communication and localStorage persistence.

## Features

- **Real-time Messaging**: WebSocket-based communication for instant message delivery
- **Message Persistence**: Messages are stored in localStorage and persist across page refreshes
- **Modern UI**: Beautiful, responsive design with gradient backgrounds and smooth animations
- **User Authentication**: Simple username-based authentication
- **Message Timestamps**: Each message displays the time it was sent
- **Connection Status**: Visual indicator showing WebSocket connection status
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Auto-scroll**: Messages automatically scroll to the bottom when new messages arrive

## Technologies Used

- **React.js**: Frontend framework
- **WebSocket**: Real-time communication (simulated for demo)
- **localStorage**: Message persistence
- **CSS3**: Modern styling with gradients and animations

## Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## How to Use

1. **Enter Username**: When the app loads, you'll see a modal asking for your username
2. **Start Chatting**: After entering your username, you can start sending messages
3. **Real-time Messages**: The app simulates other users sending messages randomly
4. **Message Persistence**: Your messages will be saved and restored when you refresh the page
5. **Clear Chat**: Use the "Clear Chat" button to remove all messages

## Project Structure

```
chat2/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── App.js             # Main React component
│   ├── App.css            # Component styles
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## WebSocket Implementation

This demo uses a simulated WebSocket connection to demonstrate the concept. In a real application, you would:

1. **Connect to a WebSocket server**:
   ```javascript
   const ws = new WebSocket('ws://your-server-url');
   ```

2. **Handle WebSocket events**:
   ```javascript
   ws.onopen = () => setIsConnected(true);
   ws.onmessage = (event) => {
     const message = JSON.parse(event.data);
     setMessages(prev => [...prev, message]);
   };
   ws.onclose = () => setIsConnected(false);
   ```

3. **Send messages**:
   ```javascript
   ws.send(JSON.stringify(messageData));
   ```

## Customization

### Changing Colors
Modify the gradient colors in `App.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adding Features
- **File Upload**: Add file sharing capabilities
- **Emojis**: Integrate emoji picker
- **User Avatars**: Add profile pictures
- **Message Reactions**: Allow users to react to messages
- **Typing Indicators**: Show when users are typing

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 3000 is busy, React will automatically suggest an alternative port
2. **Dependencies not installed**: Run `npm install` to install all required packages
3. **localStorage not working**: Ensure cookies are enabled in your browser

### Development Tips

- Use browser developer tools to inspect localStorage
- Check the console for any error messages
- Test on different screen sizes for responsive design

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for improvements! 