/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SelectableCard from './SelectableCard';
import { db } from '../lib/mockDb';

interface WizardProps {
    onComplete: () => void;
    addLog: (message: string, source?: 'SYS' | 'API' | 'CHAIN' | 'SEC', status?: 'info' | 'success' | 'warning' | 'error') => void;
}

// --- Icons & Graphics ---

const Icons = {
    Global: () => <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Shield: () => <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Chart: () => <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
};

// --- Helper Data for Asset Education ---
const getAssetData = (type: string) => {
    switch(type) {
        case 'Luxury Penthouse': return {
            reasons: ["Frazionamento dell'ownership per ticket size accessibili", "Accesso a investitori globali HNWI", "Combinazione di rendita affitto breve + rivalutazione"],
            structureType: "Club Deal SPV",
            structureDesc: "Proprietà detenuta da LLC. Token rappresentano quote di membership con diritto di voto limitato.",
            diagram: "Investors -> SPV (LLC) -> Penthouse Deed"
        };
        case 'Hospitality / Hotel': return {
            reasons: ["Finanziamento ristrutturazioni senza debito bancario", "Programmi loyalty integrati nel token", "Distribuzione dividendi stagionale automatizzata"],
            structureType: "OpCo / PropCo Split",
            structureDesc: "PropCo detiene i muri, OpCo gestisce. Token holders ricevono % del Revenue Netto.",
            diagram: "Investors -> PropCo SPV -> Hotel Asset"
        };
        case 'Development': return {
            reasons: ["Raccolta capitali per costruzione (Forward Funding)", "Riduzione costi del capitale rispetto a mezzanine debt", "Exit parziale anticipata per il developer"],
            structureType: "Development Trust",
            structureDesc: "Emissione di bond convertibili o equity preferenziale legata al completamento lavori.",
            diagram: "Investors -> Dev Fund -> Land + Construction"
        };
        case 'Modular Retreat': return {
            reasons: ["Liquidità immediata per espansione unità", "Modello 'Buy-to-Let' frammentato", "Community ownership"],
            structureType: "Asset-Backed Series",
            structureDesc: "Ogni modulo o gruppo di moduli è una Series LLC separata.",
            diagram: "Investors -> Series LLC -> Modular Unit"
        };
        default: return { // Commercial Office & others
            reasons: ["Efficienza operativa nella distribuzione dividendi", "Liquidità tramite mercato secondario", "Trasparenza totale su costi e ricavi"],
            structureType: "REIT-like SPV",
            structureDesc: "Veicolo standard immobiliare. Token = Azione digitale con diritto economico pieno.",
            diagram: "Investors -> SPV -> Commercial Asset"
        };
    }
};

// --- Sub-Components ---

