import React from "react";
import { featureDocs } from "../data/featureDocs";
import "../Energy/VersePortal.css";
import { ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeatureDocsPage() {
  return (
    <section
      id="docs"
      className="min-h-screen bg-gradient-to-b from-[#020702] via-[#061306] to-[#010501] 
                 text-[#eaffd5] font-inter px-6 md:px-16 py-20 relative overflow-hidden"
    >
      {/* 🔙 Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#caff37] border border-[#baff37]/40 
                     px-4 py-2 rounded-xl hover:bg-[#baff37]/10 hover:shadow-[0_0_18px_rgba(186,255,55,0.4)] 
                     transition-all duration-300 backdrop-blur-md"
        >
          <ArrowLeft size={18} />
          <span>Back to Portal</span>
        </Link>
      </div>

      {/* 🌟 Header Section */}
      <div className="text-center mb-16 animate-fadeUp">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#caff37] mb-4 tracking-wide drop-shadow-[0_0_15px_#baff37]">
          ⚡ EnergyVerse Feature Documentation
        </h1>
        <p className="text-[#baff8f] text-lg max-w-4xl mx-auto leading-relaxed">
          Dive into the details of all 17 AI-powered modules — with inputs, models, and
          integration insights. Designed for performance & intelligence.
        </p>
        <div className="w-28 h-1 mx-auto mt-5 bg-[#baff37] rounded-full shadow-[0_0_20px_#baff37]" />
      </div>

      {/* ⚡ Feature Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-20 place-items-center animate-fadeUp"
      >
        {Object.keys(featureDocs).map((key, index) => (
          <div
            key={index}
            className="relative w-full max-w-[580px] group p-6 rounded-2xl border border-[#baff37]/40 
                       bg-[rgba(10,20,10,0.6)] backdrop-blur-lg
                       shadow-[0_0_25px_rgba(186,255,55,0.15)] hover:shadow-[0_0_45px_rgba(186,255,55,0.4)] 
                       hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Glowing Icon */}
            <div
              className="absolute top-3 right-3 opacity-50 text-[#baff37] group-hover:opacity-90 
                         group-hover:scale-110 transition-all duration-500"
            >
              <Zap size={22} />
            </div>

            {/* Title */}
            <h2 className="text-[#caff37] text-xl font-bold mb-3 tracking-wide">
              ⚡ {key}
            </h2>

            {/* Overview */}
            <p className="text-[#d5ffd0] text-sm mb-4 leading-relaxed">
              {featureDocs[key].overview}
            </p>

            {/* Inputs */}
            <div className="border-t border-[#baff37]/25 pt-3 mt-3">
              <h3 className="text-[#aaff60] font-semibold text-sm uppercase tracking-wider mb-2">
                Inputs
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-[#eaffd5] text-sm">
                {featureDocs[key].inputs?.slice(0, 3).map((item, i) => (
                  <li
                    key={i}
                    className="hover:text-[#caff37] transition-colors duration-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Glow */}
            <div
              className="absolute bottom-0 left-0 w-full h-[3px] 
                         bg-gradient-to-r from-transparent via-[#baff37] to-transparent 
                         animate-pulse opacity-80"
            ></div>

            {/* Hover Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#baff37]/10 via-transparent to-transparent 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"
            ></div>
          </div>
        ))}
      </div>
    </section>
  );
}
