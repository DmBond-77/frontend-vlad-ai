"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

// 💡 Расширенный список советов
const tips = [
  "💡 Откладывайте хотя бы 10% дохода на сбережения.",
  "💳 Сначала заплатите себе — отложите часть зарплаты до расходов.",
  "📊 Следите за подписками — часто они тратят больше, чем вы думаете.",
  "🏦 Храните резервный фонд в размере 3–6 месяцев расходов.",
  "📈 Инвестируйте регулярно, даже маленькие суммы со временем растут.",
  "🧾 Проверяйте выписки — мелкие списания часто накапливаются в большие суммы.",
  "💰 Используйте депозит, чтобы деньги приносили доход.",
  "🛍️ Планируйте покупки заранее — это снижает импульсивные траты.",
  "📉 Избегайте долгов по кредиткам, если не можете погасить вовремя.",
  "🧠 Учитесь финансовой грамотности — это лучшая инвестиция.",
  "🚗 Не тратьте больше 15% дохода на транспорт.",
  "🏠 На жильё желательно тратить не более 30% от общего бюджета.",
  "📅 Используйте правило 24 часов перед крупной покупкой — остыньте и подумайте.",
  "🎯 Ставьте конкретные цели: 'накопить 500 000 ₸ за 6 месяцев' звучит реалистичнее, чем 'больше копить'.",
  "🤖 Используйте AI-инструменты (вроде SaveUp), чтобы анализировать свои расходы и находить точки оптимизации.",
];

export default function TipWidget() {
  const [index, setIndex] = useState(0);

  // 🔄 Меняем совет каждые 7 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tips.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-[90px] flex items-center justify-center px-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3 text-base sm:text-xl  text-muted-foreground"
        >
          {/* 💡 Анимация свечения лампочки */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [1, 0.9, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lightbulb className="text-primary h-8 w-8 md:h-10 md:w-10" />
          </motion.div>

          <span className="font-medium leading-snug">{tips[index]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
