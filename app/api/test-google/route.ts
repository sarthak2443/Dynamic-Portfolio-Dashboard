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
    const allDivs = $('div').map((i, el) => $(el).text()).get();
    const financialData = allDivs.filter(text =>
      text.includes('P/E') ||
      text.includes('EPS') ||
      text.includes('Earnings') ||
      text.includes('ratio') ||
      text.toLowerCase().includes('pe ')
    );

    // Try to extract actual P/E ratio values
    let extractedPE = "";
    let extractedEPS = "";

    // Method 1: Look for P/E ratio patterns in the filtered data
    financialData.forEach(text => {
      // Look for patterns like "P/E ratio 22.37" or "P/E 22.37"
      const peMatch = text.match(/P\/E\s*(?:ratio)?\s*(\d+\.?\d*)/i);
      if (peMatch && !extractedPE) {
        extractedPE = peMatch[1];
      }

      // Look for EPS patterns
      const epsMatch = text.match(/(?:EPS|Earnings per share)\s*(\d+\.?\d*)/i);
      if (epsMatch && !extractedEPS) {
        extractedEPS = epsMatch[1];
      }
    });

    // Method 2: Try to find numeric values next to P/E text
    if (!extractedPE) {
      $('div').each((i, elem) => {
        const $elem = $(elem);
        const text = $elem.text().trim();

        if (text.includes('P/E ratio') && !text.includes('EPS')) {
          // Look for a number in the same element or nearby elements
          const numberMatch = text.match(/(\d+\.?\d+)/);
          if (numberMatch && !extractedPE) {
            extractedPE = numberMatch[1];
          }

          // Also check sibling elements
          const siblings = $elem.siblings();
          siblings.each((j, sibling) => {
            const siblingText = $(sibling).text().trim();
            const siblingNumber = siblingText.match(/^(\d+\.?\d+)$/);
            if (siblingNumber && !extractedPE) {
              extractedPE = siblingNumber[1];
            }
          });
        }
      });
    }

    return NextResponse.json({
      symbol,
      url,
      financialData,
      extractedPE,
      extractedEPS,
      htmlLength: data.length,
      title: $('title').text(),
      totalDivs: allDivs.length,
      financialDataCount: financialData.length,
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
