"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, SendHorizonal } from "lucide-react";

export default function ChatWidget() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setReply("");

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Ты — финансовый ассистент SaveUp. Отвечай кратко, по делу, без нумерации. 
                    Пользователь спрашивает: ${message}`,
        }),
      });

      const data = await res.json();
      const clean = data.reply?.replace(/\\n+/g, "\n").trim();
      setReply(clean || "Нет ответа от модели");
    } catch (err) {
      console.error(err);
      setReply("Ошибка подключения к серверу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="space-y-3 p-4 border rounded-xl bg-card/80 backdrop-blur-sm shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите вопрос о финансах..."
        className="w-full h-24 bg-muted resize-none text-sm"
      />

      <div className="flex justify-end items-center gap-2">
        <Button
          onClick={sendMessage}
          disabled={loading}
          size="sm"
          className="flex items-center gap-2"
        >
          {loading ? "💭 Думает..." : <><SendHorizonal size={16} /> Отправить</>}
        </Button>
      </div>

      {/* 🔄 Анимированная полоса загрузки */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-1 bg-primary"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.1,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💬 Ответ от модели */}
      <AnimatePresence>
        {reply && !loading && (
          <motion.div
            key="reply"
            className="flex items-start gap-3 p-3 border rounded-lg bg-muted/40 text-sm whitespace-pre-wrap leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Bot className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
            <p>{reply}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
