import { NextResponse } from "next/server";

let cache: { ts: number; data: any } | null = null;

export async function GET() {
  const now = Date.now();
  // кэшируем 10 минут
  if (cache && now - cache.ts < 10 * 60 * 1000) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=USD&symbols=KZT,EUR,RUB,CNY",
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      throw new Error(`Exchange API error: ${res.status}`);
    }

    const data = await res.json();

    // структура примерно: { base: "USD", rates: { KZT: 480.5, EUR: 0.93, ... } }
    cache = { ts: now, data };
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error fetching rates:", err);
    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}
