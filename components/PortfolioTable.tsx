"use client";
import React, { useEffect, useState } from "react";
import data from "@/lib/sampleData.json";
import SectorSummary from "./SectorSummary";

interface Stock {
  name: string;
  symbol: string;
  purchasePrice: number;
  qty: number;
  exchange: string;
  sector: string;
  cmp?: number;
  presentValue?: number;
  gainLoss?: number;
  peRatio?: string;
  earnings?: string;
}

export default function PortfolioTable() {
  const [stocks, setStocks] = useState<Stock[]>(data);

  // 🔹 Just for UI demo (disable API)
  useEffect(() => {
    const updated = stocks.map((s) => ({
      ...s,
      cmp: s.purchasePrice + Math.random() * 200, // fake CMP
      presentValue: (s.purchasePrice + 100) * s.qty,
      gainLoss: (s.purchasePrice + 100) * s.qty - s.purchasePrice * s.qty,
      peRatio: "27.34",
      earnings: "52.11",
    }));
    setStocks(updated);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Card */}
      <div className="mb-6 bg-white shadow-lg rounded-xl p-6 border">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          📊 Portfolio Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Live portfolio tracker with auto-refresh every 15 seconds
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table-auto w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 shadow-md">
            <tr>
              <th className="p-3 border border-indigo-500">Stock</th>
              <th className="p-3 border border-indigo-500">Purchase Price</th>
              <th className="p-3 border border-indigo-500">Qty</th>
              <th className="p-3 border border-indigo-500">Investment</th>
              <th className="p-3 border border-indigo-500">CMP</th>
              <th className="p-3 border border-indigo-500">Present Value</th>
              <th className="p-3 border border-indigo-500">Gain/Loss</th>
              <th className="p-3 border border-indigo-500">P/E Ratio</th>
              <th className="p-3 border border-indigo-500">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              stocks.reduce((acc: Record<string, Stock[]>, stock) => {
                if (!acc[stock.sector]) acc[stock.sector] = [];
                acc[stock.sector].push(stock);
                return acc;
              }, {})
            ).map(([sector, sectorStocks], i) => (
              <React.Fragment key={i}>
                {sectorStocks.map((s, j) => (
                  <tr
                    key={j}
                    className={`transition-colors ${
                      j % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-yellow-50`}
                  >
                    <td className="p-3 border">{s.name}</td>
                    <td className="p-3 border">{s.purchasePrice}</td>
                    <td className="p-3 border">{s.qty}</td>
                    <td className="p-3 border">
                      {(s.purchasePrice * s.qty).toFixed(2)}
                    </td>
                    <td className="p-3 border">{s.cmp?.toFixed(2) || "-"}</td>
                    <td className="p-3 border">
                      {s.presentValue?.toFixed(2) || "-"}
                    </td>
                    <td
                      className={`p-3 border font-semibold ${
                        (s.gainLoss || 0) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {s.gainLoss?.toFixed(2) || "-"}
                    </td>
                    <td className="p-3 border">{s.peRatio || "-"}</td>
                    <td className="p-3 border">{s.earnings || "-"}</td>
                  </tr>
                ))}
                {/* Sector summary row */}
                <tr className="bg-indigo-100 font-bold">
                  <td className="p-3 border" colSpan={3}>
                    {sector} Total →
                  </td>
                  <td className="p-3 border">
                    {sectorStocks
                      .reduce((sum, s) => sum + s.purchasePrice * s.qty, 0)
                      .toFixed(2)}
                  </td>
                  <td className="p-3 border">-</td>
                  <td className="p-3 border">
                    {sectorStocks
                      .reduce((sum, s) => sum + (s.presentValue || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td
                    className={`p-3 border ${
                      sectorStocks.reduce(
                        (sum, s) => sum + (s.gainLoss || 0),
                        0
                      ) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {sectorStocks
                      .reduce((sum, s) => sum + (s.gainLoss || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td className="p-3 border">-</td>
                  <td className="p-3 border">-</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
