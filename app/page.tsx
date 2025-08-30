import PortfolioTable from "@/components/PortfolioTable";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        📊 Portfolio Dashboard
      </h1>
      <div className="max-w-5xl mx-auto">
        <PortfolioTable />
      </div>
    </main>
  );
}
