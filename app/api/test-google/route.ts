import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "INFY:NSE";

  try {
    const url = `https://www.google.com/finance/quote/${symbol}`;
    console.log(`Testing Google Finance: ${url}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 15000,
    });

    console.log(`Response length: ${data.length}`);
    const $ = cheerio.load(data);

    // Check if we got blocked
    const title = $('title').text();
    console.log(`Page title: ${title}`);
    
    if (title.includes('Error') || title.includes('Access Denied') || data.length < 5000) {
      console.log('Possible blocking detected');
      return NextResponse.json({
        error: "Access might be blocked",
        title,
        dataLength: data.length,
        environment: process.env.NODE_ENV
      });
    }

    // Get all text content to see what's available
    const allDivs = $('div').map((i, el) => $(el).text()).get();
    const financialData = allDivs.filter(text =>
      text.includes('P/E') ||
      text.includes('EPS') ||
      text.includes('Earnings') ||
      text.includes('ratio') ||
      text.toLowerCase().includes('pe ')
    );

    // Enhanced P/E ratio extraction
    let extractedPE = "";
    let extractedEPS = "";

    // Method 1: Look for data attributes (Google Finance specific)
    $('[data-last-value]').each((i, elem) => {
      const $elem = $(elem);
      const parentText = $elem.parent().text();
      const value = $elem.attr('data-last-value') || $elem.text();
      
      if (parentText && parentText.toLowerCase().includes('p/e') && !extractedPE) {
        extractedPE = value;
        console.log(`Found P/E via data-last-value: ${extractedPE}`);
      }
    });

    // Method 2: Look for P/E ratio patterns in the filtered data
    if (!extractedPE) {
      financialData.forEach(text => {
        // Enhanced patterns
        const pePatterns = [
          /P\/E\s*ratio\s*[:\-]?\s*(\d+\.?\d*)/gi,
          /P\/E\s*[:\-]?\s*(\d+\.?\d*)/gi,
          /PE\s*ratio\s*[:\-]?\s*(\d+\.?\d*)/gi,
        ];

        for (const pattern of pePatterns) {
          const peMatch = text.match(pattern);
          if (peMatch && peMatch[1] && !extractedPE) {
            extractedPE = peMatch[1];
            console.log(`Found P/E via pattern: ${extractedPE}`);
            break;
          }
        }

        // Look for EPS patterns
        const epsMatch = text.match(/(?:EPS|Earnings per share)\s*(\d+\.?\d*)/i);
        if (epsMatch && !extractedEPS) {
          extractedEPS = epsMatch[1];
        }
      });
    }

    // Method 3: Enhanced DOM structure search
    if (!extractedPE) {
      $('div').each((i, elem) => {
        const $elem = $(elem);
        const text = $elem.text().trim();

        if (text.toLowerCase().includes('p/e') && text.toLowerCase().includes('ratio')) {
          // Look for a number in the same element
          const numberMatch = text.match(/(\d+\.?\d+)/);
          if (numberMatch && !extractedPE) {
            extractedPE = numberMatch[1];
            console.log(`Found P/E in same element: ${extractedPE}`);
            return false;
          }

          // Check next siblings for numeric values
          let $next = $elem.next();
          let attempts = 0;
          while ($next.length && attempts < 3) {
            const nextText = $next.text().trim();
            const nextNumberMatch = nextText.match(/^(\d+\.?\d+)$/);
            if (nextNumberMatch && parseFloat(nextNumberMatch[1]) > 0 && parseFloat(nextNumberMatch[1]) < 1000) {
              extractedPE = nextNumberMatch[1];
              console.log(`Found P/E via next sibling: ${extractedPE}`);
              return false;
            }
            $next = $next.next();
            attempts++;
          }
        }
      });
    }

    // Method 4: Look in tables or structured data
    if (!extractedPE) {
      $('table tr, div[role="row"]').each((i, elem) => {
        const $row = $(elem);
        const rowText = $row.text().toLowerCase();
        
        if (rowText.includes('p/e') || rowText.includes('pe ratio')) {
          const cells = $row.find('td, div').map((j, cell) => $(cell).text().trim()).get();
          for (const cell of cells) {
            const numberMatch = cell.match(/^(\d+\.?\d+)$/);
            if (numberMatch && parseFloat(numberMatch[1]) > 0 && parseFloat(numberMatch[1]) < 1000) {
              extractedPE = numberMatch[1];
              console.log(`Found P/E in table: ${extractedPE}`);
              return false;
            }
          }
        }
      });
    }

    return NextResponse.json({
      symbol,
      url,
      financialData: financialData.slice(0, 10), // Limit for debugging
      extractedPE: extractedPE || "N/A",
      extractedEPS: extractedEPS || "N/A",
      htmlLength: data.length,
      title,
      totalDivs: allDivs.length,
      financialDataCount: financialData.length,
      environment: process.env.NODE_ENV,
      success: !!extractedPE,
    });
  } catch (error) {
    console.error("Test error details:", error);
    return NextResponse.json({
      error: "Failed to fetch test data",
      details: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
