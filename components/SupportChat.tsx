
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const FAQS = [
  { q: "How to calculate Goodwill using Average Profit?", a: "Goodwill = Average Profit × Number of years' purchase. Average Profit is the total profit of given years divided by the number of years." },
  { q: "What is the difference between Capital and Revenue Expenditure?", a: "Capital expenditure provides long-term benefits (e.g., buying machinery), while Revenue expenditure is for daily operations (e.g., salary, rent) and its benefit is exhausted within a year." },
  { q: "What are the rules in the absence of a Partnership Deed?", a: "1. Profits shared equally. 2. No Interest on Capital. 3. No Interest on Drawings. 4. No Salary/Commission. 5. Interest on Loan @ 6% p.a." },
  { q: "What is a Realisation Account?", a: "A nominal account prepared at the time of dissolution to find the profit or loss on the sale of assets and payment of liabilities." },
  { q: "What is the Sacrificing Ratio?", a: "Sacrificing Ratio = Old Ratio - New Ratio. It is used to distribute the premium for goodwill brought by a new partner." },
  { q: "How to treat Workmen Compensation Reserve?", a: "If no claim exists, distribute it among old partners in their old ratio. If a claim exists, transfer the claim amount to Realisation/Provision and distribute the excess." },
  { q: "What is Pro-rata Allotment?", a: "It is the allotment of shares in proportion to the shares applied for when there is over-subscription. Excess application money is usually adjusted towards allotment." },
  { q: "How to handle Forfeiture of Shares issued at Premium?", a: "If premium is received, ignore it. If premium is not received, debit 'Securities Premium A/c' at the time of forfeiture." },
];

const SupportChat: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { 
      type: 'bot', 
      text: "First Hello! I am your AI Elite Accountancy Coach, Founded by Mr Piyush Pandey. I am here to help you master every formula and concept for your 15-day challenge. Ask me anything—from journal entries to complex ratio analysis! And you can ask me anything Positive" 
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: `You are the "Elite Accountancy Coach", a world-class AI tutor integrated into a high-performance 15-day exam bootcamp created by Piyush Pandey.
          
          CORE RESPONSIBILITIES:
          1. FORMULAS: Provide absolute mathematical precision for all accountancy formulas (Ratios, Goodwill, Depreciation, etc.).
          2. CONCEPTS: Explain accounting standards (AS) and concepts with clinical clarity.
          3. STRUCTURE: Use Markdown for beautiful formatting. Use bold text for key terms and bullet points for steps.
          4. TONE: Professional, encouraging, and highly disciplined. 
          5. CONTEXT: This is a 15-day intensive bootcamp. Today's date is ${new Date().toLocaleDateString('en-IN')}. Focus primarily on Indian Accounting Standards (Ind AS) and the CBSE/ISC/ICAI syllabus for partnership, companies, and financial statement analysis.
          6. BRANDING: Remind the user occasionally that academic excellence is the only goal of this Piyush Pandey-designed protocol.`,
        },
      });

      const aiText = response.text || "I apologize, but I couldn't process that query. Please try again.";
      setMessages(prev => [...prev, { type: 'bot', text: aiText }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { type: 'bot', text: "Connection error with Gemini API. Please ensure your protocol is active and try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAskFAQ = (faq: typeof FAQS[0]) => {
    handleSendMessage(faq.q);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col animate-pop ${isDark ? 'bg-black text-white' : 'bg-[#f5f5f7] text-black'}`}>
      <div className="h-20 border-b border-black/5 dark:border-white/10 flex items-center justify-between px-8 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">A</div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Elite AI Coach</h2>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Protocol Active • Google Gemini 3.0</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onBack}
          className={`px-6 h-10 rounded-full font-bold text-xs uppercase tracking-widest border transition-all hover-pop ${isDark ? 'border-white/10 hover:bg-white hover:text-black' : 'border-black/5 hover:bg-black hover:text-white'}`}
        >
          Exit Coaching
        </button>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8 space-y-6 hide-scrollbar pb-40">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade`}>
              <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                m.type === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : isDark ? 'bg-zinc-900 text-zinc-100 rounded-tl-none border border-white/5' : 'bg-white text-zinc-800 rounded-tl-none'
              }`}>
                {m.text.split('\n').map((line, idx) => {
                  const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim());
                  return (
                    <p key={idx} className={`${isBullet ? 'ml-4 mb-1' : 'mb-2'} ${line.trim() === '' ? 'h-2' : ''}`}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade">
              <div className={`p-6 rounded-[2rem] rounded-tl-none border border-white/5 ${isDark ? 'bg-zinc-900' : 'bg-white shadow-sm'}`}>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Quick Suggestions */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 backdrop-blur-xl border-t ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-black/5'}`}>
          <div className="mb-4 flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
            {FAQS.slice(0, 5).map((faq, i) => (
              <button 
                key={i} 
                onClick={() => handleAskFAQ(faq)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold transition-all hover-pop border ${
                  isDark ? 'bg-zinc-900 border-white/5 hover:border-blue-500 text-zinc-400' : 'bg-zinc-100 border-black/5 hover:border-blue-500/30 text-zinc-500'
                }`}
              >
                {faq.q}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="relative flex items-center"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for formulas, concepts, or exam tips..."
              className={`w-full py-4 pl-6 pr-16 rounded-full border transition-all font-semibold text-sm outline-none ${
                isDark ? 'bg-zinc-950 border-white/10 text-white focus:border-blue-500/50' : 'bg-zinc-50 border-black/5 text-black focus:border-blue-500/30'
              }`}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                input.trim() && !isTyping ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="mt-3 text-[9px] text-center font-bold uppercase tracking-[0.3em] opacity-30">Elite Cognitive Support Engine Active</p>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
