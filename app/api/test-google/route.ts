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
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    });

    const $ = cheerio.load(data);

    let extractedPE = "";
    let extractedEPS = "";

    // Strategy 1: Original selector approach
    $("div.gyFHrc").each((i, el) => {
      const label = $(el).find(".mfs7Fc").text().trim();
      const value = $(el).find(".P6K39c").text().trim();

      if (label.includes("P/E") || label.includes("PE")) {
        extractedPE = value;
      }
      if (label.includes("EPS")) {
        extractedEPS = value;
      }
    });

    // Strategy 2: Alternative selectors if first strategy fails
    if (!extractedPE || !extractedEPS) {
      // Try different container selectors
      $("div[data-test-id]").each((i, el) => {
        const text = $(el).text();
        if (text.includes("P/E") && !extractedPE) {
          const match = text.match(/P\/E.*?(\d+\.?\d*)/);
          if (match) extractedPE = match[1];
        }
        if (text.includes("EPS") && !extractedEPS) {
          const match = text.match(/EPS.*?(\d+\.?\d*)/);
          if (match) extractedEPS = match[1];
        }
      });
    }

    // Strategy 3: Look for statistics section
    if (!extractedPE || !extractedEPS) {
      $("div").each((i, el) => {
        const $el = $(el);
        const text = $el.text();
        
        // Look for P/E ratio patterns
        if ((text.includes("P/E") || text.includes("PE ratio")) && !extractedPE) {
          const nextDiv = $el.next();
          const value = nextDiv.text().trim();
          if (value && /^\d+\.?\d*$/.test(value)) {
            extractedPE = value;
          }
        }
        
        // Look for EPS patterns
        if (text.includes("EPS") && !extractedEPS) {
          const nextDiv = $el.next();
          const value = nextDiv.text().trim();
          if (value && /^\d+\.?\d*$/.test(value)) {
            extractedEPS = value;
          }
        }
      });
    }

    // Strategy 4: Search for specific data attributes or classes
    if (!extractedPE) {
      const peElements = $("[data-symbol], .pe-ratio, [class*='pe'], [class*='PE']");
      peElements.each((i, el) => {
        const text = $(el).text();
        const match = text.match(/(\d+\.?\d*)/);
        if (match && text.toLowerCase().includes('p/e')) {
          extractedPE = match[1];
          return false; // break
        }
      });
    }

    if (!extractedEPS) {
      const epsElements = $("[class*='eps'], [class*='EPS']");
      epsElements.each((i, el) => {
        const text = $(el).text();
        const match = text.match(/(\d+\.?\d*)/);
        if (match && text.toLowerCase().includes('eps')) {
          extractedEPS = match[1];
          return false; // break
        }
      });
    }

    // Log the HTML structure for debugging (remove in production)
    console.log('Available divs with gyFHrc class:', $("div.gyFHrc").length);
    console.log('Sample content:', $("div.gyFHrc").first().html());

    return NextResponse.json({
      symbol,
      url,
      extractedPE: extractedPE || "N/A",
      extractedEPS: extractedEPS || "N/A",
      title: $("title").text(),
      debug: {
        totalDivs: $("div.gyFHrc").length,
        sampleLabels: $("div.gyFHrc .mfs7Fc").map((i, el) => $(el).text().trim()).get(),
        sampleValues: $("div.gyFHrc .P6K39c").map((i, el) => $(el).text().trim()).get(),
      }
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
