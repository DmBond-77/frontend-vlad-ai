"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  MessageSquare,
  Calculator,
  DollarSign,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UploadWidget from "@/components/widgets/UploadWidget";
import CurrencyWidget from "@/components/widgets/CurrencyWidget";
import Image from "next/image";


export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Быстрая, но плавная анимация карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08, // чуть быстрее
        duration: 0.3, // вместо 0.5
        ease: [0.4, 0.0, 0.2, 1],
      },
    }),
    hover: {
      scale: 1.008,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      transition: { duration: 0.15, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={cn(
        "min-h-screen p-6 transition-colors duration-300",
        darkMode
          ? "dark bg-background text-foreground"
          : "bg-background text-foreground"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.header
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-2" >
          <Image
            src="/logo.png" // путь к файлу (например, /public/logo.png)
            alt="SaveUp Logo"
            width={48}
            height={48}
            priority // загружает сразу (для логотипа это нормально)
            // className="h-40 w-40"
          />
        <h1 className="text-2xl font-bold tracking-tight">
          SaveUp Dashboard
        </h1>
        </div>

        <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </motion.div>
      </motion.header>

      {/* Dashboard Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: (
              <>
                <MessageSquare className="w-5 h-5 text-primary" />
                AI-чат ассистент
              </>
            ),
            content: (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Задай свой вопрос SaveUp — например:{" "}
                  <em>"Как улучшить мои сбережения?"</em>
                </p>
                <textarea
                  className="w-full h-24 p-2 border rounded-md bg-muted resize-none"
                  placeholder="Введите вопрос..."
                />
                <div className="flex justify-end mt-3">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button>Отправить</Button>
                  </motion.div>
                </div>
              </>
            ),
            span: "col-span-2",
          },
          {
            title: (
              <>
                <DollarSign className="w-5 h-5 text-primary" />
                Курсы валют
              </>
            ),
            content: <CurrencyWidget />,
            span: "",
          },

          ,
          {
            title: (
              <>
                <Upload className="w-5 h-5 text-primary" />
                Анализ расходов (PDF / Excel)
              </>
            ),
            content: <UploadWidget />,
            span: "col-span-3",
          },
          {
            title: (
              <>
                <Calculator className="w-5 h-5 text-primary" />
                Кредитный калькулятор
              </>
            ),
            content: (
              <form className="space-y-2 text-sm">
                <input
                  type="number"
                  placeholder="Сумма кредита"
                  className="w-full p-2 border rounded-md bg-muted"
                />
                <input
                  type="number"
                  placeholder="Срок (мес.)"
                  className="w-full p-2 border rounded-md bg-muted"
                />
                <input
                  type="number"
                  placeholder="Процентная ставка (%)"
                  className="w-full p-2 border rounded-md bg-muted"
                />
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="w-full mt-2">Рассчитать</Button>
                </motion.div>
              </form>
            ),
            span: "col-span-3 md:col-span-1",
          },
          {
            title: "Совет от AI",
            content: (
              <p className="text-md sm:text-xl text-muted-foreground">
                💡 Сегодняшний совет: попробуйте отложить 10% от зарплаты в
                депозит — даже небольшие суммы со временем превращаются в капитал.
              </p>
            ),
            span: "col-span-3 md:col-span-2",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={i}
            className={cn(
              "rounded-xl shadow-md transition-transform duration-200",
              card.span
            )}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>{card.content}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
