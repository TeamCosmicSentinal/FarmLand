import React from 'react';
import Chatbot from './Chatbot';

export default function ChatbotPage() {
  return (
    <section className="bg-sky text-olive py-12 px-4 md:px-8 rounded-2xl shadow-card min-h-[60vh]">
      <div className="w-full max-w-3xl mx-auto pt-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-2 mb-4">
          <span role="img" aria-label="chatbot">🤖</span> AgriGuru Chatbot
        </h2>
        <div className="divider" />
        <Chatbot />
      </div>
    </section>
  );
}
