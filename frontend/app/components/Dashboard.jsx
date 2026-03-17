"use client";

export default function Dashboard({ data, onBack }) {
  const results = data?.results || [];
  const cbamItems = results.filter((r) => r.cbam_covered);
  const totalImports = data?.total_rows || 0;
  const totalCost = data?.total_cost || 0;
  const totalEmissions = data?.total_emissions || 0;
  const riskSummary = data?.risk_summary || { high: 0, medium: 0, low: 0 };
  const categoryCosts = data?.category_costs || {};
  const topImports = data?.top_imports || [];
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  // CBAM Exposure = % of imports that ARE covered (high exposure = high risk)
  const exposureScore =
    totalImports > 0 ? Math.round((cbamItems.length / totalImports) * 100) : 0;

  const getExposureStyle = (score) => {
    if (score >= 70)
      return {
        text: "text-red-500",
        badge: "bg-red-50 text-red-700 border-red-100",
        label: "High Exposure",
      };
    if (score >= 30)
      return {
        text: "text-amber-500",
        badge: "bg-amber-50 text-amber-700 border-amber-100",
        label: "Medium Exposure",
      };
    return {
      text: "text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
      label: "Low Exposure",
    };
  };

  const categoryColors = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-amber-400",
    "bg-purple-500",
    "bg-red-400",
    "bg-pink-400",
  ];

  const maxCategoryCost = Math.max(...Object.values(categoryCosts), 1);
  const e = getExposureStyle(exposureScore);

  const handleDownloadPDF = () => {
    window.open(`${API_BASE}/report/pdf`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">CBAM Dashboard</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Q{Math.ceil((new Date().getMonth() + 1) / 3)}{" "}
            {new Date().getFullYear()} — Compliance Overview
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg bg-white transition-all"
        >
          ← Back to Results
        </button>
      </div>
      {/* Demo/Beta notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-blue-700">
        <span>ℹ️</span>
        <span>
          <strong>Beta Version</strong> — ETS price is static at €70.19/tCO₂
          (March 2026). Dynamic live pricing coming in the next release.
        </span>
      </div>
      {/* Top Stats — 5 cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* CBAM Exposure */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
            CBAM Exposure
          </p>
          <p className={`text-3xl font-bold ${e.text}`}>{exposureScore}%</p>
          <span
            className={`inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full border ${e.badge}`}
          >
            {e.label}
          </span>
        </div>

        {/* Total Imports */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
            Total Imports
          </p>
          <p className="text-3xl font-bold text-gray-900">{totalImports}</p>
          <p className="text-xs text-gray-400 mt-1.5">products analyzed</p>
        </div>

        {/* CBAM Covered */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
            CBAM Covered
          </p>
          <p className="text-3xl font-bold text-red-500">{cbamItems.length}</p>
          <p className="text-xs text-gray-400 mt-1.5">
            {exposureScore}% of imports
          </p>
        </div>

        {/* Est. CBAM Cost */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
            Est. CBAM Cost
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            €{(totalCost / 1000).toFixed(1)}k
          </p>
          <p className="text-xs text-gray-400 mt-1.5">this quarter</p>
        </div>

        {/* ETS Price */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
            ETS Price
          </p>
          <p className="text-3xl font-bold text-gray-700">€70.19</p>
          <p className="text-xs text-gray-400 mt-1.5">static · March 2026</p>
        </div>
      </div>
      {/* Risk Summary Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-red-600">{riskSummary.high}</p>
          <p className="text-xs text-red-500 font-semibold mt-0.5">High Risk</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-amber-600">
            {riskSummary.medium}
          </p>
          <p className="text-xs text-amber-500 font-semibold mt-0.5">
            Medium Risk
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-emerald-600">
            {riskSummary.low}
          </p>
          <p className="text-xs text-emerald-500 font-semibold mt-0.5">
            Low Risk
          </p>
        </div>
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cost by Category */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">
            CBAM Cost by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryCosts)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, cost], index) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium truncate max-w-[180px]">
                      {cat}
                    </span>
                    <span className="text-gray-900 font-bold ml-2">
                      €
                      {cost.toLocaleString("de-DE", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${categoryColors[index % categoryColors.length]} transition-all`}
                      style={{
                        width: `${Math.round((cost / maxCategoryCost) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Imports */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">
            Top CBAM Covered Imports
          </h3>
          <div className="space-y-0.5">
            {topImports.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-xs font-semibold text-gray-900 truncate max-w-[160px]">
                    {item.product || item.supplier || "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="font-mono text-emerald-600">
                      {item.cn_code}
                    </span>
                    {" · "}
                    {item.country}
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-900 ml-3 shrink-0">
                  €
                  {(item.estimated_cost || 0).toLocaleString("de-DE", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownloadPDF}
          className="bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          ↓ Download PDF Report
        </button>
        <button
          onClick={onBack}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100"
        >
          ← Back to Results
        </button>
      </div>
      {/* Action Buttons */}
      {/* <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleDownloadPDF}
          className="bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          ↓ Download PDF Report
        </button>

        <button
          onClick={onBack}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100"
        >
          ← Back to Results
        </button>

        {/* ✅ NEW BUTTON */}
      {/* <button
          onClick={() => (window.location.href = `/explain/0`)}
          className="bg-white border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          🔍 View Explanation
        </button>
      </div> */}{" "}
      *
    </div>
  );
}
