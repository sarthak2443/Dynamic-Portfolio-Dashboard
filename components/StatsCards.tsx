interface StatsCardsProps {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  lastUpdated: Date;
}

export default function StatsCards({ 
  totalInvestment, 
  totalPresentValue, 
  totalGainLoss, 
  lastUpdated 
}: StatsCardsProps) {
  const totalGainLossPercent = ((totalGainLoss / totalInvestment) * 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Investment",
      value: formatCurrency(totalInvestment),
      icon: "💰",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: null
    },
    {
      title: "Current Value",
      value: formatCurrency(totalPresentValue),
      icon: "📈",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      trend: null
    },
    {
      title: "Total P&L",
      value: formatCurrency(totalGainLoss),
      icon: totalGainLoss >= 0 ? "🟢" : "🔴",
      bgColor: totalGainLoss >= 0 ? "bg-green-100" : "bg-red-100",
      iconColor: totalGainLoss >= 0 ? "text-green-600" : "text-red-600",
      trend: `${totalGainLossPercent >= 0 ? '+' : ''}${totalGainLossPercent.toFixed(2)}%`
    },
    {
      title: "Last Updated",
      value: lastUpdated.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      icon: "🕒",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "Auto-refresh: 15s"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover-lift hover:shadow-xl transition-all duration-300 slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
              <span className={`${stat.iconColor} text-xl`}>{stat.icon}</span>
            </div>
            {stat.trend && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.title === "Total P&L" 
                  ? totalGainLoss >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {stat.trend}
              </span>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
            <p className={`text-2xl font-bold ${
              stat.title === "Total P&L" 
                ? totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                : 'text-gray-900'
            }`}>
              {stat.title === "Total P&L" && totalGainLoss >= 0 ? '+' : ''}{stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