// 1. Enhanced Risk Engine
const EnhancedRiskDisplay = ({ score, breakdown }: { score: number, breakdown: any }) => {
    const color = score > 75 ? 'text-emerald-500' : score > 40 ? 'text-amber-500' : 'text-rose-500';
    const label = score > 75 ? 'Institutional Grade' : score > 40 ? 'Moderate Risk' : 'High Yield / Speculative';

    return (
        <div className="flex flex-col h-full bg-[#0F1623] p-6 rounded-xl border border-slate-800">
            <h4 className="text-xs text-slate-400 uppercase font-bold mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                AI Risk Assessment Engine
            </h4>
            
            <div className="flex items-center justify-between mb-6">
                 <div className="relative w-24 h-12 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-slate-800 rounded-t-full"></div>
                    <motion.div 
                        initial={{ rotate: -180 }}
                        animate={{ rotate: -180 + (score / 100) * 180 }}
                        transition={{ duration: 1.5, type: "spring" }}
                        className={`absolute top-full left-1/2 w-full h-full -translate-x-1/2 -translate-y-full origin-bottom rounded-t-full bg-current opacity-20 ${color}`}
                    ></motion.div>
                     <motion.div 
                        initial={{ rotate: -180 }}
                        animate={{ rotate: -180 + (score / 100) * 180 }}
                        transition={{ duration: 1.5, type: "spring" }}
                        className={`absolute top-full left-1/2 w-[110%] h-[110%] -translate-x-1/2 -translate-y-full origin-bottom border-t-[8px] border-current ${color}`}
                        style={{ borderRadius: '100% 100% 0 0' }}
                    ></motion.div>
                </div>
                <div className="text-right">
                    <div className={`text-3xl font-bold font-mono ${color}`}>{score}/100</div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {Object.entries(breakdown).map(([key, val]: [string, any]) => (
                    <div key={key} className="group cursor-help">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                            <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-slate-300">{val}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full ${val > 80 ? 'bg-emerald-500' : val > 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-600 italic">
                *Based on simulated historical data for similar asset classes.
            </div>
        </div>
    );
};

// 2. Asset Education Panel (Why Tokenize + Structure)
const AssetEducationPanel = ({ type }: { type: string }) => {
    const data = getAssetData(type);
    
    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-xl p-5">
                <h4 className="text-sm font-bold text-indigo-300 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                    Why Tokenize This Asset?
                </h4>
                <ul className="space-y-3">
                    {data.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {reason}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h4 className="text-sm font-bold text-emerald-400 mb-2">Example Structure Schema</h4>
                <p className="text-xs font-bold text-white mb-1">{data.structureType}</p>
                <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">{data.structureDesc}</p>
                
                {/* Visual Flow Diagram */}
                <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <span className="text-xs">👥</span>
                        </div>
                        <span className="text-[9px] text-slate-500">Investors</span>
                    </div>
                    <div className="h-px bg-slate-700 flex-1 relative">
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-slate-600">Invest €</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded bg-indigo-900/40 border border-indigo-500/40 flex items-center justify-center">
                            <span className="text-xs">🏛️</span>
                        </div>
                        <span className="text-[9px] text-indigo-300">SPV</span>
                    </div>
                    <div className="h-px bg-slate-700 flex-1 relative">
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-slate-600">Owns</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <span className="text-xs">🏢</span>
                        </div>
                        <span className="text-[9px] text-slate-500">Asset</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. Compliance Atlas
const ComplianceAtlas = ({ region }: { region: string }) => {
    const partners = {
        'USA': [
            { name: 'Securitize', role: 'Transfer Agent', badge: 'SEC Reg' },
            { name: 'Oasis Pro', role: 'ATS / Exchange', badge: 'FINRA' },
            { name: 'Anchorage', role: 'Qualified Custody', badge: 'Bank Charter' }
        ],
        'EU': [
            { name: 'Tokeny', role: 'Tokenization Engine', badge: 'T-REX' },
            { name: 'Blocksquare', role: 'Legal Wrapper', badge: 'EU Compliant' },
            { name: 'Coinbase Inst.', role: 'Custody', badge: 'BaFin Lic.' }
        ],
        'Global': [
            { name: 'MANTRA', role: 'RWA Chain', badge: 'VASP' },
            { name: 'Binance Inst.', role: 'Exchange', badge: 'Global' },
            { name: 'Fireblocks', role: 'MPC Wallet', badge: 'SOC2' }
        ]
    }[region] || [];

    return (
        <div className="mt-6 bg-[#0B0F19] border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-lg">🗺️</span> Partner Ecosystem Atlas
                </h4>
                <span className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
                    Region: {region}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Graphic Map Placeholder */}
                <div className="relative bg-slate-900 rounded-lg p-4 flex items-center justify-center min-h-[120px] overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="text-center relative z-10">
                        <span className="text-4xl block mb-2">{region === 'USA' ? '🇺🇸' : region === 'EU' ? '🇪🇺' : '🌍'}</span>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Active Jurisdiction</p>
                    </div>
                </div>

                {/* Partner List */}
                <div className="space-y-3">
                    {partners.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded border border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <div>
                                    <p className="text-xs font-bold text-white">{p.name}</p>
                                    <p className="text-[10px] text-slate-500">{p.role}</p>
                                </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">{p.badge}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 4. ROI Chart (Existing)
const ROIChart = ({ appreciation, yieldRate }: { appreciation: number, yieldRate: number }) => {
    const years = [1, 2, 3, 4, 5];
    const base = 10000; // Example base investment
    
    return (
        <div className="h-48 flex items-end justify-between gap-2 md:gap-4 mt-6">
            {years.map(year => {
                const totalReturn = base * Math.pow(1 + ((appreciation + yieldRate) / 100), year);
                const heightPercent = Math.min(100, (totalReturn / (base * 1.8)) * 100); // Scale logic
                
                return (
                    <div key={year} className="flex-1 flex flex-col items-center group">
                        <div className="text-[10px] text-emerald-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            +{(totalReturn - base).toFixed(0)}€
                        </div>
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.8, delay: year * 0.1 }}
                            className="w-full bg-gradient-to-t from-indigo-900 to-indigo-500 rounded-t-md relative hover:to-emerald-400 transition-colors"
                        >
                            <div className="absolute bottom-0 w-full h-[2px] bg-white/20"></div>
                        </motion.div>
                        <span className="text-xs text-slate-500 mt-2">Y{year}</span>
                    </div>
                )
            })}
        </div>
    );
};

// 5. Tokenomics Donut (Existing)
const TokenomicsDonut = ({ distribution }: { distribution: any }) => {
    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="12" fill="none" />
                <motion.circle 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 0.7 }} 
                    cx="50" cy="50" r="40" 
                    stroke="#4f46e5" strokeWidth="12" fill="none" 
                    strokeDasharray="251.2"
                    className="drop-shadow-lg"
                />
                <motion.circle 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 0.2 }} 
                    cx="50" cy="50" r="40" 
                    stroke="#10b981" strokeWidth="12" fill="none" 
                    strokeDasharray="251.2"
                    strokeDashoffset="-175.8" // 0.7 * 251.2
                />
                <motion.circle 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 0.1 }} 
                    cx="50" cy="50" r="40" 
                    stroke="#3b82f6" strokeWidth="12" fill="none" 
                    strokeDasharray="251.2"
                    strokeDashoffset="-226" 
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-[10px] text-slate-400 uppercase">Allocated</span>
            </div>
        </div>
    );
};

