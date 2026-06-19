"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [threatScore, setThreatScore] = useState(0);
  const [linksFound, setLinksFound] = useState(0);
  const [emailsFound, setEmailsFound] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [detectedLinks, setDetectedLinks] = useState<string[]>([]);
  const [detectedEmails, setDetectedEmails] = useState<string[]>([]);
  const [spamProbability, setSpamProbability] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanCount, setScanCount] = useState(1284);
const [indicators, setIndicators] = useState<string[]>([]);
const [recommendation, setRecommendation] = useState<string[]>([]);
  const analyzeMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
  "https://spam-shield-ai-backend.onrender.com/predict",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  }
);

      const data = await response.json();

      setResult(data.prediction);
      setConfidence(data.confidence);
      setThreatScore(data.threat_score || 0);
      setLinksFound(data.links_found || 0);
      setEmailsFound(data.emails_found || 0);
      setRiskScore(data.risk_score || 0);
      setDetectedLinks(data.detected_links || []);
      setDetectedEmails(data.detected_emails || []);
      setSpamProbability(data.spam_probability || 0);
      setIndicators(data.indicators || []);
setRecommendation(data.recommendation || []);
      setScanCount((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Backend not running. Start Flask with: python app.py");
    }

    setLoading(false);
  };

  const clearAll = () => {
    setMessage("");
    setResult("");
    setConfidence(null);
    setThreatScore(0);
    setLinksFound(0);
    setEmailsFound(0);
    setRiskScore(0);
    setDetectedLinks([]);
    setDetectedEmails([]);
    setSpamProbability(0);
    setIndicators([]);
setRecommendation([]);
  };

  const threatLevel =
    threatScore > 80 ? "HIGH RISK" : threatScore > 50 ? "MEDIUM RISK" : "LOW RISK";

  const ringColor =
    threatLevel === "HIGH RISK"
      ? "#ef4444"
      : threatLevel === "MEDIUM RISK"
      ? "#f59e0b"
      : "#10b981";

  const threatLevelColor =
    threatLevel === "HIGH RISK"
      ? "text-red-400"
      : threatLevel === "MEDIUM RISK"
      ? "text-yellow-400"
      : "text-green-400";

  const classificationColor = result === "Spam" ? "text-red-400" : "text-green-400";

  const circumference = 565;
  const offset = circumference - (threatScore / 100) * circumference;

  // Threat indicators built from live data
