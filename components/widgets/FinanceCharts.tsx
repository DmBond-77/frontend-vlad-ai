"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

type Transaction = {
  date: string;
  category: string;
  amount: number;
};

type FinanceChartsProps = {
  data: Transaction[];
};

export default function FinanceCharts({ data }: FinanceChartsProps) {
  // 💰 Разделяем доходы и расходы
  const income = data.filter((d) => d.amount > 0);
  const expenses = data.filter((d) => d.amount < 0);

  // 📅 Группировка по дате
  const grouped = Object.values(
    data.reduce<Record<string, { date: string; income: number; expense: number }>>(
      (acc, cur) => {
        const date = cur.date;
        if (!acc[date]) {
          acc[date] = { date, income: 0, expense: 0 };
        }
        if (cur.amount > 0) acc[date].income += cur.amount;
        else acc[date].expense += Math.abs(cur.amount);
        return acc;
      },
      {}
    )
  );

  // 🏷️ Категории расходов
  const categories = Object.values(
    data.reduce<Record<string, { name: string; value: number }>>((acc, cur) => {
      const cat = cur.category || "Другое";
      if (!acc[cat]) {
        acc[cat] = { name: cat, value: 0 };
      }
      acc[cat].value += Math.abs(cur.amount);
      return acc;
    }, {})
  );

  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-6 mt-6">
      {/* 1️⃣ Доходы / расходы по дням */}
      <div className="h-64">
        <h3 className="font-semibold mb-2">Движение средств</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={grouped}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              name="Пополнения"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              name="Расходы"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2️⃣ Категории расходов */}
      <div className="h-64">
        <h3 className="font-semibold mb-2">Категории расходов</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {categories.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3️⃣ Сравнение за день */}
      <div className="h-64">
        <h3 className="font-semibold mb-2">Доходы vs Расходы по дням</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={grouped}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Пополнения" />
            <Bar dataKey="expense" fill="#ef4444" name="Расходы" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
