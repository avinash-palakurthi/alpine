"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadForm from "./UploadForm";
import ClassificationResult from "./ClassificationResult";
import Dashboard from "./Dashboard";

const steps = ["Upload", "Classifying", "Results", "Dashboard"];

export default function CBAMApp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [classificationData, setClassificationData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-14">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-bold text-gray-900 text-xl">
              Alpine<span className="text-emerald-500">Scope</span>
            </span>
          </button>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full font-semibold">
            Beta · Q1 2026
          </span>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center max-w-lg mx-auto">
            {steps.map((label, index) => {
              const stepNumber = index + 1;
              const isComplete = stepNumber < step;
              const isActive = stepNumber === step;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${isComplete ? "bg-emerald-500 text-white" : isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                      {isComplete ? "✓" : stepNumber}
                    </div>
                    <p
                      className={`text-xs mt-1 font-medium whitespace-nowrap ${isActive ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mb-4 ${isComplete ? "bg-emerald-400" : "bg-gray-100"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {step === 1 && (
          <UploadForm
            onSuccess={(data) => {
              setClassificationData(data);
              setStep(3);
            }}
            onClassifying={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-bold text-gray-900">
              AI is classifying your imports...
            </p>
            <p className="text-xs text-gray-400">
              Checking CN codes, CBAM coverage, and estimating costs
            </p>
          </div>
        )}

        {step === 3 && classificationData && (
          <ClassificationResult
            data={classificationData}
            onViewDashboard={(data) => {
              setDashboardData(data);
              setStep(4);
            }}
          />
        )}

        {step === 4 && dashboardData && (
          <Dashboard data={dashboardData} onBack={() => setStep(3)} />
        )}
      </div>
    </div>
  );
}
