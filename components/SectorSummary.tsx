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

  return (
    <tr className="bg-gray-100 font-semibold">
      <td colSpan={3} className="p-2 border text-right">
        {sector} Total →
      </td>
      <td className="p-2 border">{totalInvestment.toFixed(2)}</td>
      <td className="p-2 border">-</td>
      <td className="p-2 border">{totalPresentValue.toFixed(2)}</td>
      <td
        className={`p-2 border ${
          totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {totalGainLoss.toFixed(2)}
      </td>
    </tr>
  );
}
