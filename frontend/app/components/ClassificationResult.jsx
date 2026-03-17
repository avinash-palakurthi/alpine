// "use client";

// export default function ClassificationResult({ data, onViewDashboard }) {
//   const results = data?.results || [];
//   const totalCost = data?.total_cost || 0;
//   const cbamCount = data?.total_covered || 0;
//   const totalRows = data?.total_rows || 0;
//   const API_BASE = process.env.NEXT_PUBLIC_API_URL;

//   const getConfidenceBadge = (item) => {
//     if (item.status === "fast_path") {
//       return (
//         <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-blue-600 bg-blue-50 border-blue-100">
//           CN Provided
//         </span>
//       );
//     }
//     const conf = item.confidence || "low";
//     if (conf === "high")
//       return (
//         <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-emerald-600 bg-emerald-50 border-emerald-100">
//           High
//         </span>
//       );
//     if (conf === "medium")
//       return (
//         <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-amber-600 bg-amber-50 border-amber-100">
//           Medium
//         </span>
//       );
//     return (
//       <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-red-600 bg-red-50 border-red-100">
//         Low
//       </span>
//     );
//   };

//   const handleDownloadPDF = () => {
//     window.open(`${API_BASE}/report/pdf`, "_blank");
//   };

//   return (
//     <div className="space-y-4">
//       {/* Beta notice */}
//       <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-amber-700">
//         <span>⚠️</span>
//         <span>
//           <strong>Demo Version</strong> — ETS price is static (€70.19 · March
//           2026). Live pricing coming in next version.
//         </span>
//       </div>

//       {/* Summary Bar */}
//       <div className="grid grid-cols-3 gap-3">
//         <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
//           <p className="text-2xl font-bold text-gray-900">{totalRows}</p>
//           <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
//             Total Imports
//           </p>
//         </div>
//         <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
//           <p className="text-2xl font-bold text-red-500">{cbamCount}</p>
//           <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
//             CBAM Covered
//           </p>
//         </div>
//         <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
//           <p className="text-2xl font-bold text-emerald-600 break-all">
//             €{totalCost.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
//           </p>
//           <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
//             Est. CBAM Cost
//           </p>
//         </div>
//       </div>

//       {/* Results Table */}
//       <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
//         <div className="px-5 py-4 border-b border-gray-100">
//           <h2 className="text-base font-bold text-gray-900">
//             Classification Results
//           </h2>
//           <p className="text-xs text-gray-400 mt-0.5">
//             AI-classified imports with CBAM coverage and cost estimates
//           </p>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-xs">
//             <thead>
//               <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
//                 <th className="text-left px-4 py-2.5 font-semibold">Product</th>
//                 <th className="text-left px-4 py-2.5 font-semibold">CN Code</th>
//                 <th className="text-left px-4 py-2.5 font-semibold">
//                   Category
//                 </th>
//                 <th className="text-left px-4 py-2.5 font-semibold">Country</th>
//                 <th className="text-left px-4 py-2.5 font-semibold">
//                   Volume (t)
//                 </th>
//                 <th className="text-left px-4 py-2.5 font-semibold">CBAM</th>
//                 <th className="text-left px-4 py-2.5 font-semibold">
//                   Est. Cost (€)
//                 </th>
//                 <th className="text-left px-4 py-2.5 font-semibold">
//                   Confidence
//                 </th>
//                 <th className="text-left px-4 py-2.5 font-semibold">Risk</th>
//               </tr>
//             </thead>
//             <tbody>
//               {results.map((item, index) => (
//                 <tr
//                   key={index}
//                   className="border-t border-gray-50 hover:bg-gray-50/80 transition-colors"
//                 >
//                   <td className="px-4 py-2.5 font-medium text-gray-900 max-w-[140px] truncate">
//                     {item.product || "—"}
//                   </td>
//                   <td className="px-4 py-2.5">
//                     <span className="font-mono text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
//                       {item.cn_code || "—"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2.5 text-gray-500 max-w-[140px] truncate">
//                     {item.category || "—"}
//                   </td>
//                   <td className="px-4 py-2.5 text-gray-600">
//                     {item.country || "—"}
//                   </td>
//                   <td className="px-4 py-2.5 text-gray-600">
//                     {item.volume || "—"}
//                   </td>
//                   <td className="px-4 py-2.5">
//                     {item.cbam_covered ? (
//                       <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-xs font-bold">
//                         ✓ Yes
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1 text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full text-xs font-bold">
//                         ✗ No
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-4 py-2.5 font-bold text-gray-900">
//                     {item.cbam_covered ? (
//                       `€${(item.estimated_cost || 0).toLocaleString("de-DE", { maximumFractionDigits: 0 })}`
//                     ) : (
//                       <span className="text-gray-300">—</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-2.5">{getConfidenceBadge(item)}</td>
//                   <td className="px-4 py-2.5">
//                     {item.risk_flag === "high" && (
//                       <span className="text-xs font-bold px-2 py-0.5 rounded-full text-red-600 bg-red-50 border border-red-100">
//                         High
//                       </span>
//                     )}
//                     {item.risk_flag === "medium" && (
//                       <span className="text-xs font-bold px-2 py-0.5 rounded-full text-amber-600 bg-amber-50 border border-amber-100">
//                         Med
//                       </span>
//                     )}
//                     {item.risk_flag === "low" && (
//                       <span className="text-xs font-bold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50 border border-emerald-100">
//                         Low
//                       </span>
//                     )}
//                     {(!item.risk_flag || item.risk_flag === "unknown") && (
//                       <span className="text-gray-300">—</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="grid grid-cols-2 gap-3">
//         <button
//           onClick={handleDownloadPDF}
//           className="bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
//         >
//           ↓ Download PDF Report
//         </button>
//         <button
//           onClick={() => onViewDashboard(data)}
//           className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100"
//         >
//           View CBAM Dashboard →
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import ExplanationPanel from "./ExplanationPanel";

