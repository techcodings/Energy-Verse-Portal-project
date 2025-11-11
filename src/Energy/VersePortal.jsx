import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { 
  Menu, X, ChevronRight, Sun, Wind, Battery, Zap, TrendingUp, Globe, 
  Activity, AlertTriangle, BarChart3, Database, Leaf, Users, Settings,
  Search, Filter, ArrowRight, Play, Bell, Code, MapPin, LineChart, Shield, 
  Cpu, Cloud, Box, GitBranch, LogOut, User, LayoutDashboard, MessageSquare, Download
} from 'lucide-react';
import './VersePortal.css';
import Auth from '../components/Auth';
import FeatureDocsModal from "../components/FeatureDocsModal"; // ✅ Added import
import { auth, db } from '../config/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";



// Complete feature data with all 17 features (Keep this section unchanged)
const allFeatures = [
    {
        id: 1,
        title: 'Solar Panel Health & Efficiency Monitoring',
        icon: Sun,
        category: 'Solar & Renewable Monitoring',
        color: 'yellow-orange',
        desc: 'Real-time thermal/efficiency analysis with fault detection',
        inputs: ['Sentinel-2/Landsat Imagery', 'IoT Sensor Streams', 'PVGIS Solar Irradiance', 'Open-Meteo Weather'],
        outputs: ['Thermal/Efficiency Heatmap', 'Fault Alerts', 'Predicted Daily Output', 'Time-lapse Evolution'],
        ml: ['ViT', 'Temporal Fusion Transformer', 'Anomaly Detection'],
        datasets: ['Sentinel-2', 'PVGIS', 'Open-Meteo', 'IoT Sensors'],
        integration: 'Backend + User Input',
         demoUrl:"https://solar-heath-efficiency-monitoring.netlify.app/",
        tags: ['Monitoring', 'Solar', 'AI', 'Real-time']
    },
   {
    id: 2,
    title: 'Solar & Wind Power Generation Forecast',
    icon: Wind,
    category: 'Energy Forecasting & Optimization',
    color: 'blue-cyan',
    desc: '7-day generation predictions with confidence intervals',
    inputs: ['Open-Meteo Weather', 'NREL/OpenEI Historical Data', 'PVGIS & Global Wind Atlas'],
    outputs: ['7-day Forecast', 'Peak Hour Analysis', 'Animated Regional Map', 'Confidence Intervals'],
    ml: ['Temporal Fusion Transformer', 'GNN'],
    datasets: ['Open-Meteo', 'NREL', 'Global Wind Atlas'],
    integration: 'Backend',

    // ✅ Add this line
    demoUrl: "https://solar-wind-powers.netlify.app/",

    tags: ['Forecasting', 'Solar', 'Wind', 'Prediction']
},


    { id: 3, title: 'EV Charging Demand Prediction', icon: Battery, category: 'EV & Grid Management', color: 'green-emerald', desc: 'Regional demand heatmaps with peak load predictions', inputs: ['EV Registration Data', 'Open Charge Map', 'OSM Road Network', 'Historical Usage'], outputs: ['Demand Heatmap', 'Peak Load Predictions', 'Scenario Simulations', 'TTS Alerts'], ml: ['LSTM', 'Graph Transformer', 'Multimodal Fusion'], datasets: ['Open Charge Map', 'OpenStreetMap', 'Open-Meteo'], integration: 'Backend + User Input',demoUrl:"https://ev-charging-demand-prediction.netlify.app/", tags: ['EV', 'Prediction', 'Grid', 'Demand'] },
    { id: 4, title: 'Grid & Microgrid Optimization Advisor', icon: Zap, category: 'Energy Forecasting & Optimization', color: 'emerald-teal', desc: 'Load balancing and battery storage scheduling', inputs: ['Real-time Solar/Wind Generation', 'EV Demand', 'Grid Topology', 'Energy Pricing'], outputs: ['Load Balancing Charts', 'Battery Schedule', 'Grid Stress Metrics', 'Scenario Simulations'], ml: ['Reinforcement Learning', 'Multimodal Transformer'], datasets: ['OPSD', 'ENTSO-E', 'Electricity Maps'], integration: 'Backend + User Input',demoUrl: "https://grid-micorgrid-optimization.netlify.app/", tags: ['Grid', 'Optimization', 'Battery', 'AI'] },
    { id: 5, title: 'Energy Market & Policy Impact Simulator', icon: TrendingUp, category: 'Energy Forecasting & Optimization', color: 'indigo-purple', desc: 'Policy scenarios and supply/demand projections', inputs: ['Historical Market Data', 'Policy Reports', 'Satellite Imagery', 'ERA5 Weather'], outputs: ['Policy Impact Maps', 'Pricing Projections', 'Scenario Dashboards', 'Text Summaries'], ml: ['RAG', 'LLM', 'Temporal Transformer'], datasets: ['IRENA', 'OpenEI', 'World Bank', 'IEA'], integration: 'Backend + User Input',demoUrl:"https://energy-markets-simulator.netlify.app/", tags: ['Market', 'Policy', 'Economics', 'Simulation'] },
    { id: 6, title: 'Climate & Renewable Anomaly Detector', icon: AlertTriangle, category: 'Solar & Renewable Monitoring', color: 'red-pink', desc: 'Abnormal generation detection with severity ranking', inputs: ['Real-time Weather', 'Satellite Imagery', 'Grid Output Data', 'Climate Event Streams'], outputs: ['Anomaly Heatmaps', 'Temporal Plots', 'Severity Rankings', 'Automated Alerts'], ml: ['Temporal GNN', 'Anomaly Detection Transformer'], datasets: ['Sentinel-2', 'ERA5', 'NASA FIRMS', 'NOAA'], integration: 'Backend',demoUrl:"https://climate-renewable-detect.netlify.app/", tags: ['Anomaly', 'Climate', 'Detection', 'Alerts'] },
    { id: 7, title: 'Knowledge Graph of Energy Events', icon: GitBranch, category: 'Analytics & Intelligence', color: 'violet-purple', desc: 'Interactive event networks with timeline analysis', inputs: ['Research Papers', 'Grid Events', 'Policy Information', 'Government APIs'], outputs: ['Interactive Graph', 'Event Timelines', 'Node Summaries', 'Network Metrics'], ml: ['RAG', 'Graph Embedding', 'LLM'], datasets: ['arXiv', 'Government APIs', 'Wikidata'], integration: 'Backend + User Upload', tags: ['Knowledge Graph', 'Events', 'Research', 'AI'] },
    { id: 8, title: 'Multilingual Energy Assistant', icon: MessageSquare, category: 'Analytics & Intelligence', color: 'pink-rose', desc: 'English/Bangla AI assistant with visual analytics', inputs: ['Text Queries (English/Bangla)', 'Satellite Images', 'Grid Maps', 'OpenEI/IRENA Data'], outputs: ['Text Answers', 'Annotated Maps', 'Interactive Charts', 'TTS Audio'], ml: ['LLM', 'Vision-Language Model', 'LangChain Agents'], datasets: ['OpenEI', 'IRENA', 'BanglaBERT'], integration: 'Backend + User Input',demoUrl:"https://multilingual-energy-assistant.netlify.app/", tags: ['AI Assistant', 'Multilingual', 'NLP', 'Interactive'] },
    { id: 9, title: 'EV Fleet & Charging Station Optimization', icon: Activity, category: 'EV & Grid Management', color: 'blue-indigo', desc: 'Optimal routing and charging schedules for fleets', inputs: ['EV Fleet Data', 'Open Charge Map', 'OSM Networks', 'Real-time Generation'], outputs: ['Routing Maps', 'Fleet Utilization', 'Schedule Tables', 'Cost Predictions'], ml: ['Reinforcement Learning', 'Temporal GNN'], datasets: ['Open Charge Map', 'GTFS', 'HERE Routing'], integration: 'Backend + User Upload',demoUrl:"https://ev-fleets-charging-stations.netlify.app/", tags: ['EV', 'Fleet', 'Routing', 'Optimization'] },
    { id: 10, title: 'Risk & Alert Dashboard', icon: Shield, category: 'Risk Management', color: 'red-orange', desc: 'Unified risk monitoring with real-time notifications', inputs: ['Aggregated Feature Outputs', 'Satellite Feeds', 'Grid Maps', 'Market Data'], outputs: ['Interactive Dashboard', 'Risk Scores', 'Time Series Graphs', 'Push Notifications'], ml: ['LLM', 'Dashboard Agent', 'Multimodal Fusion'], datasets: ['Sentinel-2', 'OpenEI', 'IRENA', 'Twilio'], integration: 'Backend Aggregation',demoUrl:"https://risk-alerts-dashboard.netlify.app/", tags: ['Risk', 'Dashboard', 'Alerts', 'Monitoring'] },
    { id: 11, title: 'Battery / Storage Health Monitoring', icon: Battery, category: 'Analytics & Intelligence', color: 'amber-yellow', desc: 'SOC/SOH predictions with degradation tracking', inputs: ['Battery Logs (SOC/Voltage/Current)', 'Historical Battery Data', 'PV Storage Output'], outputs: ['SOC/SOH Predictions', 'RUL Estimates', 'Fault Probability', 'Performance Summary'], ml: ['Time Series Analysis', 'Predictive Models'], datasets: ['Open EV BMS', 'IoT Battery Logs'], integration: 'Backend + User Input',demoUrl:"https://battery-storage-monitor.netlify.app/", tags: ['Battery', 'Health', 'Storage', 'Prediction'] },
    { id: 12, title: 'Solar & Wind Asset Predictive Maintenance', icon: Settings, category: 'Solar & Renewable Monitoring', color: 'purple-indigo', desc: 'Failure prediction and maintenance prioritization', inputs: ['IoT Sensor Streams', 'Satellite Imagery', 'PVGIS Data', 'Weather Correlation'], outputs: ['Failure Probability', 'Maintenance Priority', 'Efficiency Drop', 'Risk Clusters'], ml: ['Predictive Maintenance Models', 'Anomaly Detection'], datasets: ['Sentinel-2', 'PVGIS', 'Global Wind Atlas'], integration: 'Backend + User Input',demoUrl:"https://solar-wind-assest-predictive.netlify.app/", tags: ['Maintenance', 'Predictive', 'Assets', 'Solar'] },
    { id: 13, title: 'Renewable Curtailment Analysis & Flexibility', icon: BarChart3, category: 'Energy Forecasting & Optimization', color: 'cyan-blue', desc: 'Curtailment reduction and flexible load optimization', inputs: ['Generation vs Demand', 'Weather Forecasts', 'Grid Load Profiles', 'Flexible Load Options'], outputs: ['Excess Generation Analysis', 'Curtailment Predictions', 'Cost Savings', 'Mitigation Actions'], ml: ['Optimization Algorithms', 'Scenario Analysis'], datasets: ['NREL', 'OpenEI', 'OPSD', 'PVGIS'], integration: 'Backend + User Input',demoUrl:"https://renewable-curtailment-analysis.netlify.app/", tags: ['Curtailment', 'Flexibility', 'Optimization', 'Grid'] },
    { id: 14, title: 'EV Driver Behavior & Incentive Analytics', icon: Users, category: 'EV & Grid Management', color: 'orange-red', desc: 'Usage patterns and incentive strategy recommendations', inputs: ['EV Mobility Datasets', 'Charging Station Data', 'Road Networks', 'Weather Effects'], outputs: ['Charging Patterns', 'Peak Usage Analysis', 'Incentive Strategies', 'Demand Shifts'], ml: ['Behavior Analysis', 'Recommendation Systems'], datasets: ['Open Charge Map', 'OSM', 'Mobility Data'], integration: 'Backend + User Input',demoUrl:"https://ev-behaviour-dashboard.netlify.app/", tags: ['EV', 'Behavior', 'Analytics', 'Incentives'] },
    { id: 15, title: 'DER Integration & Microgrid Simulation', icon: Database, category: 'Energy Forecasting & Optimization', color: 'teal-green', desc: 'Distributed energy resource management and optimization', inputs: ['Rooftop PV Generation', 'Home Battery Logs', 'EV Fleet Data', 'Microgrid Topology'], outputs: ['DER Contribution', 'Load vs Generation', 'Energy Balance', 'Dispatch Schedule'], ml: ['Microgrid Simulation', 'Optimization'], datasets: ['PVGIS', 'Battery Logs', 'EV Data'], integration: 'Backend + User Input',demoUrl:"https://der-microgrid-dashboard.netlify.app/", tags: ['DER', 'Microgrid', 'Simulation', 'Integration'] },
    { id: 16, title: 'Renewable Energy CO₂ Impact Dashboard', icon: Leaf, category: 'Analytics & Intelligence', color: 'green-dark', desc: 'Emissions tracking and environmental impact analysis', inputs: ['Generation Data', 'Grid Emission Factors', 'Weather Data', 'Regional Analysis'], outputs: ['CO₂ Savings', 'Renewable Share', 'Emission Reduction', 'Policy Impact'], ml: ['Impact Analysis', 'Scenario Modeling'], datasets: ['OpenEI', 'IRENA', 'Open-Meteo'], integration: 'Backend + User Input',demoUrl:"https://renewable-energy-co2-dashboard.netlify.app/", tags: ['CO₂', 'Environment', 'Impact', 'Dashboard'] },
    { id: 17, title: 'Real-Time Fault / Anomaly Explanation', icon: Cpu, category: 'Risk Management', color: 'rose-pink', desc: 'Automated fault detection with cause analysis', inputs: ['Sensor Logs', 'Satellite Imagery', 'Weather Data', 'Grid Data'], outputs: ['Anomaly Location', 'Severity Ranking', 'Cause Analysis', 'Mitigation Actions'], ml: ['Explainable AI', 'Fault Detection'], datasets: ['IoT Sensors', 'Sentinel-2', 'OpenEI'], integration: 'Backend + User Input',demoUrl:"https://realtime-fault-anomaly.netlify.app/", tags: ['Fault', 'Anomaly', 'Explanation', 'Real-time'] }
];

