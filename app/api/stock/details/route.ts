import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "INFY:NSE";

  try {
    const url = `https://www.google.com/finance/quote/${symbol}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    const peRatio = $('div[data-testid="PE_RATIO-value"]').text().trim();
    const earnings = $('div[data-testid="EPS_RATIO-value"]').text().trim();

    return NextResponse.json({
      symbol,
      peRatio: peRatio || "N/A",
      earnings: earnings || "N/A",
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock details" },
      { status: 500 }
    );
  }
}
