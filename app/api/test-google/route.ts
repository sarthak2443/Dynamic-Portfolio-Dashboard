import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "INFY:NSE";

  try {
    const url = `https://www.google.com/finance/quote/${symbol}`;
    console.log(`Testing Google Finance: ${url}`);
    
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    // Get all text content to see what's available
    const allDivs = $("div")
      .map((i, el) => $(el).text())
      .get();

    const financialData = allDivs.filter(
      (text) =>
        text.includes("P/E") ||
        text.includes("EPS") ||
        text.includes("Earnings") ||
        text.includes("ratio") ||
        text.toLowerCase().includes("pe ")
    );

    return NextResponse.json({
      symbol,
      url,
      financialData,
      htmlLength: data.length,
      title: $("title").text(),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Test error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch test data", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Failed to fetch test data", details: String(error) },
        { status: 500 }
      );
    }
  }
}
