import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol || typeof symbol !== "string") {
      return NextResponse.json({ error: "Stock symbol is required" }, { status: 400 });
    }

    // Fetch stock data from Yahoo Finance
    const quote: any = await yahooFinance.quote(symbol);

    return NextResponse.json({
      cmp: quote.regularMarketPrice || 0,
      peRatio: quote.trailingPE || "-",
      earnings: quote.epsTrailingTwelveMonths || "-",
      marketCap: quote.marketCap || "-",
      volume: quote.regularMarketVolume || "-",
    });
  } catch (err: any) {
    console.error("Yahoo Finance fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
