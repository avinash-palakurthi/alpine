"use client";

import { useEffect } from "react";

export default function ExplanationPanel({ explanation, loading, onClose }) {
  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 w-[420px] h-full bg-white border-l border-gray-200 shadow-2xl z-50 p-6 overflow-y-auto transition-transform duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-900">🔍 Explanation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        {explanation && (
          <div className="space-y-6 text-sm">
            {/* CBAM */}
            <div className="bg-gray-50 p-3 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-1">CBAM</h3>
              <p className="text-sm">
                {explanation.cbam.status ? "✔ Covered" : "✗ Not Covered"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {explanation.cbam.reason}
              </p>
            </div>

            {/* Cost */}
            <div className="bg-gray-50 p-3 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-1">
                Cost Breakdown
              </h3>
              <p className="text-lg font-bold text-emerald-600">
                €{explanation.cost.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {explanation.cost.formula}
              </p>
            </div>

            {/* Risk */}
            <div className="bg-gray-50 p-3 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-1">Risk</h3>
              <p
                className={`font-bold ${
                  explanation.risk.level === "HIGH"
                    ? "text-red-600"
                    : explanation.risk.level === "MEDIUM"
                      ? "text-amber-600"
                      : "text-emerald-600"
                }`}
              >
                {explanation.risk.level}
              </p>
              <ul className="text-xs text-gray-500 mt-2 list-disc ml-4">
                {explanation.risk.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* AI Insight */}
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-1">AI Insight</h3>
              <p className="text-xs text-blue-800">{explanation.ai_insight}</p>
            </div>

            {/* Confidence */}
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Confidence</span>
              <span className="font-semibold text-gray-700">
                {explanation.confidence.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
