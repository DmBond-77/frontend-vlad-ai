"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle,
  PiggyBank,
} from "lucide-react";

export default function UploadWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setReply(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-expenses", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Ошибка анализа");
      }

      const data = await res.json();
      setReply(formatResponse(data.reply));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🧹 Форматируем ответ в список
  function formatResponse(text: string): string[] {
    if (!text) return [];
    const cleaned = text
      .replaceAll("\\n", "\n")
      .replaceAll("\\u003e", ">")
      .replaceAll("\\", "")
      .replace(/руб(?!\w)/g, "₸")
      .replace(/рублей/g, "₸")
      .replace(/руб\./g, "₸")
      .trim();

    const parts = cleaned.split(/\d+\.\s/).filter(Boolean);
    return parts;
  }

  // 🎬 Анимации для пунктов
  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25, // поочередное появление
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <CardContent>
      <p className="text-sm text-muted-foreground mb-3">
        Загрузите банковскую выписку (.pdf, .xlsx или .csv), и AI проанализирует ваши расходы.
      </p>

      <input
        type="file"
        accept=".pdf,.xlsx,.csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0 file:text-sm file:font-semibold
                   file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
      />

      <div className="flex justify-end mt-3">
        <Button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Анализируем...
            </>
          ) : (
            "Анализировать"
          )}
        </Button>
      </div>

      {/* Прогресс */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-md"
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

      {/* Ответ AI */}
      <AnimatePresence>
        {reply && (
          <motion.div
            key="reply"
            className="mt-5 p-5 rounded-xl border bg-muted text-sm leading-relaxed space-y-3"
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="font-semibold flex items-center gap-2 mb-2 text-lg">
              💡 Рекомендации AI
            </h3>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {reply.map((item, i) => {
                const Icon =
                  i === 0
                    ? AlertTriangle
                    : i === 1
                      ? CheckCircle
                      : PiggyBank;

                return (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-3"
                  >
                    <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{item.trim()}</p>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ошибка */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            className="text-red-500 mt-3 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ❌ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </CardContent>
  );
}
