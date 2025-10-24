"use client";

import useSWR from "swr";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Ошибка при загрузке валют");
  const data = await res.json();
  console.log("📊 Exchange API:", data);
  return data;
};

export default function CurrencyWidget() {
  const { data, error, isLoading } = useSWR(
    "https://open.er-api.com/v6/latest/USD",
    fetcher,
    { refreshInterval: 1000 * 60 * 5 }
  );

  if (error)
    return <p className="text-destructive text-sm">Ошибка загрузки курсов 😢</p>;

  if (isLoading || !data)
    return <p className="text-muted-foreground text-sm">Загрузка...</p>;

  const rates = data?.rates;
  if (!rates || !rates.KZT)
    return <p className="text-muted-foreground text-sm">Нет данных с API</p>;

  // 🔹 Конвертация в тенге
  const usdToKzt = rates.KZT.toFixed(2);
  const eurToKzt = (rates.KZT / rates.EUR).toFixed(2);
  const rubToKzt = (rates.KZT / rates.RUB).toFixed(2);
  const cnyToKzt = (rates.KZT / rates.CNY).toFixed(2);

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <ul className="space-y-2 text-md">
        <li>💵 1 USD = <b>{usdToKzt}</b> ₸</li>
        <li>💶 1 EUR = <b>{eurToKzt}</b> ₸</li>
        <li>💷 1 RUB = <b>{rubToKzt}</b> ₸</li>
        <li>💹 1 CNY = <b>{cnyToKzt}</b> ₸</li>
      </ul>
      <p className="text-xs text-muted-foreground mt-2">
        Обновлено:{" "}
        {new Date(data.time_last_update_utc).toLocaleString("ru-RU")}
      </p>
    </motion.div>
  );
}
