import React, { useState, useEffect } from "react";
import { featureDocs } from "../data/featureDocs";
import "../Energy/VersePortal.css";

export default function FeatureDocsModal({ feature, onClose }) {
  const data = featureDocs[feature];
  const [activeTab, setActiveTab] = useState("Overview");

  // ✅ Close on Esc and restore body scroll
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  if (!data) {
    return null;
  }

  return (
    <div
  className="docs-backdrop fixed inset-0 z-[2000] bg-black/60 
             flex items-start justify-center backdrop-blur-sm"
  onClick={(e) => e.stopPropagation()}
>
  <div
    className="docs-modal bg-[#081207]/95 border border-[#baff37]/40 
               rounded-2xl shadow-[0_0_30px_rgba(186,255,55,0.25)] 
               animate-fadeIn relative
               w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto 
               mt-[4vh]"
  >


        {/* Header */}
<div className="flex items-center justify-between px-5 py-4 border-b border-[#baff37]/30 relative">
  <h2 className="text-[#baff37] font-extrabold text-lg md:text-xl pr-10">
    ⚡ {feature}
  </h2>
 <button
  className="close-docs-btn"
  onClick={onClose}
  aria-label="Close"
>
  ×
</button>

</div>



        {/* Tabs */}
        {/* Tabs */}
<div className="docs-tabs">
          {["Overview", "Inputs", "Outputs", "ML Models", "Integration", "Use Cases"].map(
            (tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-6 text-gray-200 leading-relaxed space-y-3">
          {activeTab === "Overview" && <p>{data.overview}</p>}
          {activeTab === "Inputs" && (
            <ul className="list-disc pl-6 space-y-1">
              {data.inputs.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {activeTab === "Outputs" && (
            <ul className="list-disc pl-6 space-y-1">
              {data.outputs.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {activeTab === "ML Models" && (
            <ul className="list-disc pl-6 space-y-1">
              {data.ml.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {activeTab === "Integration" && <p>{data.integration}</p>}
          {activeTab === "Use Cases" && (
            <ul className="list-disc pl-6 space-y-1">
              {data.useCases.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