// 6. Investor Preview Card
const InvestorPreviewCard = ({ formData }: { formData: any }) => (
    <div className="bg-[#0F1623] border border-slate-700 rounded-xl overflow-hidden shadow-2xl max-w-sm mx-auto">
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-indigo-400">Investor View Preview</span>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
        </div>
        <div className="h-32 bg-slate-800 relative">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Preview" />
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white">
                LIVE
            </div>
        </div>
        <div className="p-4">
            <div className="mb-3">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wide bg-indigo-400/10 px-1.5 py-0.5 rounded-sm">
                    {formData.type}
                </span>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">{formData.name}</h3>
            <p className="text-slate-500 text-xs mb-3 truncate">{formData.location}</p>
            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                <div>
                    <p className="text-[9px] text-slate-500 uppercase">Target Yield</p>
                    <p className="text-sm font-bold text-emerald-400">{formData.targetYield}%</p>
                </div>
                <div>
                    <p className="text-[9px] text-slate-500 uppercase">Risk Score</p>
                    <p className="text-sm font-bold text-white">{formData.riskScore}/100</p>
                </div>
            </div>
        </div>
    </div>
);

// 7. Pilot Deals Gallery
const PilotDealsGallery = () => {
    const pilots = [
        { name: "NYC Penthouse", loc: "USA", val: "€8.5M", type: "Luxury" },
        { name: "Antigua Retreat", loc: "Caribbean", val: "€12M", type: "Modular" },
        { name: "Tuscan Farm", loc: "Italy", val: "€4.2M", type: "Hospitality" }
    ];

    return (
        <div className="mt-8 border-t border-slate-800 pt-6">
            <h4 className="text-sm font-bold text-white mb-4">Similar Pilot Deals</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pilots.map((deal, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-lg shadow-inner">
                            {i === 0 ? '🏙️' : i === 1 ? '🏝️' : '🍇'}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{deal.name}</p>
                            <p className="text-[10px] text-slate-500">{deal.loc} • {deal.val}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Steps Definition ---
const steps = [
    { id: 1, title: 'Asset' },
    { id: 2, title: 'Legal' },
    { id: 3, title: 'Financials' },
    { id: 4, title: 'Tokenomics' },
    { id: 5, title: 'Operations' },
    { id: 6, title: 'Launch' },
];

// --- Main Wizard Component ---

const OnboardingWizard: React.FC<WizardProps> = ({ onComplete, addLog }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [deployStatus, setDeployStatus] = useState<string[]>([]);
    
    const [formData, setFormData] = useState({
        name: 'Manhattan High-Rise Block A',
        valuation: '15000000',
        location: 'New York, NY',
        type: 'Commercial Office',
        jurisdiction: 'USA',
        riskScore: 85,
        riskBreakdown: { market: 80, asset: 85, sponsor: 90, legal: 88, financial: 82 },
        targetAppreciation: 4.5,
        targetYield: 6.2,
        tokenTicker: 'PROP-NYC1',
        tokenSupply: '150000',
        distribution: { public: 70, issuer: 20, reserve: 10 },
        complianceModules: ['KYC/AML'],
    });

    // Auto-calculate risk based on inputs
    useEffect(() => {
        let score = 70;
        let breakdown = { market: 70, asset: 70, sponsor: 70, legal: 70, financial: 70 };

        if (formData.location.includes('NY') || formData.location.includes('London')) {
            score += 15;
            breakdown.market = 95;
            breakdown.legal = 90;
        }
        if (formData.type === 'Commercial Office') {
            score += 5;
            breakdown.asset = 85;
        }
        if (formData.type === 'Development') {
            score -= 20;
            breakdown.financial = 60; // Higher risk
            breakdown.market = 65;
        }
        
        const avg = Math.floor((breakdown.market + breakdown.asset + breakdown.sponsor + breakdown.legal + breakdown.financial) / 5);
        setFormData(prev => ({ 
            ...prev, 
            riskScore: Math.min(99, avg),
            riskBreakdown: breakdown
        }));
    }, [formData.location, formData.type]);

    // Jurisdiction Logic
    const jurisdictionSpecs = {
        'USA': { reg: 'SEC Reg D/S', tax: 'K-1 / 1099', time: 'Standard', badge: 'bg-blue-500' },
        'EU': { reg: 'MiCA / Prospectus', tax: 'WHT Compliant', time: 'Fast', badge: 'bg-yellow-500' },
        'Global': { reg: 'VASP / BVI', tax: 'Tax Neutral', time: 'Rapid', badge: 'bg-purple-500' }
    };

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep(c => c + 1);
            window.scrollTo(0,0);
        } else {
            startDeploymentSequence();
        }
    };

    const startDeploymentSequence = () => {
        setIsLoading(true);
        // Simulation of the deployment process
        const sequence = [
            'Initializing Tokenization Engine...',
            `Loading Legal Framework: ${jurisdictionSpecs[formData.jurisdiction as keyof typeof jurisdictionSpecs].reg}`,
            'Compiling Smart Contracts (ERC-3643)...',
            'Verifying Identity Oracles...',
            'Deploying Liquidity Pools...',
            'Generating Offering Memorandum...',
            'Finalizing On-Chain Registry...'
        ];
        
        sequence.forEach((msg, idx) => {
            setTimeout(() => {
                setDeployStatus(prev => [...prev, msg]);
                if (idx === sequence.length - 1) {
                    setTimeout(() => {
                        db.addProject({
                            id: `p-${Math.random().toString(36).substr(2, 5)}`,
                            name: formData.name,
                            location: formData.location,
                            valuation: Number(formData.valuation),
                            tokenPrice: 100,
                            apy: formData.targetYield,
                            status: 'Funding',
                            tokensTotal: Number(formData.valuation) / 100,
                            tokensSold: 0,
                            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
                            description: `Tokenized asset structured under ${formData.jurisdiction} law.`,
                            assetClass: formData.type,
                            minInvestment: 5000,
                            partners: { legal: 'Partner Network', tech: 'PropertyDEX', custody: 'Institutional' },
                            isUserCreated: true
                        });
                        onComplete();
                    }, 1000);
                }
            }, idx * 1200);
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-10 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Deal Structuring Suite</h2>
                <p className="text-slate-400 text-sm md:text-base">Advanced simulation engine for real estate asset digitization.</p>
            </div>

            {/* Stepper */}
            <div className="flex justify-between items-center mb-8 md:mb-12 relative px-2 md:px-4 max-w-4xl mx-auto md:mx-0 overflow-hidden">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10" />
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-[#0B0F19] px-2 z-10">
                        <div className={`
                            w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 border-2
                            ${currentStep >= step.id 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                                : 'bg-slate-900 border-slate-700 text-slate-500'}
                        `}>
                            {currentStep > step.id ? "✓" : step.id}
                        </div>
                        <div className="hidden md:block text-center">
                            <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wide ${currentStep >= step.id ? 'text-white' : 'text-slate-500'}`}>{step.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 md:p-8 min-h-[500px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: ASSET & RISK ENGINE */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-bold text-white mb-4">Asset Definition</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Project Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Market Valuation (Fiat)</label>
                                        <input 
                                            type="number" 
                                            value={formData.valuation}
                                            onChange={(e) => setFormData({...formData, valuation: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Location (City, Country)</label>
                                        <input 
                                            type="text" 
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Asset Class</label>
                                        <select 
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none"
                                        >
                                            <option>Commercial Office</option>
                                            <option>Residential Multi-Family</option>
                                            <option>Luxury Penthouse</option>
                                            <option>Hospitality / Hotel</option>
                                            <option>Industrial / Logistics</option>
                                            <option>Development</option>
                                            <option>Modular Retreat</option>
                                        </select>
                                    </div>
                                </div>
                                {/* NEW: Asset Education Panel */}
                                <AssetEducationPanel type={formData.type} />
                            </div>

                            {/* Risk Engine Side Panel */}
                            <div className="h-full">
                                <EnhancedRiskDisplay score={formData.riskScore} breakdown={formData.riskBreakdown} />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: LEGAL & MULTIJURISDICTION */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Jurisdictional Framework</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {Object.entries(jurisdictionSpecs).map(([key, specs]) => (
                                    <div 
                                        key={key}
                                        onClick={() => setFormData({...formData, jurisdiction: key})}
                                        className={`p-6 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
                                            formData.jurisdiction === key 
                                            ? 'bg-indigo-600/10 border-indigo-500' 
                                            : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                        }`}
                                    >
                                        <div className={`absolute top-0 right-0 p-2 rounded-bl-xl text-[10px] font-bold text-white uppercase ${specs.badge}`}>
                                            {key}
                                        </div>
                                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            {key === 'USA' ? <span className="text-xl">🇺🇸</span> : key === 'EU' ? <span className="text-xl">🇪🇺</span> : <span className="text-xl">🌐</span>}
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{key} Framework</h4>
                                        <ul className="space-y-2 text-xs text-slate-400">
                                            <li className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                                                {specs.reg}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                                                Tax: {specs.tax}
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            
                            {/* NEW: Compliance Atlas */}
                            <ComplianceAtlas region={formData.jurisdiction} />

                            <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 text-indigo-400 flex-shrink-0">
                                    <Icons.Shield />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1">Compliance Shield Activated</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        Based on your selection of <strong>{formData.jurisdiction}</strong>, the system has automatically configured the 
                                        whitelist rules for <strong>{jurisdictionSpecs[formData.jurisdiction as keyof typeof jurisdictionSpecs].reg}</strong>. 
                                        Investors will be screened for accreditation and AML checks specific to this region.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: FINANCIAL ROI SIMULATOR */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-end">
                                <h3 className="text-xl font-bold text-white">Financial Projection Engine</h3>
                                <span className="text-xs text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded bg-indigo-500/10">Projected 5-Year Outlook</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1 space-y-6 bg-[#0F1623] p-6 rounded-xl border border-slate-800">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <label className="text-slate-400">Rental Yield (Net)</label>
                                            <span className="text-emerald-400 font-bold">{formData.targetYield}%</span>
                                        </div>
                                        <input 
                                            type="range" min="2" max="15" step="0.1"
                                            value={formData.targetYield}
                                            onChange={(e) => setFormData({...formData, targetYield: Number(e.target.value)})}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <label className="text-slate-400">Capital Appreciation</label>
                                            <span className="text-blue-400 font-bold">{formData.targetAppreciation}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="10" step="0.1"
                                            value={formData.targetAppreciation}
                                            onChange={(e) => setFormData({...formData, targetAppreciation: Number(e.target.value)})}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-slate-800">
                                        <p className="text-xs text-slate-500 mb-2">Total Expected Return (IRR)</p>
                                        <div className="text-3xl font-bold text-white font-mono">
                                            {(formData.targetYield + formData.targetAppreciation).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <ROIChart appreciation={formData.targetAppreciation} yieldRate={formData.targetYield} />
                                    <p className="text-center text-xs text-slate-500 mt-4">
                                        *Simulated projection based on compounding yield + appreciation. Past performance does not guarantee future results.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: TOKENOMICS DESIGNER */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h3 className="text-xl font-bold text-white">Token Supply & Distribution</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">Token Ticker</label>
                                        <input 
                                            type="text" 
                                            value={formData.tokenTicker}
                                            onChange={(e) => setFormData({...formData, tokenTicker: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono uppercase tracking-widest"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">Total Supply</label>
                                        <input 
                                            type="number" 
                                            value={formData.tokenSupply}
                                            onChange={(e) => setFormData({...formData, tokenSupply: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono"
                                        />
                                        <p className="text-xs text-slate-500">
                                            Price per Token: <span className="text-white">€{(Number(formData.valuation) / Number(formData.tokenSupply)).toFixed(2)}</span>
                                        </p>
                                    </div>

                                    {/* Sliders for distribution */}
                                    <div className="space-y-3 pt-4">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Allocation</p>
                                        <div className="flex justify-between text-xs text-indigo-400">
                                            <span>Public Sale</span>
                                            <span>{formData.distribution.public}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div style={{width: `${formData.distribution.public}%`}} className="h-full bg-indigo-500"></div>
                                        </div>
                                        
                                        <div className="flex justify-between text-xs text-emerald-400">
                                            <span>Issuer Retained</span>
                                            <span>{formData.distribution.issuer}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div style={{width: `${formData.distribution.issuer}%`}} className="h-full bg-emerald-500"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-6 bg-[#0F1623] rounded-2xl border border-slate-800">
                                    <TokenomicsDonut distribution={formData.distribution} />
                                    <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                                        <div className="text-center p-2 bg-slate-900 rounded border border-slate-800">
                                            <div className="text-[10px] text-slate-500 uppercase">Hard Cap</div>
                                            <div className="text-sm font-bold text-white">€15M</div>
                                        </div>
                                        <div className="text-center p-2 bg-slate-900 rounded border border-slate-800">
                                            <div className="text-[10px] text-slate-500 uppercase">Soft Cap</div>
                                            <div className="text-sm font-bold text-white">€5M</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: OPERATIONS & LIFECYCLE */}
                    {currentStep === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h3 className="text-xl font-bold text-white">Post-Tokenization Operations</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Automated Dividend Distribution</h4>
                                        <p className="text-slate-400 text-xs mt-1">Smart contracts will automatically distribute USDC yields to token holders' wallets on a quarterly basis. No manual bank transfers required.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Secondary Market Liquidity</h4>
                                        <p className="text-slate-400 text-xs mt-1">Investors can exit positions via the P2P bulletin board after the initial lock-up period (12 months), increasing asset attractiveness.</p>
                                        <div className="mt-2 h-1.5 w-48 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[65%]"></div>
                                        </div>
                                        <span className="text-[10px] text-slate-500">Est. Liquidity Score: High</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Governance & Voting</h4>
                                        <p className="text-slate-400 text-xs mt-1">Token holders can participate in key decisions (e.g., renovations, property manager selection) through on-chain voting.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: LAUNCH & DOCUMENT CHECKLIST */}
                    {currentStep === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="relative"
                        >
                            {isLoading ? (
                                <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl p-8">
                                    <h3 className="text-lg font-bold text-white mb-4 animate-pulse">Launching Deal Room...</h3>
                                    <div className="space-y-2 font-mono text-xs text-emerald-400 w-full max-w-sm">
                                        {deployStatus.map((msg, i) => (
                                            <div key={i}>&gt; {msg}</div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-6">Ready to Launch?</h3>
                                            
                                            {/* Preview Card */}
                                            <InvestorPreviewCard formData={formData} />

                                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
                                                <h4 className="text-sm font-bold text-slate-300 uppercase mb-4">Required Documentation</h4>
                                                <ul className="space-y-3">
                                                    {['Property Appraisal', 'SPV Incorporation Cert', 'Offering Memorandum (Draft)', 'Subscription Agreement', 'Smart Contract Audit'].map((doc, i) => (
                                                        <li key={i} className="flex items-center justify-between text-sm text-slate-400 border-b border-slate-800/50 pb-2 last:border-0">
                                                            <span>{doc}</span>
                                                            <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-500">Pending</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-emerald-400 font-bold">Deal Score</span>
                                                    <span className="text-2xl font-bold text-white">92/100</span>
                                                </div>
                                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-[92%]"></div>
                                                </div>
                                                <p className="text-xs text-emerald-200/70 mt-2">
                                                    Excellent structure. High projected liquidity and robust legal framework ({formData.jurisdiction}).
                                                </p>
                                            </div>

                                            <div className="bg-slate-800 p-4 rounded-xl text-center">
                                                <p className="text-xs text-slate-400 mb-1">Target Launch Date</p>
                                                <p className="text-lg font-bold text-white">Q3 2024</p>
                                            </div>

                                            {/* NEW: Pilot Deals */}
                                            <PilotDealsGallery />
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center">
                {currentStep > 1 && (
                    <button 
                        onClick={() => !isLoading && setCurrentStep(c => c - 1)}
                        className="text-slate-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                        disabled={isLoading}
                    >
                        ← Back
                    </button>
                )}
                <div className="ml-auto">
                     <button 
                        onClick={handleNext}
                        disabled={isLoading}
                        className={`
                            px-8 py-3 rounded-lg font-bold text-white transition-all shadow-lg flex items-center gap-2 text-sm
                            ${isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25 hover:translate-x-1'}
                        `}
                    >
                        {currentStep === 6 ? 'Initialize Deal' : 'Continue'}
                        {!isLoading && <span>→</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;