export default function ClassificationResult({ data, onViewDashboard }) {
  const results = data?.results || [];
  const totalCost = data?.total_cost || 0;
  const cbamCount = data?.total_covered || 0;
  const totalRows = data?.total_rows || 0;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // Explanation panel state
  const [showPanel, setShowPanel] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loadingExplain, setLoadingExplain] = useState(false);

  // Called when user clicks 🔍 Why? button on a row
  const handleExplain = async (index) => {
    console.log("Explaining index:", index); // add this line temporarily
    setShowPanel(true);
    setExplanation(null);
    setLoadingExplain(true);

    try {
      const url = `${API_BASE}/explain/${index}`;
      console.log("Calling URL:", url); // add this too
      const res = await fetch(url);
      const json = await res.json();
      setExplanation(json.explanation);
    } catch (e) {
      console.error("Explanation failed:", e);
    } finally {
      setLoadingExplain(false);
    }
  };

  // Close the explanation panel
  const handleClosePanel = () => {
    setShowPanel(false);
    setExplanation(null);
  };

  const getConfidenceBadge = (item) => {
    if (item.status === "fast_path") {
      return (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-blue-600 bg-blue-50 border-blue-100">
          CN Provided
        </span>
      );
    }
    const conf = item.confidence || "low";
    if (conf === "high")
      return (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-emerald-600 bg-emerald-50 border-emerald-100">
          High
        </span>
      );
    if (conf === "medium")
      return (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-amber-600 bg-amber-50 border-amber-100">
          Medium
        </span>
      );
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-red-600 bg-red-50 border-red-100">
        Low
      </span>
    );
  };

  const handleDownloadPDF = () => {
    window.open(`${API_BASE}/report/pdf`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Beta notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-amber-700">
        <span>⚠️</span>
        <span>
          <strong>Demo Version</strong> — ETS price is static (€70.19 · March
          2026). Live pricing coming in next version.
        </span>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{totalRows}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
            Total Imports
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-500">{cbamCount}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
            CBAM Covered
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-emerald-600 break-all">
            €{totalCost.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
            Est. CBAM Cost
          </p>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            Classification Results
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Click <strong>🔍 Why?</strong> on any row to see a full explanation
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-2.5 font-semibold">Product</th>
                <th className="text-left px-4 py-2.5 font-semibold">CN Code</th>
                <th className="text-left px-4 py-2.5 font-semibold">
                  Category
                </th>
                <th className="text-left px-4 py-2.5 font-semibold">Country</th>
                <th className="text-left px-4 py-2.5 font-semibold">
                  Volume (t)
                </th>
                <th className="text-left px-4 py-2.5 font-semibold">CBAM</th>
                <th className="text-left px-4 py-2.5 font-semibold">
                  Est. Cost (€)
                </th>
                <th className="text-left px-4 py-2.5 font-semibold">
                  Confidence
                </th>
                <th className="text-left px-4 py-2.5 font-semibold">Risk</th>
                <th className="text-left px-4 py-2.5 font-semibold">Explain</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-50 hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium text-gray-900 max-w-[140px] truncate">
                    {item.product || "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {item.cn_code || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 max-w-[140px] truncate">
                    {item.category || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">
                    {item.country || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">
                    {item.volume || "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    {item.cbam_covered ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-xs font-bold">
                        ✓ Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full text-xs font-bold">
                        ✗ No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-gray-900">
                    {item.cbam_covered ? (
                      `€${(item.estimated_cost || 0).toLocaleString("de-DE", { maximumFractionDigits: 0 })}`
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{getConfidenceBadge(item)}</td>
                  <td className="px-4 py-2.5">
                    {item.risk_flag === "high" && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-red-600 bg-red-50 border border-red-100">
                        High
                      </span>
                    )}
                    {item.risk_flag === "medium" && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-amber-600 bg-amber-50 border border-amber-100">
                        Med
                      </span>
                    )}
                    {item.risk_flag === "low" && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50 border border-emerald-100">
                        Low
                      </span>
                    )}
                    {(!item.risk_flag || item.risk_flag === "unknown") && (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* 🔍 Why? button — only show for CBAM covered items */}
                  <td className="px-4 py-2.5">
                    {item.cbam_covered ? (
                      <button
                        onClick={() => {
                          const rowIndex = parseInt(index); // make sure it's a clean number
                          handleExplain(rowIndex);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                      >
                        🔍 Why?
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          onClick={() => onViewDashboard(data)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100"
        >
          View CBAM Dashboard →
        </button>
      </div>

      {/* Explanation Panel — slides in from the right */}
      {showPanel && (
        <ExplanationPanel
          explanation={explanation}
          loading={loadingExplain}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}
