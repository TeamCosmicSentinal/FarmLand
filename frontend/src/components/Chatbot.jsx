import React, { useState, useRef, useEffect } from 'react';
import { askChatbot } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

function BotTyping() {
  return (
    <div className="flex items-center gap-2 text-leaf font-semibold py-2 px-4 bg-leaf/10 rounded-full animate-pulse">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-leaf rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-leaf rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-leaf rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span>AgriGuru is thinking...</span>
    </div>
  );
}

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setInput(''); // Clear input immediately
    setLoading(true); setError(null);
    try {
      const res = await askChatbot({ message: input, language });
      setMessages(msgs => [...msgs, { from: 'bot', text: res.data.answer }]);
    } catch (err) {
      setError('Chatbot error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-gradient-to-b from-white to-offwhite border-2 border-leaf/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 flex flex-col" 
      style={{ minHeight: '500px' }}
    >
      <div className="mb-4 flex justify-between items-center bg-leaf/10 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-leaf rounded-full flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.25m0 0v2.8a2.25 2.25 0 01-1.5 2.25m0 0a2.25 2.25 0 01-1.5 0m0 0a2.25 2.25 0 01-1.5-2.25m1.5 2.25v-1.5m0 0a24.301 24.301 0 00-4.5 0m0 0v1.5m0 0a2.25 2.25 0 01-1.5 2.25m0 0a2.25 2.25 0 01-1.5 0" />
            </svg>
          </div>
          <h2 className="font-heading text-xl font-bold text-leaf">AgriGuru AI</h2>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
          <label htmlFor="chatbot-language" className="font-medium text-leaf text-sm px-2">Language:</label>
          <select
            id="chatbot-language"
            className="bg-leaf/10 text-leaf rounded-lg p-1 focus:ring-2 focus:ring-leaf outline-none transition text-sm font-medium"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 p-2 bg-gray-50/50 rounded-xl" ref={chatRef}>
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500"
            >
              <div className="w-16 h-16 bg-leaf/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="font-medium">Ask AgriGuru about farming, crops, weather, or agricultural practices!</p>
              <p className="text-sm mt-2">Your AI farming assistant is ready to help</p>
            </motion.div>
          )}
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end mb-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.from === 'bot' && (
                <div className="mr-2 flex-shrink-0 w-8 h-8 bg-gradient-to-br from-leaf to-green-600 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.25m0 0v2.8a2.25 2.25 0 01-1.5 2.25m0 0a2.25 2.25 0 01-1.5 0m0 0a2.25 2.25 0 01-1.5-2.25m1.5 2.25v-1.5m0 0a24.301 24.301 0 00-4.5 0m0 0v1.5m0 0a2.25 2.25 0 01-1.5 2.25m0 0a2.25 2.25 0 01-1.5 0" />
                  </svg>
                </div>
              )}
              <div className={`relative max-w-[80%] px-4 py-3 text-base font-normal rounded-2xl shadow-md inline-block text-left break-words
                ${msg.from === 'user' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-tr-none transform hover:-translate-y-1 transition-transform duration-200' 
                  : 'bg-white border border-leaf/20 text-gray-800 rounded-tl-none transform hover:-translate-y-1 transition-transform duration-200'}`}>
                {msg.text}
              </div>
              {msg.from === 'user' && (
                <div className="ml-2 flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <BotTyping />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md flex items-center gap-2 animate-shake">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSend} className="flex items-center gap-2 mt-auto bg-white p-2 rounded-xl shadow-inner">
        <div className="relative flex-1">
          <input 
            className="w-full border-2 border-leaf/30 bg-white text-gray-800 rounded-full pl-10 pr-4 py-3 focus:ring-2 focus:ring-leaf focus:border-transparent outline-none transition-all shadow-sm" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder={`Ask AgriGuru something...`} 
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-leaf">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-leaf to-green-600 text-white font-heading font-bold rounded-full px-5 py-3 shadow-lg flex items-center gap-2 transition-all duration-200 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed" 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <span>Send</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
export default Chatbot;
