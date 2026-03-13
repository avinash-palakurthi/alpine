"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const stats = [
  { num: "2023", label: "CBAM Regulation enacted" },
  { num: "2026", label: "Definitive phase started" },
  { num: "€79", label: "Current ETS price per tCO₂" },
  { num: "6", label: "Sectors under Annex I" },
];

const timeline = [
  {
    year: "2023",
    title: "CBAM Regulation Passed",
    desc: "EU Parliament passed Regulation (EU) 2023/956 establishing the Carbon Border Adjustment Mechanism as part of the European Green Deal.",
  },
  {
    year: "Oct 2023",
    title: "Transitional Phase Begins",
    desc: "Importers required to report embedded emissions quarterly. No financial charges yet — only reporting obligations to build data infrastructure.",
  },
  {
    year: "Jan 2026",
    title: "Definitive Phase",
    desc: "Full CBAM charges come into force. EU importers must purchase CBAM certificates matching the carbon price paid under EU ETS. Non-compliance means penalties.",
  },
  {
    year: "2027",
    title: "First Verification Deadline",
    desc: "Accredited verifiers must confirm supplier emission data. Companies without verified actual emissions fall back to costly EU default values.",
  },
  {
    year: "2034",
    title: "Full Phase-In Complete",
    desc: "CBAM fully replaces free ETS allowances for covered sectors. All embedded emissions in imports subject to full carbon pricing.",
  },
];

const sectors = [
  {
    icon: "🏗️",
    name: "Steel",
    cn: "CN 72-73",
    desc: "Hot rolled coils, wire rod, structural steel",
  },
  {
    icon: "🔩",
    name: "Aluminium",
    cn: "CN 76",
    desc: "Unwrought aluminium, alloys, articles",
  },
  {
    icon: "🏭",
    name: "Cement",
    cn: "CN 25",
    desc: "Portland cement, clinkers, calcium",
  },
  {
    icon: "🌱",
    name: "Fertilizers",
    cn: "CN 31",
    desc: "Urea, ammonia, nitrogenous compounds",
  },
  {
    icon: "⚗️",
    name: "Hydrogen",
    cn: "CN 2804",
    desc: "Pure hydrogen and hydrogen compounds",
  },
  {
    icon: "🔌",
    name: "Electricity",
    cn: "CN 2716",
    desc: "Electrical energy imports into EU",
  },
];

