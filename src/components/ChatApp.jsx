import { useState, useEffect } from 'react';
import io from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socket = io('http://localhost:3000'); // Cambia la URL si es necesario

  useEffect(() => {
    // Recibe mensajes del servidor y actualiza el estado
    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const message = { text: inputValue, sender: 'Me' };
      socket.emit('send_message', message); // Envía el mensaje al servidor
      setMessages((prevMessages) => [...prevMessages, message]); // Actualiza el estado localmente
      setInputValue(''); // Limpia el campo de entrada
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white text-lg font-semibold">
        Real-Time Chat
      </div>

      {/* Message Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'Me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.sender === 'Me' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form className="p-4 bg-white flex" onSubmit={sendMessage}>
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatApp;
