"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  MessageSquare,
  Calculator,
  DollarSign,
  Moon,
  Sun,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UploadWidget from "@/components/widgets/UploadWidget";
import CurrencyWidget from "@/components/widgets/CurrencyWidget";
import TipWidget from "@/components/widgets/TipWidget";
import FinanceCalculators from "@/components/widgets/FinanceCalculators";

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.3, ease: "easeOut" },
    }),
    hover: {
      scale: 1, // без движения
      boxShadow:
        "0 0 20px rgba(16,185,129,0.4), 0 0 10px rgba(16,185,129,0.2) inset", // 💚 внешний + внутренний glow
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  const cards = [
    {
      title: (
        <div className="flex items-center gap-3">
          <MessageSquare className="w-7 h-7 text-primary" />
          <span className="text-2xl font-semibold">AI-чат ассистент</span>
        </div>
      ),
      content: (
        <>
          <p className="text-base text-muted-foreground mb-3">
            Задай свой вопрос SaveUp — например:{" "}
            <em>"Как улучшить мои сбережения?"</em>
          </p>
          <textarea
            className="w-full h-24 p-2 border rounded-md bg-muted resize-none"
            placeholder="Введите вопрос..."
          />
          <div className="flex justify-end mt-3">
            <Button size="sm">Отправить</Button>
          </div>
        </>
      ),
      span: "md:col-span-2",
    },
    {
      title: (
        <div className="flex items-center gap-3">
          <DollarSign className="w-7 h-7 text-primary" />
          <span className="text-2xl font-semibold">Курсы валют</span>
        </div>
      ),
      content: <CurrencyWidget />,
      span: "md:col-span-1",
    },
    {
      title: (
        <div className="flex items-center gap-3">
          <Upload className="w-7 h-7 text-primary" />
          <span className="text-2xl font-semibold">
            Анализ расходов (PDF / Excel)
          </span>
        </div>
      ),
      content: <UploadWidget />,
      span: "col-span-1 md:col-span-3",
    },
    {
      title: (
        <div className="flex items-center gap-3">
          <Calculator className="w-7 h-7 text-primary" />
          <span className="text-2xl font-semibold">Финансовые калькуляторы</span>
        </div>
      ),
      content: <FinanceCalculators />,
      // ✅ На маленьких экранах — вся ширина, на больших — 1 колонка
      span: "col-span-3 xl:col-span-2",
    },
    {
      title: (
        <div className="flex items-center gap-3 ">
          <Brain className="w-7 h-7 text-primary" />
          <span className="text-2xl font-semibold">Совет от AI</span>
        </div>
      ),
      content: <TipWidget />,
      span: "col-span-3 xl:col-span-1",
    },
  ];

  return (
    <motion.div
      className={cn(
        "min-h-screen p-4 md:p-6 transition-colors duration-300",
        darkMode ? "dark bg-background text-foreground" : "bg-background"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.header
        className="flex items-center justify-between mb-4 md:mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="SaveUp Logo"
            width={40}
            height={40}
            priority
          />
          <h1 className="text-3xl font-bold tracking-tight">SaveUp Dashboard</h1>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </motion.header>

      {/* ✅ Сетка карточек */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={i}
            className={cn(
              "rounded-xl border border-border bg-card/90 backdrop-blur-sm transition duration-300",
              card?.span || ""
            )}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{card?.title}</CardTitle>
              </CardHeader>
              <CardContent>{card?.content}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
