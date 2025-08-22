import React, { useEffect, useState } from 'react';
import { getTips, getAITip } from '../api/api';

function TipsSection() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    setLoading(true); setError(null);
    getTips().then(res => setTips(res.data)).catch(() => setError('Failed to fetch tips')).finally(() => setLoading(false));
  }, []);

  const handleAsk = async (e) => {
    e.preventDefault();
    setAnswer(null); setAnswerLoading(true);
    // Timeout after 20 seconds
    const tId = setTimeout(() => {
      setAnswer('Sorry, the AI is taking too long to respond. Please try again later.');
      setAnswerLoading(false);
    }, 20000);
    setTimeoutId(tId);
    try {
      const res = await getAITip({ question: query, language });
      clearTimeout(tId);
      setTimeoutId(null);
      setAnswer(res.data.answer);
    } catch (err) {
      clearTimeout(tId);
      setTimeoutId(null);
      setAnswer('Sorry, the AI could not answer your question at this time.');
    } finally {
      setAnswerLoading(false);
    }
  };

  return (
    <div className="bg-offwhite rounded-2xl shadow-card p-8 border border-hemlock text-olive">
      <h2 className="text-2xl font-heading font-bold text-olive mb-3 flex items-center gap-2">
        <span role="img" aria-label="tips">🌱</span> Organic Farming Tips
      </h2>
      {loading && <div className="text-leaf font-heading">Loading...</div>}
      {error && <div className="text-red-500 bg-offwhite rounded p-2 border border-red-600 animate-pulse">{error}</div>}
      <ul className="mb-6">
        {tips.map((tip, i) => (
          <li key={i} className={`${i % 2 === 0 ? 'feature-gold' : 'feature-green'} rounded-xl p-4 mb-3 shadow-card text-black`}>
            <b className="text-leaf">{tip.category} ({tip.stage}):</b> {tip.tip}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAsk} className="flex flex-col sm:flex-row gap-2 items-stretch mb-2">
        <div className="flex gap-2 items-center mb-2 sm:mb-0">
          <label htmlFor="tips-language" className="font-medium text-leaf">Language:</label>
          <select
            id="tips-language"
            className="border border-hemlock bg-offwhite text-black rounded-lg p-1 focus:ring-2 focus:ring-leaf outline-none transition"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
          </select>
        </div>
        <input
          className="border border-hemlock bg-offwhite text-black rounded-lg p-2 flex-1 focus:ring-2 focus:ring-leaf outline-none transition"
          placeholder={`How to improve soil fertility? (${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Kannada'})`}
          value={query}
          onChange={e => setQuery(e.target.value)}
          required
        />
        <button
          className="btn btn-green font-heading rounded-xl shadow-card transition-all duration-200 hover:scale-105 active:scale-100"
          type="submit"
          disabled={answerLoading || !query.trim()}
        >{answerLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Thinking...
          </span>
        ) : 'Ask'}</button>
      </form>
      {answerLoading && (
        <div className="mt-3 p-4 bg-softgreen border border-hemlock rounded-xl animate-pulse text-center text-leaf font-semibold">
          <span role="img" aria-label="ai">🤖</span> The AI is thinking and preparing a precise answer...
        </div>
      )}
      {answer && !answerLoading && (
        <div className="mt-4 p-4 bg-gold border-l-8 border-hemlock border rounded-xl shadow-card text-black text-lg font-medium animate-fade-in relative">
          <span className="block mb-2 text-leaf font-bold text-xl flex items-center gap-2">
            <span role="img" aria-label="ai">🤖</span> AI Answer
          </span>
          <button
            className="absolute top-4 right-4 bg-gold/20 hover:bg-gold text-black px-3 py-1 rounded shadow text-sm font-semibold transition"
            onClick={() => navigator.clipboard.writeText(answer)}
            title="Copy answer"
          >Copy</button>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            {answer.split(/\n|\r/).filter(line => line.trim()).map((line, idx) => (
              <li key={idx} className="leading-relaxed text-base">{line.replace(/^[-•*]\s*/, '')}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default TipsSection;
