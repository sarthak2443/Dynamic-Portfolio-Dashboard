import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2"; // unofficial package

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "INFY.NS";

  try {
    const result = await yahooFinance.quote(symbol);
    return NextResponse.json({ cmp: result.regularMarketPrice });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CMP" }, { status: 500 });
  }
}
