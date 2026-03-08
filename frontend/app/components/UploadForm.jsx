"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function UploadForm({ onSuccess, onClassifying }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a CSV or Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      onClassifying(); // move to step 2

      const response = await fetch(`${API_BASE}/process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Error:", err);
        alert("Classification failed. Check console.");
        return;
      }

      const data = await response.json();
      onSuccess(data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Upload Import File
          </h2>
          <p className="text-sm text-gray-500">
            Upload your CSV or Excel file to begin AI-powered CBAM
            classification.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("imports-file").click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer
            ${
              dragging
                ? "border-emerald-400 bg-emerald-50"
                : file
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/30"
            }`}
        >
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">
                📄
              </div>
              <div>
                <p className="font-semibold text-emerald-700">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click to change file
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
                📁
              </div>
              <div>
                <p className="font-semibold text-gray-700">
                  Drop your file here or{" "}
                  <span className="text-emerald-600">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports CSV, XLSX, XLS
                </p>
              </div>
            </div>
          )}
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            id="imports-file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Sample CSV */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Sample CSV Format
          </p>
          <div className="font-mono text-xs space-y-1">
            <p className="text-emerald-600 font-semibold">
              product_description, country_of_origin, volume_tonnes, supplier
            </p>
            <p className="text-gray-500">
              Hot rolled steel coils, China, 50, Beijing Steel Co
            </p>
            <p className="text-gray-500">
              Portland cement, India, 120, Mumbai Cement Ltd
            </p>
            <p className="text-gray-500">Aluminium ingots, Russia, 30, Rusal</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Any column format accepted — system normalises automatically.
          </p>
        </div>

        {/* Covered sectors */}
        <div className="flex flex-wrap gap-2">
          {[
            "🏗️ Steel",
            "🔩 Aluminium",
            "🏭 Cement",
            "🌱 Fertilizers",
            "⚗️ Hydrogen",
            "🔌 Electricity",
          ].map((s) => (
            <span
              key={s}
              className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full font-medium"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Classifying...
            </span>
          ) : (
            "Upload & Classify →"
          )}
        </button>
      </div>
    </div>
  );
}
