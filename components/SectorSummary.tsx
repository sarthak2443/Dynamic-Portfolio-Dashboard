interface Stock {
  name: string;
  purchasePrice: number;
  qty: number;
  exchange: string;
  sector: string;
  cmp?: number;
  presentValue?: number;
  gainLoss?: number;
}

export default function SectorSummary({ sector, stocks }: { sector: string; stocks: Stock[] }) {
  const totalInvestment = stocks.reduce((sum, s) => sum + s.purchasePrice * s.qty, 0);
  const totalPresentValue = stocks.reduce((sum, s) => sum + (s.presentValue || 0), 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const gainLossPercent = ((totalGainLoss / totalInvestment) * 100);
  const isPositive = totalGainLoss >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2 
    }).format(amount);
  };

  return (
    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-indigo-200">
      <td colSpan={3} className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="font-bold text-indigo-800 text-sm uppercase tracking-wide">
            {sector} Sector Total
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right font-bold text-gray-900">
        {formatCurrency(totalInvestment)}
      </td>
      <td className="px-6 py-4 text-right text-gray-500">-</td>
      <td className="px-6 py-4 text-right font-bold text-gray-900">
        {formatCurrency(totalPresentValue)}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex flex-col items-end">
          <span className={`font-bold text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{formatCurrency(totalGainLoss)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? '▲' : '▼'} {Math.abs(gainLossPercent).toFixed(2)}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right text-gray-500">-</td>
      <td className="px-6 py-4 text-right text-gray-500">-</td>
    </tr>
  );
}
