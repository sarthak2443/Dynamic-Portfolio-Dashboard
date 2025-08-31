import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "INFY:NSE";

  try {
    const url = `https://www.google.com/finance/quote/${symbol}`;
    console.log(`Fetching Google Finance: ${url}`);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    let extractedPE = "";
    let extractedEPS = "";

    // Go through each metric container
    $("div.gyFHrc").each((i, el) => {
      const label = $(el).find(".mfs7Fc").text().trim();
      const value = $(el).find(".P6K39c").text().trim();

      if (label.includes("P/E")) {
        extractedPE = value;
      }
      if (label.includes("EPS")) {
        extractedEPS = value;
      }
    });

    return NextResponse.json({
      symbol,
      url,
      extractedPE,
      extractedEPS,
      title: $("title").text(),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Scraping error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch data", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Failed to fetch data", details: String(error) },
        { status: 500 }
      );
    }
  }
}
