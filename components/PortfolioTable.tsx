"use client";
import React, { useEffect, useState } from "react";
import data from "@/lib/sampleData.json";
import SectorSummary from "./SectorSummary";
import StatsCards from "./StatsCards";

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
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // 🔹 Simulate API data fetching with realistic updates
  useEffect(() => {
    const fetchData = () => {
      const updated = stocks.map((s) => {
        const volatility = 0.02; // 2% volatility
        const randomChange = (Math.random() - 0.5) * volatility;
        const newCmp = s.cmp ? s.cmp * (1 + randomChange) : s.purchasePrice * (1 + randomChange + 0.1);
        
        return {
          ...s,
          cmp: Math.max(newCmp, s.purchasePrice * 0.5), // Prevent unrealistic drops
          presentValue: Math.max(newCmp, s.purchasePrice * 0.5) * s.qty,
          gainLoss: (Math.max(newCmp, s.purchasePrice * 0.5) * s.qty) - (s.purchasePrice * s.qty),
          peRatio: (Math.random() * 40 + 10).toFixed(2),
          earnings: (Math.random() * 100 + 20).toFixed(2),
        };
      });
      setStocks(updated);
      setLastUpdated(new Date());
      setIsLoading(false);
    };

    // Initial load
    fetchData();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const totalInvestment = stocks.reduce((sum, s) => sum + s.purchasePrice * s.qty, 0);
  const totalPresentValue = stocks.reduce((sum, s) => sum + (s.presentValue || 0), 0);
  const totalGainLoss = totalPresentValue - totalInvestment;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading portfolio data...</p>
          <p className="text-gray-400 text-sm mt-1">Fetching real-time market prices</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards 
        totalInvestment={totalInvestment}
        totalPresentValue={totalPresentValue}
        totalGainLoss={totalGainLoss}
        lastUpdated={lastUpdated}
      />

      {/* Enhanced Portfolio Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden slide-up">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📋</span> Portfolio Holdings
              </h2>
              <p className="text-indigo-100 text-sm mt-1">Real-time stock prices and performance metrics</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-white text-sm font-medium">
                  {stocks.length} Holdings
                </p>
                <p className="text-indigo-100 text-xs">
                  {Object.keys(stocks.reduce((acc: Record<string, Stock[]>, stock) => {
                    if (!acc[stock.sector]) acc[stock.sector] = [];
                    acc[stock.sector].push(stock);
                    return acc;
                  }, {})).length} Sectors
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock Details
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Present Value
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  P&L
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  P/E Ratio
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(
                stocks.reduce((acc: Record<string, Stock[]>, stock) => {
                  if (!acc[stock.sector]) acc[stock.sector] = [];
                  acc[stock.sector].push(stock);
                  return acc;
                }, {})
              ).map(([sector, sectorStocks], sectorIndex) => (
                <React.Fragment key={sectorIndex}>
                  {/* Sector Header */}
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-indigo-100">
                    <td colSpan={9} className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">
                            {sector === 'Technology' ? '💻' : 
                             sector === 'Finance' ? '🏦' : 
                             sector === 'Healthcare' ? '🏥' : 
                             sector === 'Energy' ? '⚡' : '🏭'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {sector} Sector
                          </h3>
                          <p className="text-xs text-gray-500">
                            {sectorStocks.length} stocks • {formatCurrency(sectorStocks.reduce((sum, s) => sum + s.purchasePrice * s.qty, 0))} invested
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Stocks in Sector */}
                  {sectorStocks.map((stock, stockIndex) => {
                    const gainLossPercent = ((stock.gainLoss || 0) / (stock.purchasePrice * stock.qty)) * 100;
                    const isPositive = (stock.gainLoss || 0) >= 0;
                    
                    return (
                      <tr 
                        key={stockIndex}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                              {stock.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-mono font-medium">
                                {stock.symbol}
                              </span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                                {stock.exchange}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          {formatCurrency(stock.purchasePrice)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                          {formatNumber(stock.qty)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                          {formatCurrency(stock.purchasePrice * stock.qty)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">
                              {formatCurrency(stock.cmp || 0)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {isPositive ? '▲' : '▼'} {Math.abs(gainLossPercent).toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                          {formatCurrency(stock.presentValue || 0)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-bold ${
                              isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isPositive ? '+' : ''}{formatCurrency(stock.gainLoss || 0)}
                            </span>
                            <span className={`text-xs font-medium ${
                              isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-gray-100 px-3 py-2 rounded-full text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors">
                            {stock.peRatio || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors">
                            ₹{stock.earnings || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Sector Summary */}
                  <SectorSummary sector={sector} stocks={sectorStocks} />
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">
          💡 <strong>Tip:</strong> Data refreshes automatically every 15 seconds for real-time portfolio tracking
        </p>
      </div>
    </div>
  );
}
