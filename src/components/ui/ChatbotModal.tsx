"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ChatbotModal.module.css";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const QUICK_REPLIES = [
  "How long is the battery?",
  "Is it waterproof?",
  "What sizes are available?",
  "Shipping info?",
];

export function ChatbotModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm the Merch Shop AI. I can help you with product info, specs, and orders. What would you like to know? 😊",
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<{ role: string; text: string }[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const msgText = text ?? inputValue;
    if (!msgText.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), text: msgText, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    historyRef.current = [
      ...historyRef.current,
      { role: "user", text: msgText },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgText,
          history: historyRef.current.slice(-8),
        }),
      });

      const data = await res.json();
      const reply = data.reply ?? "I'm not sure about that. Try asking something else!";

      historyRef.current = [...historyRef.current, { role: "bot", text: reply }];

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: reply, isBot: true },
      ]);

      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: "Sorry, I'm having trouble connecting right now. Please try again!", isBot: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.botAvatar}>
                  <Bot size={18} />
                  <span className={styles.onlineDot} />
                </div>
                <div>
                  <div className={styles.botName}>Merch Shop AI</div>
                  <div className={styles.botStatus}>
                    {isTyping ? (
                      <span className={styles.typingStatus}>Typing...</span>
                    ) : (
                      <span>Online · Powered by Gemini</span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className={styles.closeBtn} aria-label="Close chat">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`${styles.messageRow} ${msg.isBot ? styles.botRow : styles.userRow}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {msg.isBot && (
                    <div className={styles.avatarSmall}>
                      <Bot size={14} />
                    </div>
                  )}
                  <div className={`${styles.bubble} ${msg.isBot ? styles.botBubble : styles.userBubble}`}>
                    {msg.text}
                  </div>
                  {!msg.isBot && (
                    <div className={`${styles.avatarSmall} ${styles.userAvatar}`}>
                      <User size={14} />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    className={`${styles.messageRow} ${styles.botRow}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.avatarSmall}><Bot size={14} /></div>
                    <div className={`${styles.bubble} ${styles.botBubble} ${styles.typingBubble}`}>
                      <span className={styles.dot} />
                      <span className={styles.dot} />
                      <span className={styles.dot} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 2 && (
              <div className={styles.quickReplies}>
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    className={styles.quickBtn}
                    onClick={() => handleSend(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className={styles.inputArea}>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isTyping}
                id="chatbot-input"
              />
              <button
                className={styles.sendBtn}
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle FAB */}
      <motion.button
        className={`${styles.toggleBtn} ${isOpen ? styles.toggleOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        id="chatbot-toggle-btn"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={24} />
            </motion.span>
          )}
        </AnimatePresence>
        {!isOpen && hasUnread && <span className={styles.unreadDot} />}
      </motion.button>
    </div>
  );
}