const threatIndicators = indicators;

  
  return (
    <main className="min-h-screen bg-[#0B1220] text-white px-4 py-10">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm mb-5">
            🛡 AI Security Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">SpamShield AI</h1>
          <p className="mt-4 text-gray-400 text-lg">
            Advanced Email &amp; SMS Threat Detection System
          </p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Threats Scanned", value: scanCount.toLocaleString(), icon: "🔍" },
            { label: "Model Accuracy",  value: "96.8%",                    icon: "🎯" },
            { label: "Detection Engine", value: "Active",                   icon: "✅" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#111827] border border-gray-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl">{stat.icon}</div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main panels */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── Scanner ── */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">Message Scanner</h2>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste email or SMS content here..."
              className="w-full h-48 md:h-56 bg-[#0B1220] border border-gray-700 rounded-2xl p-4 resize-none outline-none focus:border-blue-500 text-sm"
            />

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() =>
                  setMessage(
                    "URGENT!\n\nYour account has been suspended.\n\nVerify immediately:\nhttps://bit.ly/free-money\n\nContact: support@fake-bank-security.com\n\nClaim your FREE reward now!"
                  )
                }
                className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                🚨 Spam Example
              </button>
              <button
                onClick={() =>
                  setMessage("Hi Pragati, can we meet tomorrow regarding the project?")
                }
                className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
              >
                ✅ Safe Example
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-lg bg-gray-500/10 border border-gray-500/20 text-gray-400 text-sm"
              >
                🗑 Clear
              </button>
            </div>

            <button
              onClick={analyzeMessage}
              disabled={loading}
              className="w-full mt-6 py-4 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <span className="animate-pulse">🔍 Scanning Threats...</span>
              ) : (
                "Analyze Threat"
              )}
            </button>

            {/* Detected links / emails */}
            {(detectedLinks.length > 0 || detectedEmails.length > 0) && (
              <div className="mt-6 space-y-4">
                {detectedLinks.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                    <p className="text-red-400 text-sm font-semibold mb-2">🔗 Detected Links</p>
                    {detectedLinks.map((link, i) => (
                      <p key={i} className="text-gray-300 text-xs break-all mt-1">• {link}</p>
                    ))}
                  </div>
                )}
                {detectedEmails.length > 0 && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4">
                    <p className="text-yellow-400 text-sm font-semibold mb-2">📧 Detected Emails</p>
                    {detectedEmails.map((email, i) => (
                      <p key={i} className="text-gray-300 text-xs break-all mt-1">• {email}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Dashboard ── */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-6">Threat Assessment</h2>

            {confidence !== null ? (
              <>
                {/* Gauge */}
                <div className="flex justify-center">
                  <div className="relative w-52 h-52">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#1f2937" strokeWidth="12" />
                      <circle
                        cx="100" cy="100" r="90" fill="none"
                        stroke={ringColor} strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold">{Math.round(threatScore)}%</div>
                      <div className={`mt-2 font-semibold text-sm ${threatLevelColor}`}>
                        {threatLevel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                  {[
                    { icon: "🛡",  label: "Classification",  value: result,        color: classificationColor },
                    { icon: "📊",  label: "Model Confidence", value: `${confidence}%`, color: "text-white" },
                    { icon: "⚠",  label: "Threat Level",     value: threatLevel,   color: threatLevelColor },
                    { icon: "🔗",  label: "Links Found",      value: linksFound,    color: "text-white" },
                    { icon: "📧",  label: "Emails Found",     value: emailsFound,   color: "text-white" },
                    { icon: "🚨",  label: "Risk Score",       value: riskScore,     color: "text-white" },
                  ].map((card) => (
                    <div key={card.label} className="bg-[#0B1220] rounded-2xl p-4 border border-gray-800">
                      <p className="text-gray-400 text-xs">{card.icon} {card.label}</p>
                      <h3 className={`text-lg font-bold mt-1 ${card.color}`}>
                        {String(card.value)}
                      </h3>
                    </div>
                  ))}
                </div>

                {/* Threat indicators */}
                {threatIndicators.length > 0 && (
                  <div className="mt-5 bg-[#0B1220] border border-gray-800 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm font-semibold mb-3">⚡ Threat Indicators</p>
                    {threatIndicators.map((indicator, i) => (
                      <div key={i} className="flex items-center gap-2 mt-2">
                        <span className="text-red-400 text-xs">✓</span>
                        <span className="text-gray-300 text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendation */}
                <div
  className={`mt-4 rounded-2xl p-4 border ${
    threatLevel === "HIGH RISK"
      ? "bg-red-500/5 border-red-500/20"
      : threatLevel === "MEDIUM RISK"
      ? "bg-yellow-500/5 border-yellow-500/20"
      : "bg-green-500/5 border-green-500/20"
  }`}
>
  <p className={`text-sm font-semibold mb-2 ${threatLevelColor}`}>
    💡 Recommendation
  </p>

  {recommendation.map((rec, i) => (
    <p
      key={i}
      className="text-gray-300 text-sm mt-1"
    >
      • {rec}
    </p>
  ))}
</div>
              </>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 gap-3">
                <div className="text-5xl opacity-30">🛡</div>
                <p>Run a scan to view threat analysis</p>
              </div>
            )}
          </div>
        </div>

<div className="text-center mt-10 text-gray-500 text-sm italic">
  Built by Pragati Gupta • Turning AI into meaningful solutions.
</div>
      </div>
    </main>
  );
}