const regulations = [
  {
    icon: "⚡",
    title: "CBAM",
    subtitle: "Carbon Border Adjustment Mechanism",
    desc: "Carbon price equalisation for steel, aluminium, cement, fertilizers, hydrogen and electricity imports into the EU. Full charges from Jan 2026.",
  },
  {
    icon: "🌿",
    title: "EUDR",
    subtitle: "EU Deforestation Regulation",
    desc: "Companies must prove products like soy, palm oil, cattle, cocoa, coffee, wood and rubber are deforestation-free before entering EU market.",
  },
  {
    icon: "🚢",
    title: "ICS2",
    subtitle: "Import Control System 2",
    desc: "EU customs pre-arrival safety and security declarations for all goods entering the EU. Advanced data submission required before arrival.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-sans text-gray-900 overflow-x-hidden">
      {/* NAV — fixed mobile overlap */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span
              className={`font-bold text-xl tracking-tight transition-colors ${scrolled || menuOpen ? "text-gray-900" : "text-white"}`}
            >
              Alpine<span className="text-emerald-400">Scope</span>
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {[
              ["Timeline", "#timeline"],
              ["Sectors", "#sectors"],
              ["EU Regulations", "#regulations"],
              ["About", "#about"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className={`text-lg  font-medium transition-colors whitespace-nowrap ${scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"}`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right side: CTA + hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/cbam")}
              className=" hidden sm:block  bg-emerald-500  hover:bg-emerald-600 text-white px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all hover:shadow-lg whitespace-nowrap"
            >
              Try Free Demo →
            </button>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-1 ${scrolled || menuOpen ? "text-gray-700" : "text-white"}`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
            {[
              ["Timeline", "#timeline"],
              ["Sectors", "#sectors"],
              ["EU Regulations", "#regulations"],
              ["About", "#about"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium text-sm py-1"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-900" />
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            d="M0,320 L0,200 L120,120 L240,180 L360,80 L480,160 L600,40 L720,140 L840,60 L960,150 L1080,90 L1200,170 L1320,100 L1440,180 L1440,320 Z"
            fill="rgba(6,78,59,0.4)"
          />
          <path
            d="M0,320 L0,240 L180,160 L300,220 L420,140 L540,200 L660,100 L780,180 L900,120 L1020,200 L1140,140 L1260,210 L1380,150 L1440,200 L1440,320 Z"
            fill="rgba(4,120,87,0.3)"
          />
          <path
            d="M0,320 L0,280 L200,220 L400,260 L600,200 L800,250 L1000,210 L1200,260 L1440,230 L1440,320 Z"
            fill="rgba(16,185,129,0.2)"
          />
        </svg>

        <div
          className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Beta · Q1 2026 · Free to Use
          </div>
          {/* FIXED: larger text on desktop */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            EU Carbon Compliance
            <br />
            <span className="text-emerald-400">Made Visible</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your import file. AlpineScope AI classifies each product
            against EU Annex I, calculates embedded emissions, and estimates
            your CBAM certificate cost in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/cbam")}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl text-base sm:text-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
            >
              Try Free Demo →
            </button>
            <a
              href="#timeline"
              className="border border-white/30 text-white px-8 py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-white/10 transition-all backdrop-blur"
            >
              Learn about CBAM
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm flex flex-col items-center gap-2">
          <span>Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="bg-gray-900 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.num}>
              <div className="text-2xl sm:text-4xl font-bold text-emerald-400 mb-1">
                {s.num}
              </div>
              <div className="text-xs md:text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT IS CBAM */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-emerald-600 text-xl sm:text-2xl font-bold uppercase tracking-widest mb-4">
            What is CBAM?
          </div>
          <h2 className="text-5xl md:text-5xl font-bold text-gray-900 mb-10 leading-tight">
            The EU carbon border tax and why it matters
          </h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="text-lg sm:text-2xl">
              <p className="text-gray-600 leading-relaxed mb-5">
                The <strong>Carbon Border Adjustment Mechanism (CBAM)</strong>{" "}
                is the EU's answer to carbon leakage — when companies move
                production outside the EU to avoid paying carbon prices under
                the EU Emissions Trading System (ETS).
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                From January 2026, any company importing steel, aluminium,
                cement, fertilizers, hydrogen or electricity into the EU must
                purchase <strong>CBAM certificates</strong> equivalent to the
                carbon price that would have been paid if goods were produced in
                the EU.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With ETS prices at <strong>~€79 per tonne of CO₂</strong>, a
                single shipment of 500 tonnes of steel can carry a CBAM cost of
                over <strong>€87,000</strong>.
              </p>
            </div>
            <div className="bg-gray-200 rounded-2xl p-6 md:p-8 border border-gray-100">
              <div className="text-lg sm:text-2xl font-bold text-gray-500 mb-5 uppercase tracking-wide">
                Cost Calculation Example
              </div>
              <div className="space-y-4 ">
                {[
                  {
                    label: "Import volume",
                    value: "500t steel",
                    color: "bg-blue-50 text-blue-700",
                  },
                  {
                    label: "Emission factor (EU default)",
                    value: "× 2.21 tCO₂/t",
                    color: "bg-orange-50 text-orange-700",
                  },
                  {
                    label: "ETS price",
                    value: "× €79/tCO₂",
                    color: "bg-purple-50 text-purple-700",
                  },
                  {
                    label: "CBAM certificate cost",
                    value: "= €87,245",
                    color: "bg-emerald-50 text-emerald-700",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-md sm:text-lg text-gray-600">
                      {row.label}
                    </span>
                    <span
                      className={`text-md sm:text-lg font-bold px-3 py-1 rounded-lg ${row.color}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-16 md:py-24 px-6 bg-gray-50" id="timeline">
        <div className="max-w-4xl mx-auto">
          <div className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
            Timeline
          </div>
          <h2 className="text-5xl md:text-5xl leading-tight font-bold text-gray-900 mb-12 md:mb-16">
            How the EU is rolling out CBAM
          </h2>
          <div className="relative">
            <div className="absolute left-24 md:left-[7.5rem] top-0 bottom-0 w-0.5 bg-emerald-100" />
            <div className="space-y-10 md:space-y-12">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6 md:gap-8 items-start">
                  <div className="w-20 md:w-28 shrink-0 text-right">
                    <span className="text-sm sm:text-lg font-bold text-emerald-600 bg-emerald-50 px-2 md:px-3 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
                      {item.year}
                    </span>
                  </div>
                  <div className="relative pl-5 md:pl-6">
                    <div className="absolute left-0 top-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow" />
                    <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-2xl leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="py-16 md:py-24 px-6 bg-white" id="sectors">
        <div className="max-w-5xl mx-auto">
          <div className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
            Annex I Coverage
          </div>
          <h2 className="text-5xl md:text-5xl leading-tight font-bold text-gray-900 mb-4">
            Six sectors under CBAM
          </h2>
          <p className="text-gray-500 mb-10 md:mb-12 max-w-xl text-md md:text-2xl">
            All product categories under EU Regulation (EU) 2023/956.
            AlpineScope classifies imports across all six automatically.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {sectors.map((s) => (
              <div
                key={s.name}
                className="border border-gray-300 rounded-2xl p-4 md:p-6 hover:border-emerald-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
              >
                <div className="text-2xl sm:text-5xl mb-2 md:mb-3">
                  {s.icon}
                </div>
                <div className="font-bold text-gray-900 mb-1 text-sm sm:text-2xl">
                  {s.name}
                </div>
                <div className="text-xs sm:text-lg text-emerald-600 font-mono mb-1 md:mb-2">
                  {s.cn}
                </div>
                <div className="text-xs sm:text-lg text-gray-500 hidden sm:block">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EU REGULATIONS */}
      <section className="py-16 md:py-24 px-6 bg-gray-900" id="regulations">
        <div className="max-w-5xl mx-auto">
          <div className="text-emerald-400 text-xs sm:text-lg font-bold uppercase tracking-widest mb-4">
            EU Trade Regulations
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Beyond CBAM
          </h2>
          <p className="text-gray-400 mb-10 md:mb-12 max-w-xl text-sm sm:text-xl">
            European trade compliance is expanding. AlpineScope is built to grow
            with every new regulation.
          </p>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {regulations.map((r) => (
              <div
                key={r.title}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-5 md:p-6 hover:border-emerald-500/40 transition-all"
              >
                <div className="text-2xl sm:text-5xl mb-3 md:mb-4">
                  {r.icon}
                </div>
                <div className="font-bold text-white text-base sm:text-2xl mb-1">
                  {r.title}
                </div>
                <div className="text-emerald-400 text-xs sm:text-lg font-medium mb-2 md:mb-3">
                  {r.subtitle}
                </div>
                <p className="text-gray-400 text-xs sm:text-lg leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 px-6 bg-white" id="about">
        <div className="max-w-5xl mx-auto">
          <div className="text-emerald-600 text-xs sm:text-2xl font-bold uppercase tracking-widest mb-4">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-12 md:mb-16">
            From import file to compliance report in seconds
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                num: "01",
                icon: "📁",
                title: "Upload your imports",
                desc: "CSV or Excel file with your import data. Any column format — our system normalises automatically.",
              },
              {
                num: "02",
                icon: "🤖",
                title: "AI classifies each product",
                desc: "LangGraph pipeline reads product descriptions and searches EU regulation PDFs via RAG to assign correct CN codes.",
              },
              {
                num: "03",
                icon: "📊",
                title: "Get your compliance report",
                desc: "CBAM coverage status, embedded emission factor, ETS cost estimate, and quarterly dashboard per import.",
              },
            ].map((step) => (
              <div key={step.num} className="bg-gray-200 p-3 rounded-xl">
                <div className="text-5xl md:text-6xl font-bold text-gray-50 mb-3 md:mb-4 leading-none">
                  {step.num}
                </div>
                <div className="text-2xl sm:text-4xl mb-2 md:mb-3">
                  {step.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-2xl">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          {/* <div className="mt-12 md:mt-16 bg-gray-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 border border-gray-100">
            <div>
              <div className="font-bold text-gray-900 mb-1 text-sm md:text-base">
                Stack: LangGraph · RAG · Qdrant · GPT-4o · FastAPI · AWS
              </div>
              <div className="text-gray-500 text-xs md:text-sm">
                Production-grade AI infrastructure. Currently in Beta — free to
                use.
              </div>
            </div>
            <button
              onClick={() => router.push("/cbam")}
              className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 text-sm md:text-base"
            >
              Try Free Demo →
            </button>
          </div> */}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-gray-900" />
        <svg
          className="absolute bottom-0 left-0 right-0 w-full opacity-10"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 L0,100 L240,60 L480,120 L720,40 L960,100 L1200,60 L1440,100 L1440,200 Z"
            fill="white"
          />
        </svg>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to know your CBAM exposure?
          </h2>
          <p className="text-white/60 mb-8 md:mb-10 text-base md:text-lg">
            Free to use. No sign-up required. Get a compliance report in under
            60 seconds.
          </p>
          <button
            onClick={() => router.push("/cbam")}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 md:px-10 py-4 rounded-xl text-base md:text-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
          >
            Start Free Demo →
          </button>
          <div className="mt-6 text-white/30 text-sm">
            Currently in Beta · Built with LangGraph · RAG · AWS
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="font-bold text-white text-xl">
              Alpine<span className="text-emerald-400">Scope</span>
            </span>
          </div>
          <div className="flex gap-6">
            <a
              target="_blank"
              href="https://github.com/avinash-palakurthi/cbam_pilot_ai"
              className="text-gray-500 hover:text-emerald-400 text-sm transition-colors"
            >
              GitHub
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/avinashpalakurthi0721"
              className="text-gray-500 hover:text-emerald-400 text-sm transition-colors"
            >
              LinkedIn
            </a>
            <a
              target="_blank"
              href="mailto:palakurthiavinash07@gmail.com"
              className="text-gray-500 hover:text-emerald-400 text-sm transition-colors"
            >
              Contact
            </a>
          </div>
          <div className="text-gray-600 text-md">
            Built by Avinash Palakurthi · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