// Group features by category
const featureCategories = allFeatures.reduce((acc, feature) => {
  if (!acc[feature.category]) {
    acc[feature.category] = [];
  }
  acc[feature.category].push(feature);
  return acc;
}, {});

// --- New User Menu Component ---
const UserMenu = ({ user, onLogout, onClose }) => {
  return (
    <div className="user-menu-dropdown">
      
      <div className="user-info">
        <User size={20} />
        <span><b>{user.displayName || user.email?.split('@')[0]}</b></span>
        <p className="user-email">{user.email}</p>
      </div>

      <div className="menu-divider"></div>

      <a href="#dashboard" onClick={onClose} className="menu-item">
        <Activity size={16} /> Dashboard
      </a>

      <a href="#profile" onClick={onClose} className="menu-item">
        <Settings size={16} /> Profile Settings
      </a>

      {localStorage.getItem("role") === "admin" && (
  <a href="/admin" onClick={onClose} className="menu-item">
    <LayoutDashboard size={16} /> Admin Panel
  </a>
)}


      <div className="menu-divider"></div>

      <button onClick={onLogout} className="menu-item logout-btn">
        <LogOut size={16} /> Logout
      </button>

    </div>
  );
};

// ------------------------------

const Header = ({ mobileMenuOpen, setMobileMenuOpen, setShowSearch, onUserButtonClick, user, showUserMenu, setShowUserMenu }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = (e) => {
    if (user) {
      // If user is logged in, toggle the dropdown menu
      e.stopPropagation(); 
      setShowUserMenu(!showUserMenu);
    } else {
      // If user is logged out, show the Auth modal
      onUserButtonClick(); 
    }
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo">
            <div className="logo-icon">
              <Zap className="icon" />
            </div>
            <div className="logo-text">
              <h1>EnergyVerse </h1>
              <p>AI-Powered Energy Platform</p>
            </div>
          </div>

          <nav className="header-nav">
            <a href="#features">Features</a>
            <a href="#capabilities">Capabilities</a>
           
<Link
  to="/docs"
  className="px-4 py-2 rounded-md font-semibold text-[#caff37] 
             border border-[#baff37]/40 hover:border-[#eaff91]/70
             hover:text-[#eaff91] hover:shadow-[0_0_12px_rgba(186,255,55,0.6)]
             bg-transparent transition-all duration-300 ease-in-out
             hover:bg-[#baff37]/10"
>
   Documentation
</Link>

            <button className="icon-btn" onClick={() => setShowSearch(true)}>
              <Search size={20} />
            </button>
            
            {/* ↓ USER CONTROL CONTAINER */}
            <div className="user-control">
              <button 
                className="btn-primary" 
                onClick={handleUserClick} // Use the new conditional handler
              >
                {user ? `Hello, ${user.displayName || user.email?.split('@')[0]}` : 'Get Started'}
              </button>
              {user && showUserMenu && (
                <UserMenu 
                  user={user} 
                  onLogout={onUserButtonClick} // Passes the main handler which performs logout when user exists
                  onClose={() => setShowUserMenu(false)}
                />
              )}
            </div>
            {/* ↑ USER CONTROL CONTAINER */}
          </nav>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#capabilities" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
          <a href="#integration" onClick={() => setMobileMenuOpen(false)}>Integration</a>
          <a href="#docs" onClick={() => setMobileMenuOpen(false)}>Documentation</a>
          {/* Mobile button should either log out or open Auth */}
          <button className="btn-primary mobile" onClick={() => { onUserButtonClick(); setMobileMenuOpen(false); }}>
            {user ? 'Logout' : 'Get Started'}
          </button>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  // ✅ Smooth scroll to Features section
  const scrollToFeatures = () => {
    const section = document.querySelector("#features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-particles"></div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          <span>17 AI-Powered Features • 50+ Data Sources • 12+ ML Models</span>
        </div>

        <h1 className="hero-title">
          The Future of<br />
          <span className="gradient-text">Renewable Energy Intelligence</span>
        </h1>

        <p className="hero-description">
          Comprehensive multimodal AI platform for solar monitoring, wind forecasting, 
          EV optimization, and intelligent grid management. Powered by cutting-edge ML models 
          and real-time data integration from 30+ global APIs.
        </p>

        <div className="hero-buttons">
          {/* ✅ Explore button now only scrolls — never logs out */}
          <button onClick={scrollToFeatures} className="btn-glitch large">
            <span>Explore Platform</span>
            <ArrowRight size={20} />
          </button>

          <a
            href="/app/app-release.apk"
            download
            className="btn-download large"
            rel="noopener"
          >
            <Download size={20} />
            <span>Download Android App</span>
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-icon"><Zap size={24} /></div>
            <div className="stat-value">17+</div>
            <div className="stat-label">AI Features</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><Database size={24} /></div>
            <div className="stat-value">50+</div>
            <div className="stat-label">Data Sources</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><Cpu size={24} /></div>
            <div className="stat-value">12+</div>
            <div className="stat-label">ML Models</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><Cloud size={24} /></div>
            <div className="stat-value">30+</div>
            <div className="stat-label">API Integrations</div>
          </div>
        </div>

        <div className="hero-trusted">
          <p>Trusted by leading energy organizations worldwide</p>
          <div className="trusted-logos">
            <div className="logo-placeholder">NREL</div>
            <div className="logo-placeholder">IRENA</div>
            <div className="logo-placeholder">IEA</div>
            <div className="logo-placeholder">OpenEI</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SearchModal = ({ isOpen, onClose, features }) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredFeatures = useMemo(() => {
      if (!searchQuery) return features;
      const query = searchQuery.toLowerCase();
      return features.filter(f => 
        f.title.toLowerCase().includes(query) ||
        f.desc.toLowerCase().includes(query) ||
        f.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }, [searchQuery, features]);

    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="search-modal" onClick={e => e.stopPropagation()}>
          <div className="search-header">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search features, capabilities, or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="search-results">
            {filteredFeatures.length > 0 ? (
              filteredFeatures.map(feature => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="search-result-item">
                    <div className={`result-icon ${feature.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="result-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.desc}</p>
                      <div className="result-tags">
                        {feature.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-results">
                <p>No features found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

const FeatureModal = ({ feature, isOpen, onClose }) => {
  const navigate = useNavigate(); // ✅ Hook 1

  // ✅ Hook 2 (must come before any return)
  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // ✅ Navigation handler
  const handleViewDocs = () => {
    onClose(); // close modal first
    navigate("/docs", { state: { feature: feature.title } });
  };

  // ✅ Now safe to return early
  if (!isOpen || !feature) return null;

  const Icon = feature.icon;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feature-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className={`modal-icon ${feature.color}`}>
            <Icon size={32} />
          </div>
          <div>
            <span className="modal-category">{feature.category}</span>
            <h2>{feature.title}</h2>
            <p>{feature.desc}</p>
          </div>
        </div>

        <div className="modal-content">
          <div className="modal-section">
            <h3><Box size={20} /> Inputs</h3>
            <ul>
              {feature.inputs.map((input, idx) => (
                <li key={idx}>{input}</li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h3><BarChart3 size={20} /> Outputs</h3>
            <ul>
              {feature.outputs.map((output, idx) => (
                <li key={idx}>{output}</li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h3><Cpu size={20} /> ML Technologies</h3>
            <div className="tech-tags">
              {feature.ml.map((tech, idx) => (
                <span key={idx} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h3><Database size={20} /> Data Sources</h3>
            <div className="dataset-grid">
              {feature.datasets.map((dataset, idx) => (
                <div key={idx} className="dataset-item">
                  <Cloud size={16} />
                  <span>{dataset}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h3><Code size={20} /> Integration Mode</h3>
            <p className="integration-mode">{feature.integration}</p>
          </div>

          <div className="modal-actions">
            <button
  className="btn-primary"
  onClick={() => {
    // ✅ Preserve feature reference for back navigation
    const base = window.location.origin;
    const featureParam = `feature=${encodeURIComponent(feature.id)}`;
    const portalUrl = `${base}/?${featureParam}`;
    const finalUrl = `${feature.demoUrl}?return=${encodeURIComponent(portalUrl)}`;
    window.open(finalUrl, "_blank"); // open in new tab
  }}
>
  <Play size={18} /> Try Demo
</button>


            <button onClick={handleViewDocs} className="view-docs-btn">
              📘 View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const FeatureCard = ({ feature, index, onClick }) => {
  const Icon = feature.icon;
  
  return (
    <div
  className="feature-card"
  data-feature-id={feature.id}
  onClick={() => onClick(feature)}
>

      <div className={`card-overlay ${feature.color}`}></div>
      
      <div className="card-content">
        <div className="card-header">
          <div className={`card-icon ${feature.color}`}>
            <Icon size={24} />
          </div>
          <span className="card-number">#{feature.id}</span>
        </div>
        
        <h3 className="card-title">{feature.title}</h3>
        
        <p className="card-description">{feature.desc}</p>
        
        <div className="card-tags">
          {feature.tags.slice(0, 2).map(tag => (
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>

        <div className="card-footer">
          <div className="card-tech">
            <Cpu size={14} />
            <span>{feature.ml[0]}</span>
          </div>
          <div className="card-link">
            <span>Learn More</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const [activeCategory, setActiveCategory] = useState('All Features');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ['All Features', ...Object.keys(featureCategories)];
  
  const displayedFeatures = activeCategory === 'All Features' 
    ? allFeatures 
    : featureCategories[activeCategory];

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setShowModal(true);
  };

  return (
    <>
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <div className="section-badge">
              <Filter size={16} />
              <span>Platform Features</span>
            </div>
            <h2 data-text="Comprehensive Energy Intelligence Suite">
              Comprehensive Energy Intelligence Suite
            </h2>
            <p>
              17 advanced AI-powered features for complete renewable energy management, 
              from solar monitoring to grid optimization and EV fleet management
            </p>
          </div>

          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              >
                {category}
                <span className="tab-count">
                  {category === 'All Features' ? allFeatures.length : featureCategories[category]?.length || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="features-grid">
            {displayedFeatures.map((feature, index) => (
              <FeatureCard 
                key={feature.id} 
                feature={feature} 
                index={index}
                onClick={handleFeatureClick}
              />
            ))}
          </div>
        </div>
      </section>

      <FeatureModal 
        feature={selectedFeature}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

const CapabilitiesSection = () => {
  const capabilities = [
    {
      icon: LineChart,
      title: 'Advanced Analytics',
      desc: 'Real-time data processing with predictive analytics and ML-driven insights',
      features: ['Time Series Forecasting', 'Anomaly Detection', 'Predictive Maintenance']
    },
    {
      icon: MapPin,
      title: 'Geospatial Intelligence',
      desc: 'Satellite imagery analysis with interactive mapping and spatial correlation',
      features: ['Sentinel-2 Integration', 'GeoJSON Support', 'Regional Analysis']
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      desc: 'Proactive notifications with customizable thresholds and multi-channel delivery',
      features: ['Real-time Alerts', 'SMS/Push/Email', 'Severity Ranking']
    },
    {
      icon: Code,
      title: 'API-First Design',
      desc: 'RESTful APIs with comprehensive documentation and SDK support',
      features: ['REST API', 'WebSocket', 'GraphQL Support']
    }
  ];

  return (
    <section id="capabilities" className="capabilities-section">
      <div className="capabilities-container">
        <div className="section-header">
          <div className="section-badge">
            <Shield size={16} />
            <span>Core Capabilities</span>
          </div>
          <h2>Built for Enterprise Scale</h2>
          <p>Production-ready infrastructure with enterprise-grade security and performance</p>
        </div>

        <div className="capabilities-grid">
          {capabilities.map((capability, idx) => {
            const Icon = capability.icon;
            return (
              <div key={idx} className="capability-card">
                <div className="capability-icon">
                  <Icon size={28} />
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.desc}</p>
                <ul className="capability-features">
                  {capability.features.map((feature, i) => (
                    <li key={i}>
                      <ChevronRight size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column main">
            <div className="footer-logo">
              <div className="logo-icon">
                <Zap className="icon" />
              </div>
              <span>EnergyVerse</span>
            </div>
            <p className="footer-description">
              AI-powered renewable energy and EV management platform for a sustainable future.
              Integrating 50+ data sources with 12+ ML models for comprehensive energy intelligence.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="GitHub">GitHub</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Platform</h3>
            <ul>
              <li><a href="#features">All Features</a></li>
              <li><Link
  to="/docs"
  className="px-4 py-2 rounded-md font-semibold text-[#caff37] 
             border border-[#baff37]/40 hover:border-[#eaff91]/70
             hover:text-[#eaff91] hover:shadow-[0_0_12px_rgba(186,255,55,0.6)]
             bg-transparent transition-all duration-300 ease-in-out
             hover:bg-[#baff37]/10"
>
   Documentation
</Link></li>

            </ul>
          </div>

          

          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#partners">Partners</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Data Sources</h3>
            <ul>
              <li><a href="#">Sentinel-2 / Landsat</a></li>
              <li><a href="#">NREL / OpenEI</a></li>
              <li><a href="#">Open-Meteo</a></li>
              <li><a href="#">IRENA / IEA</a></li>
              <li><a href="#">View All →</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 EnergyVerse. All rights reserved. Built with 💚 for a sustainable future.</p>
          <div className="footer-links">
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#privacy">Privacy</a>
            <span>•</span>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function VersePortal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAuth, setShowAuth] = useState(false); 
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false); // New state for dropdown
const navigate = useNavigate();
const location = useLocation();

  // 1. Firebase Auth Listener for persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return unsubscribe;
  }, []);
  // ✅ Scroll to a specific feature when coming back from demo
// ✅ Ignore ?feature parameter and always start at top
// ✅ Scroll to feature when ?feature=id is in URL
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const featureId = params.get("feature");

  // Run only if a feature ID is in the URL and user is logged in
  if (user && featureId) {
    const tryScroll = () => {
      const card = document.querySelector(`[data-feature-id="${featureId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("highlight-card");
        setTimeout(() => card.classList.remove("highlight-card"), 2000);
        return true;
      }
      return false;
    };

    // Try immediately, then again after a short delay (for rendering)
    if (!tryScroll()) {
      setTimeout(tryScroll, 1000);
    }
  }
}, [location.search, user]);


  // 2. Main handler for 'Get Started' / 'Hello, User' button
  const handleUserButtonClick = async () => {
   if (user) {
  try {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("role");       // ✅ Clear admin token
    setShowUserMenu(false);
    navigate("/");                          // ✅ Redirect to home
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    alert('Failed to log out.');
  }
}
 else {
      // User is logged out: Show Auth Modal
      setShowAuth(true);
    }
  };

  // 3. Callback after successful login/signup from Auth.jsx
const handleAuthSuccess = async (userData) => {
  setUser(userData);
  setShowAuth(false);

  try {
    // ✅ Get stored role from Firestore users collection
    const userRef = doc(db, "users", userData.uid);
    const userSnap = await getDoc(userRef);

    const role = userSnap.exists() ? userSnap.data().role : "user";

    // ✅ Store role in localStorage
    localStorage.setItem("role", role);

    // ✅ Redirect based on role
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/"); // or dashboard
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
};


  
  // 4. Close the UserMenu when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
        // Only close if we click outside the dropdown and the button
        if (showUserMenu && !e.target.closest('.user-control')) {
            setShowUserMenu(false);
        }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showUserMenu]);
// 🔒 If user is not logged in, show only the Auth page
if (!user) {
  return (
    <div className="auth-only-screen">
      <Auth 
        onClose={() => setShowAuth(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

// ✅ Once logged in, show the full website
return (
  <div className="app">
    <Header 
      mobileMenuOpen={mobileMenuOpen} 
      setMobileMenuOpen={setMobileMenuOpen}
      setShowSearch={setShowSearch}
      onUserButtonClick={handleUserButtonClick}
      user={user}
      showUserMenu={showUserMenu}
      setShowUserMenu={setShowUserMenu}
    />

    <Hero />

    <FeaturesSection />
    <CapabilitiesSection />
    <Footer />
    
    <SearchModal 
      isOpen={showSearch}
      onClose={() => setShowSearch(false)}
      features={allFeatures}
    />
  </div>
);

}