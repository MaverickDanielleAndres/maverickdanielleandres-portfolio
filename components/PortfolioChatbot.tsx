"use client"

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';

// Type definitions
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  apiEndpoint?: string;
}

// Personal data for the chatbot (inject this into your system prompt)
const PERSONAL_DATA = {
  name: "Maverick Danielle Andres",
  role: "Full-Stack Web Developer & IT Specialist",
  availability: "Available for freelance and full-time opportunities",
  contact: {
    email: "maverickdanielle@gmail.com",
    linkedin: "https://www.linkedin.com/in/maverick-danielle-andres/",
    github: "https://github.com/MaverickDanielleAndres",
    facebook: "https://www.facebook.com/maverickdanielle.andres/",
    instagram: "https://www.instagram.com/maverickdanielle.andres/"
  },
  education: {
    institution: "Pamantasan ng Lungsod ng Pasig",
    degree: "Bachelor's in Information Technology",
    period: "2022 - 2026",
    gwa: "1.50",
    achievements: "Consistent Dean's Lister (1st Year to 4th Year), President's Lister"
  },
  skills: {
    frontend: ["React", "Next.js", "HTML", "CSS", "JavaScript", "Tailwind CSS", "Bootstrap"],
    backend: ["PHP", "Node.js", "Express.js", "Python"],
    databases: ["MySQL", "PostgreSQL", "Supabase"],
    design: ["Figma", "UI/UX Design", "Prototyping"],
    tools: ["Git", "GitHub", "VS Code", "Postman"],
    networking: ["LAN/WAN setup", "Cisco configuration", "Cybersecurity", "Troubleshooting"],
    other: ["IT Support", "System Administration", "Deployment (Vercel, IONOS)"]
  },
  projects: [
    {
      name: "Learning Management System with AI-Generated Reviewer",
      description: "Full LMS for 1,000+ students with AI-powered summarization, auto-generated exam reviewers, and predictive analytics",
      tech: ["PHP", "HTML", "CSS", "Bootstrap", "JavaScript", "MySQL"],
      date: "2025-11-20"
    },
    {
      name: "E-Community Engagement Platform",
      description: "Modern platform with voting, surveys, real-time messaging, and AI sentiment analysis",
      tech: ["Next.js", "React", "Tailwind CSS", "Node.js", "Express", "Supabase", "PostgreSQL"],
      date: "2025-11-05"
    },
    {
      name: "Barangay Health System",
      description: "Complete barangay-level health record management system",
      tech: ["PHP", "HTML", "CSS", "Bootstrap", "JavaScript", "MySQL"],
      date: "2024-05-18"
    }
  ],
  attributes: [
    "Detail-oriented",
    "Team-oriented",
    "Problem-solver",
    "Quick learner",
    "Adaptable",
    "Reliable",
    "Innovative"
  ]
};

// Rate limiting utility
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getRemainingTime(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    const timePassed = Date.now() - oldestRequest;
    return Math.max(0, this.windowMs - timePassed);
  }
}

// Chat Message Component
const ChatMessage = memo<{ message: Message }>(({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4 animate-fadeIn`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-neutral-700'
      }`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-4 py-2 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : 'bg-neutral-800 text-neutral-100 rounded-tl-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <p className="text-xs text-neutral-500 mt-1 px-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

// Main Chatbot Component
const PortfolioChatbot: React.FC<ChatbotProps> = ({ apiEndpoint = '/api/chat' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rateLimiter = useRef(new RateLimiter(10, 60000));
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi! I'm Maverick's AI assistant. I can answer questions about his skills, projects, education, and experience. What would you like to know?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Rate limiting check
    if (!rateLimiter.current.canMakeRequest()) {
      const remainingTime = Math.ceil(rateLimiter.current.getRemainingTime() / 1000);
      setError(`Too many requests. Please wait ${remainingTime} seconds.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedInput,
          history: messages.slice(-10) // Send last 10 messages for context
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      
      console.error('Chat error:', err);
      setError('Sorry, something went wrong. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [inputValue, isLoading, messages, apiEndpoint]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Close chat and abort any pending requests
  const handleClose = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-[10000] w-[90vw] sm:w-[380px] h-[70vh] sm:h-[600px] max-h-[calc(100vh-8rem)] bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-700 flex flex-col animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-700 bg-neutral-800 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                  <img 
                    src="/profilepic.png" 
                    alt="Maverick Andres"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-neutral-800 rounded-full" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Maverick's Assistant</h3>
                <p className="text-neutral-400 text-xs">Online</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-neutral-400 hover:text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block px-4 py-2 rounded-2xl bg-neutral-800 rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-red-900/20 border-t border-red-900/50">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-neutral-700 bg-neutral-800 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Maverick..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-full border border-neutral-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              AI assistant • Answers about Maverick's portfolio
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #262626;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #525252;
        }

        @media (max-width: 640px) {
          .fixed.bottom-6.right-6 {
            bottom: 5rem;
            right: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default PortfolioChatbot;