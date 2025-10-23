"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    // ✅ Новый стабильный источник
    "https://open.er-api.com/v6/latest/USD",
    fetcher,
    { refreshInterval: 1000 * 60 * 5 }
  );

  if (error)
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <DollarSign className="w-5 h-5" />
            Ошибка загрузки курсов
          </CardTitle>
        </CardHeader>
        <CardContent>Не удалось получить данные 😢</CardContent>
      </Card>
    );

  if (isLoading || !data)
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Курсы валют
          </CardTitle>
        </CardHeader>
        <CardContent>Загрузка...</CardContent>
      </Card>
    );

  const rates = data?.rates;
  if (!rates || !rates.KZT) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Курсы валют
          </CardTitle>
        </CardHeader>
        <CardContent>Нет данных с API</CardContent>
      </Card>
    );
  }

  // 1 USD = X KZT, EUR, RUB, CNY
  const usdToKzt = rates.KZT.toFixed(2);
  const eurToKzt = (rates.KZT / rates.EUR).toFixed(2);
  const rubToKzt = (rates.KZT / rates.RUB).toFixed(2);
  const cnyToKzt = (rates.KZT / rates.CNY).toFixed(2);

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Курсы валют
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>💵 1 USD = <b>{usdToKzt}</b> ₸</li>
            <li>💶 1 EUR = <b>{eurToKzt}</b> ₸</li>
            <li>💷 1 RUB = <b>{rubToKzt}</b> ₸</li>
            <li>💹 1 CNY = <b>{cnyToKzt}</b> ₸</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">
            Обновлено: {new Date(data.time_last_update_utc).toLocaleString("ru-RU")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
