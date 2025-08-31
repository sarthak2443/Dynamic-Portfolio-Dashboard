import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "INFY:NSE";

  try {
    const url = `https://www.google.com/finance/quote/${symbol}?hl=en`;
    console.log(`Fetching Google Finance: ${url}`);

    // Enhanced HTTP headers to mimic a real browser
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
        "DNT": "1"
      },
    });

    const $ = cheerio.load(data);

    let extractedPE = "";
    let extractedEPS = "";
    
    // Debug information to track extraction attempts
    const debugInfo = {
      strategy1_originalSelectors: false,
      strategy2_textSearch: false,
      strategy3_regexMatching: false,
      strategy4_fallbackPatterns: false,
      elementsFound: 0,
      pePatterns: [] as string[],
      epsPatterns: [] as string[]
    };

    // Strategy 1: Original selector-based approach (maintained for backward compatibility)
    $("div.gyFHrc").each((i, el) => {
      const label = $(el).find(".mfs7Fc").text().trim();
      const value = $(el).find(".P6K39c").text().trim();
      debugInfo.elementsFound++;

      // Enhanced P/E pattern matching
      if (/P\/E|PE\s*ratio|Price.*Earnings/i.test(label)) {
        debugInfo.pePatterns.push(`Strategy1: ${label} -> ${value}`);
        if (!extractedPE && /^\d+\.?\d*$/.test(value)) {
          extractedPE = value;
          debugInfo.strategy1_originalSelectors = true;
        }
      }
      
      // Enhanced EPS pattern matching
      if (/EPS|Earnings.*share|Earnings.*per/i.test(label) && !/P\/E/i.test(label)) {
        debugInfo.epsPatterns.push(`Strategy1: ${label} -> ${value}`);
        if (!extractedEPS && /^\d+\.?\d*$/.test(value)) {
          extractedEPS = value;
          debugInfo.strategy1_originalSelectors = true;
        }
      }
    });

    // Strategy 2: Text-based search through all div elements
    if (!extractedPE || !extractedEPS) {
      $('div').each((i, elem) => {
        const $elem = $(elem);
        const text = $elem.text().trim();
        
        // Look for P/E ratio patterns in text content
        if (!extractedPE && /P\/E\s*ratio|PE\s*ratio|Price.*Earnings/i.test(text) && !/EPS|Earnings.*share/i.test(text)) {
          // Try to find numeric value in same element or siblings
          const match = text.match(/(\d+\.?\d*)/);
          if (match) {
            debugInfo.pePatterns.push(`Strategy2: ${text} -> ${match[1]}`);
            extractedPE = match[1];
            debugInfo.strategy2_textSearch = true;
          } else {
            // Check siblings for numeric values
            $elem.siblings().each((j, sibling) => {
              const siblingText = $(sibling).text().trim();
              const siblingMatch = siblingText.match(/^(\d+\.?\d*)$/);
              if (siblingMatch && !extractedPE) {
                debugInfo.pePatterns.push(`Strategy2-sibling: ${text} -> ${siblingMatch[1]}`);
                extractedPE = siblingMatch[1];
                debugInfo.strategy2_textSearch = true;
              }
            });
          }
        }
        
        // Look for EPS patterns
        if (!extractedEPS && /EPS|Earnings.*share|Earnings.*per/i.test(text) && !/P\/E|PE\s*ratio/i.test(text)) {
          const match = text.match(/(\d+\.?\d*)/);
          if (match && match[1] !== extractedPE) {
            debugInfo.epsPatterns.push(`Strategy2: ${text} -> ${match[1]}`);
            extractedEPS = match[1];
            debugInfo.strategy2_textSearch = true;
          }
        }
      });
    }

    // Strategy 3: Advanced regex pattern matching across page content
    if (!extractedPE || !extractedEPS) {
      const pageText = $('body').text();
      
      // P/E ratio regex patterns
      const peRegexPatterns = [
        /P\/E\s*ratio[:\s]*(\d+\.?\d*)/gi,
        /PE\s*ratio[:\s]*(\d+\.?\d*)/gi,
        /Price[\/\s]*Earnings[:\s]*(\d+\.?\d*)/gi,
        /P\/E[:\s]*(\d+\.?\d*)/gi
      ];
      
      for (const pattern of peRegexPatterns) {
        if (!extractedPE) {
          const matches = [...pageText.matchAll(pattern)];
          if (matches.length > 0) {
            extractedPE = matches[0][1];
            debugInfo.pePatterns.push(`Strategy3: ${pattern.source} -> ${extractedPE}`);
            debugInfo.strategy3_regexMatching = true;
            break;
          }
        }
      }
      
      // EPS regex patterns
      const epsRegexPatterns = [
        /EPS[:\s]*(\d+\.?\d*)/gi,
        /Earnings\s*per\s*share[:\s]*(\d+\.?\d*)/gi,
        /Earnings\/share[:\s]*(\d+\.?\d*)/gi
      ];
      
      for (const pattern of epsRegexPatterns) {
        if (!extractedEPS) {
          const matches = [...pageText.matchAll(pattern)];
          if (matches.length > 0 && matches[0][1] !== extractedPE) {
            extractedEPS = matches[0][1];
            debugInfo.epsPatterns.push(`Strategy3: ${pattern.source} -> ${extractedEPS}`);
            debugInfo.strategy3_regexMatching = true;
            break;
          }
        }
      }
    }

    // Strategy 4: Fallback patterns and alternative selectors
    if (!extractedPE || !extractedEPS) {
      // Try alternative CSS selectors
      const alternativeSelectors = [
        'span[data-testid*="pe"]',
        'div[data-testid*="pe"]',
        'span[aria-label*="P/E"]',
        'div[aria-label*="P/E"]',
        '*[title*="P/E"]',
        '*[title*="PE ratio"]'
      ];
      
      for (const selector of alternativeSelectors) {
        if (!extractedPE) {
          const element = $(selector);
          if (element.length > 0) {
            const value = element.text().trim();
            if (/^\d+\.?\d*$/.test(value)) {
              extractedPE = value;
              debugInfo.pePatterns.push(`Strategy4: ${selector} -> ${value}`);
              debugInfo.strategy4_fallbackPatterns = true;
            }
          }
        }
      }
      
      // Try data attributes for EPS
      const epsSelectors = [
        'span[data-testid*="eps"]',
        'div[data-testid*="eps"]',
        'span[aria-label*="EPS"]',
        'div[aria-label*="EPS"]',
        '*[title*="EPS"]',
        '*[title*="Earnings per share"]'
      ];
      
      for (const selector of epsSelectors) {
        if (!extractedEPS) {
          const element = $(selector);
          if (element.length > 0) {
            const value = element.text().trim();
            if (/^\d+\.?\d*$/.test(value) && value !== extractedPE) {
              extractedEPS = value;
              debugInfo.epsPatterns.push(`Strategy4: ${selector} -> ${value}`);
              debugInfo.strategy4_fallbackPatterns = true;
            }
          }
        }
      }
    }

    // Improved error handling: return "N/A" instead of empty strings
    const finalPE = extractedPE || "N/A";
    const finalEPS = extractedEPS || "N/A";

    console.log(`Extraction complete for ${symbol}: PE=${finalPE}, EPS=${finalEPS}`);

    return NextResponse.json({
      symbol,
      url,
      extractedPE: finalPE,
      extractedEPS: finalEPS,
      title: $("title").text(),
      debug: {
        ...debugInfo,
        strategiesUsed: {
          originalSelectors: debugInfo.strategy1_originalSelectors,
          textSearch: debugInfo.strategy2_textSearch,
          regexMatching: debugInfo.strategy3_regexMatching,
          fallbackPatterns: debugInfo.strategy4_fallbackPatterns
        },
        extractionSummary: {
          peFound: finalPE !== "N/A",
          epsFound: finalEPS !== "N/A",
          totalPEPatterns: debugInfo.pePatterns.length,
          totalEPSPatterns: debugInfo.epsPatterns.length
        }
      }
    });
  } catch (error) {
    console.error("Google Finance scraping error:", error);
    
    if (error instanceof Error) {
      console.error("Scraping error:", error.message);
      return NextResponse.json(
        { 
          error: "Failed to fetch data", 
          details: error.message,
          symbol,
          extractedPE: "N/A",
          extractedEPS: "N/A",
          debug: {
            errorType: "network_or_parsing",
            message: error.message
          }
        },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch data", 
          details: String(error),
          symbol,
          extractedPE: "N/A",
          extractedEPS: "N/A",
          debug: {
            errorType: "unknown",
            message: String(error)
          }
        },
        { status: 500 }
      );
    }
  }
}
