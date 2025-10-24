"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FinanceCalculators() {
  const [activeTab, setActiveTab] = useState("loan");

  const [loan, setLoan] = useState({ amount: "", term: "", rate: "" });
  const [mortgage, setMortgage] = useState({
    amount: "",
    term: "",
    rate: "",
    down: "",
  });
  const [deposit, setDeposit] = useState({ amount: "", term: "", rate: "" });

  const [loanResult, setLoanResult] = useState<any>(null);
  const [mortgageResult, setMortgageResult] = useState<any>(null);
  const [depositResult, setDepositResult] = useState<any>(null);

  const [loanChart, setLoanChart] = useState<any[]>([]);
  const [mortgageChart, setMortgageChart] = useState<any[]>([]);
  const [depositChart, setDepositChart] = useState<any[]>([]);

  // 💵 Кредит
  const calcLoan = () => {
    const P = parseFloat(loan.amount);
    const n = parseFloat(loan.term);
    const r = parseFloat(loan.rate) / 100 / 12;
    if (!P || !n || !r) return;

    const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = payment * n;
    const overpay = total - P;

    const chart = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = payment - interest;
      balance -= principal;
      chart.push({
        month: i,
        "Основной долг": Math.max(balance, 0),
        "Проценты": interest,
        "Платёж": payment,
      });
    }

    setLoanResult({ payment, total, overpay });
    setLoanChart(chart);
    setActiveTab("loan");
  };

  // 🏠 Ипотека
  const calcMortgage = () => {
    const P = parseFloat(mortgage.amount) - parseFloat(mortgage.down || "0");
    const n = parseFloat(mortgage.term);
    const r = parseFloat(mortgage.rate) / 100 / 12;
    if (!P || !n || !r) return;

    const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = payment * n;
    const overpay = total - P;

    const chart = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = payment - interest;
      balance -= principal;
      chart.push({
        month: i,
        "Основной долг": Math.max(balance, 0),
        "Проценты": interest,
        "Платёж": payment,
      });
    }

    setMortgageResult({ payment, total, overpay });
    setMortgageChart(chart);
    setActiveTab("mortgage");
  };

  // 🪙 Депозит
  const calcDeposit = () => {
    const P = parseFloat(deposit.amount);
    const n = parseFloat(deposit.term);
    const r = parseFloat(deposit.rate) / 100 / 12;
    if (!P || !n || !r) return;

    const chart = [];
    let total = P;
    for (let i = 1; i <= n; i++) {
      total *= 1 + r;
      chart.push({
        month: i,
        "Накопления": total,
      });
    }

    const profit = total - P;
    setDepositResult({ total, profit });
    setDepositChart(chart);
    setActiveTab("deposit");
  };

  // 🧮 Функция для получения данных конкретного графика
  const getChartData = () => {
    if (activeTab === "loan") return loanChart;
    if (activeTab === "mortgage") return mortgageChart;
    if (activeTab === "deposit") return depositChart;
    return [];
  };

  return (
    <Card className="bg-card/90 border border-border backdrop-blur-sm">
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="loan" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger className="cursor-pointer" value="loan">
              💵 Кредит
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="mortgage">
              🏠 Ипотека
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="deposit">
              💰 Депозит
            </TabsTrigger>
          </TabsList>

          {/* Заголовок калькулятора */}
          <h2 className="text-xl font-semibold mb-3">
            {activeTab === "loan"
              ? "Кредитный калькулятор"
              : activeTab === "mortgage"
                ? "Ипотечный калькулятор"
                : "Депозитный калькулятор"}
          </h2>

          {/* --- Кредит --- */}
          <TabsContent value="loan">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Сумма кредита (₸)"
                  value={loan.amount}
                  onChange={(e) => setLoan({ ...loan, amount: e.target.value })}
                  className="p-2 border rounded-md bg-muted text-sm"
                />
                <input
                  type="number"
                  placeholder="Срок (мес.)"
                  value={loan.term}
                  onChange={(e) => setLoan({ ...loan, term: e.target.value })}
                  className="p-2 border rounded-md bg-muted text-sm"
                />
                <input
                  type="number"
                  placeholder="Ставка (% годовых)"
                  value={loan.rate}
                  onChange={(e) => setLoan({ ...loan, rate: e.target.value })}
                  className="p-2 border rounded-md bg-muted text-sm"
                />
              </div>
              <Button onClick={calcLoan} className="w-full sm:w-auto mt-3">
                Рассчитать
              </Button>
              {loanResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-sm space-y-1"
                >
                  <p>💵 Ежемесячный платёж: <b>{loanResult.payment.toFixed(2)} ₸</b></p>
                  <p>📅 Общая сумма выплат: <b>{loanResult.total.toFixed(2)} ₸</b></p>
                  <p>⚠️ Переплата: <b>{loanResult.overpay.toFixed(2)} ₸</b></p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          {/* --- Ипотека --- */}
          <TabsContent value="mortgage">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="number"
                  placeholder="Стоимость жилья (₸)"
                  value={mortgage.amount}
                  onChange={(e) =>
                    setMortgage({ ...mortgage, amount: e.target.value })
                  }
                  className="p-2 border rounded-md bg-muted text-sm"
                />
                <input
                  type="number"
                  placeholder="Первоначальный взнос (₸)"
                  value={mortgage.down}
                  onChange={(e) =>
                    setMortgage({ ...mortgage, down: e.target.value })
                  }
                  className="p-2 border rounded-md bg-muted text-sm"
                />
                <input
                  type="number"
                  placeholder="Срок (мес.)"
                  value={mortgage.term}
                  onChange={(e) =>
                    setMortgage({ ...mortgage, term: e.target.value })
                  }
                  className="p-2 border rounded-md bg-muted text-sm"
                />
                <input
                  type="number"
                  placeholder="Ставка (% годовых)"
                  value={mortgage.rate}
                  onChange={(e) =>
                    setMortgage({ ...mortgage, rate: e.target.value })
                  }
                  className="p-2 border rounded-md bg-muted text-sm"
                />
              </div>
              <Button onClick={calcMortgage} className="w-full sm:w-auto mt-3">
                Рассчитать
              </Button>
              {mortgageResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-sm space-y-1"
                >
                  <p>💵 Ежемесячный платёж: <b>{mortgageResult.payment.toFixed(2)} ₸</b></p>
                  <p>📅 Общая сумма выплат: <b>{mortgageResult.total.toFixed(2)} ₸</b></p>
                  <p>⚠️ Переплата: <b>{mortgageResult.overpay.toFixed(2)} ₸</b></p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          {/* --- Депозит --- */}
          <TabsContent value="deposit">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Сумма вклада (₸)"
                  value={deposit.amount}
                  onChange={(e) =>
                    setDeposit({ ...deposit, amount: e.target.value })
                  }
                  className="p-2 border rounded-md bg-muted text-sm"
                />
                <input
                  type="number"
                  placeholder="Срок (мес.)"
                  value={deposit.term}
                  onChange={(e) =>
                    setDeposit({ ...deposit, term: e.target.value })
                  }
                  className="p-2 border rounded-md bg-muted text-sm"
                />
                <input
                  type="number"
                  placeholder="Ставка (% годовых)"
                  value={deposit.rate}
                  onChange={(e) =>
                    setDeposit({ ...deposit, rate: e.target.value })
                  }
                  className="p-2 border rounded-md bg-muted text-sm"
                />
              </div>
              <Button onClick={calcDeposit} className="w-full sm:w-auto mt-3">
                Рассчитать
              </Button>
              {depositResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-sm space-y-1"
                >
                  <p>💰 Итоговая сумма: <b>{depositResult.total.toFixed(2)} ₸</b></p>
                  <p>📈 Доход: <b>{depositResult.profit.toFixed(2)} ₸</b></p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* 📊 График — только для активной вкладки */}
        {getChartData().length > 0 && (
          <motion.div className="mt-6 h-64" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={
                    activeTab === "deposit" ? "Накопления" : "Основной долг"
                  }
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
                {activeTab !== "deposit" && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="Проценты"
                      stroke="#FACC15"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Платёж"
                      stroke="#3B82F6"
                      strokeWidth={1}
                      dot={false}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
