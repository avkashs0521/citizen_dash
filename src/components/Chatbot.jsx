import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { queryHF, HttpError, TimeoutError } from '../api/huggingFace';

export default function Chatbot({ dashboardData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your SmartCity assistant. Ask me anything about the live data on your dashboard.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(prev => !prev);

  const buildContext = () => {
    const { weatherData, rates, citizen, factData } = dashboardData;
    
    // Safely structure data just in case some APIs haven't resolved yet
    const temp = weatherData?.temperature ?? 'Unknown';
    const wind = weatherData?.windspeed ?? 'Unknown';
    
    const usd = rates?.USD ?? 'Unknown';
    const eur = rates?.EUR ?? 'Unknown';
    const gbp = rates?.GBP ?? 'Unknown';
    
    const cName = citizen?.name ?? 'Unknown';
    const cCity = citizen?.city ?? 'Unknown';
    const cEmail = citizen?.email ?? 'Unknown';
    
    const factText = factData?.text ?? 'Unknown';

    return `
  You are a helpful SmartCity assistant. 
  Answer only based on the following live data from the dashboard:

  WEATHER: Temperature is ${temp}°C, 
           Wind speed is ${wind} km/h

  CURRENCY: 1 INR = ${usd} USD, 
            1 INR = ${eur} EUR, 
            1 INR = ${gbp} GBP

  CITIZEN ON SCREEN: ${cName}, 
                     from ${cCity}, 
                     email: ${cEmail}

  CITY FACT: ${factText}

  If the user asks something not related to this data, 
  politely say you only know about the dashboard data.
`;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userQuestion = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to UI immediately
    const userMsgObj = { role: 'user', content: userQuestion };
    setMessages(prev => [...prev, userMsgObj]);
    setIsLoading(true);

    try {
      const liveContext = buildContext();
      const apiMessages = [
        { role: 'system', content: liveContext },
        { role: 'user', content: userQuestion }
      ];

      const payload = {
        messages: apiMessages,
        model: "meta-llama/Llama-3.2-1B-Instruct:novita"
      };

      const response = await queryHF(payload);
      
      let assistantReply = "Sorry, I couldn't reach the smart city systems right now.";
      if (response && response.choices && response.choices.length > 0) {
        assistantReply = response.choices[0].message.content;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantReply }]);
    } catch (error) {
      console.error(error);
      let assistantError = "An error occurred while fetching my response. Please try again later. Verify the HF_TOKEN environment variable.";
      if (error instanceof TimeoutError) {
        assistantError = "Request timed out while contacting the smart city assistant. Please try again.";
      } else if (error instanceof HttpError) {
        assistantError = `Assistant service returned error HTTP ${error.status}. Please try again later.`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: assistantError }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="chatbot-trigger" onClick={toggleChat} title="Open SmartCity Assistant">
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
            <MessageSquare size={18} color="#8b5cf6" />
            SmartCity Assistant
          </div>
          <button onClick={toggleChat} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-container" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chatbot-input" 
            placeholder="Ask me about the live data..." 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="chatbot-send" disabled={isLoading || !inputMessage.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
