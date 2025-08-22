import React, { useState, useRef, useEffect } from 'react';
import { askChatbot } from '../api/api';

function BotTyping() {
  return (
    <div className="flex items-center gap-2 text-leaf font-semibold py-2">
      <svg className="animate-spin h-5 w-5 text-leaf" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      <span>Thinking...</span>
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
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-card p-4 flex flex-col" style={{ minHeight: '500px' }}>
      <div className="mb-2 flex gap-2 items-center">
        <label htmlFor="chatbot-language" className="font-medium text-leaf">Language:</label>
        <select
          id="chatbot-language"
          className="border border-hemlock bg-offwhite text-black rounded-lg p-1 focus:ring-2 focus:ring-leaf outline-none transition"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="kn">Kannada</option>
        </select>
      </div>
      <div className="flex-1 overflow-y-auto mb-2" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end mb-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'bot' && (
              <span className="mr-2 flex-shrink-0 w-8 h-8 bg-leaf rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a7 7 0 017 7v2a7 7 0 01-7 7 7 7 0 01-7-7V9a7 7 0 017-7zm0 0v2m0 16v2m-7-7h2m12 0h2" /></svg>
              </span>
            )}
            <span className={`relative max-w-[75%] px-4 py-2 text-base font-normal rounded-2xl shadow-sm inline-block text-left break-words
              ${msg.from === 'user' ? 'bg-[#4CD964] text-white imessage-tail-right' : 'bg-offwhite text-black imessage-tail-left'}`}>{msg.text}</span>
            {msg.from === 'user' && (
              <span className="ml-2 flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              </span>
            )}
          </div>
        ))}
        {loading && <BotTyping />}
      </div>
      <form onSubmit={handleSend} className="flex items-center gap-2 mt-auto">
        <input className="flex-1 border border-hemlock bg-offwhite text-black rounded-full px-4 py-2 focus:ring-2 focus:ring-leaf outline-none transition" value={input} onChange={e => setInput(e.target.value)} placeholder={`Type a message...`} />
        <button className="btn btn-green font-heading rounded-full px-5 py-2 shadow-card transition-all duration-200 hover:scale-105 active:scale-100" type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}
export default Chatbot;
