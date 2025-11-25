/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { motion } from 'framer-motion';

// --- Animated Icons ---

const iconDrawVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
        pathLength: 1, 
        opacity: 1, 
        transition: { 
            pathLength: { duration: 1.5, ease: "easeInOut" },
            opacity: { duration: 0.5 }
        } 
    }
};

const AnimatedBuildingIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M17 21h2m-2 0h-5m-9 0H3m2 0h5" />
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </motion.svg>
);

const AnimatedLegalIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6" />
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M20 12V8l-4-4H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2v-8" />
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M16 4v4h4" />
    </motion.svg>
);

const AnimatedTechIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </motion.svg>
);

const AnimatedDistributionIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <motion.circle variants={iconDrawVariant} cx="12" cy="12" r="3" />
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M12 9V5a2 2 0 012-2h1" />
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M15 12h4a2 2 0 012 2v1" />
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M12 15v4a2 2 0 01-2 2H9" />
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M9 12H5a2 2 0 01-2-2V9" />
    </motion.svg>
);

const AnimatedLifecycleIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <motion.path variants={iconDrawVariant} strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </motion.svg>
);

// --- Data ---

interface Deliverable {
    label: string;
    value: string;
}

interface Step {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    details: string[];
    deliverables: { input: string; output: string };
    icon: React.ElementType;
    color: string;
    gradient: string;
    delay: number;
}

const steps: Step[] = [
    {
        id: 1,
        title: "Deal Origination",
        subtitle: "Asset & Due Diligence",
        description: "Analisi profonda dell'immobile. Verifichiamo la proprietà, valutiamo il rendimento storico e strutturiamo il business plan finanziario.",
        details: ["Valutazione Immobiliare Certificata", "Audit Legale & Catastale", "Analisi di Sostenibilità ESG"],
        deliverables: { input: "Visura / Atto Notarile", output: "Feasibility Report" },
        icon: AnimatedBuildingIcon,
        color: "text-emerald-400",
        gradient: "from-emerald-500/20 to-emerald-500/5",
        delay: 0
    },
    {
        id: 2,
        title: "Legal Structuring",
        subtitle: "SPV & Compliance",
        description: "Creazione del veicolo giuridico (SPV) che deterrà l'immobile. Definizione dei diritti degli investitori (equity vs debt) nel rispetto delle normative locali.",
        details: ["Costituzione SPV (SRL/LLC)", "Term Sheet & Offering Memo", "Compliance Regulatoria (Consob/SEC)"],
        deliverables: { input: "Feasibility Report", output: "Legal Wrapper (SPV)" },
        icon: AnimatedLegalIcon,
        color: "text-blue-400",
        gradient: "from-blue-500/20 to-blue-500/5",
        delay: 0.2
    },
    {
        id: 3,
        title: "Tech Deployment",
        subtitle: "Smart Contract Minting",
        description: "Trasformazione delle quote societarie in token programmabili (ERC-1400/3643). Configurazione delle regole di compliance on-chain (Whitelist).",
        details: ["Sviluppo Smart Contract", "Security Audit", "Integrazione Custodia Wallet"],
        deliverables: { input: "Cap Table", output: "Security Token" },
        icon: AnimatedTechIcon,
        color: "text-purple-400",
        gradient: "from-purple-500/20 to-purple-500/5",
        delay: 0.4
    },
    {
        id: 4,
        title: "Primary Offering",
        subtitle: "Distribution & Sale",
        description: "Lancio dell'offerta sul marketplace. Gli investitori accreditati superano il KYC e acquistano quote in valuta fiat o crypto stabile.",
        details: ["KYC/AML Automatizzato", "Escrow & Settlement", "Investitor Relations"],
        deliverables: { input: "Security Token", output: "Capital Raised" },
        icon: AnimatedDistributionIcon,
        color: "text-amber-400",
        gradient: "from-amber-500/20 to-amber-500/5",
        delay: 0.6
    },
    {
        id: 5,
        title: "Asset Management",
        subtitle: "Lifecycle & Dividends",
        description: "Gestione post-vendita. Distribuzione automatica degli affitti agli holder e abilitazione del mercato secondario per la liquidità.",
        details: ["Dividendi Automatizzati", "Mercato Secondario P2P", "Governance & Voting"],
        deliverables: { input: "Rental Income", output: "Yield Distribution" },
        icon: AnimatedLifecycleIcon,
        color: "text-rose-400",
        gradient: "from-rose-500/20 to-rose-500/5",
        delay: 0.8
    },
];

// --- Components ---

const StepCard = ({ step, index }: { step: Step; index: number }) => {
    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50, delay: step.delay } }
            }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            className="w-full h-full relative group"
        >
            <div className={`
                h-full flex flex-col
                bg-[#0F1623]
                border border-slate-800
                rounded-2xl p-6
                relative overflow-hidden
                shadow-xl
            `}>
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-b ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient.replace('/20', '')} opacity-40`} />

                {/* Number & Icon Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center
                        bg-slate-900 border border-slate-800
                        ${step.color} shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)]
                        group-hover:scale-110 transition-transform duration-300
                    `}>
                        <step.icon />
                    </div>
                    <span className="text-5xl font-bold text-slate-800/50 select-none font-mono">
                        0{step.id}
                    </span>
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex-grow mb-6">
                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 ${step.color} opacity-80`}>
                        {step.subtitle}
                    </h4>
                    <h3 className="text-xl font-bold text-white mb-3">
                        {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                        {step.description}
                    </p>
                </div>

                {/* Technical Inputs/Outputs */}
                <div className="relative z-10 mb-6 grid grid-cols-2 gap-2 text-[10px] font-mono border-y border-slate-800/50 py-3 bg-slate-900/20 rounded">
                    <div>
                        <span className="text-slate-500 block mb-1">INPUT</span>
                        <span className="text-white font-semibold">{step.deliverables.input}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-slate-500 block mb-1">OUTPUT</span>
                        <span className="text-emerald-400 font-semibold">{step.deliverables.output}</span>
                    </div>
                </div>

                {/* Footer Details */}
                <div className="relative z-10 pt-2 mt-auto">
                     <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                            <motion.li 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: step.delay + 0.5 + (i * 0.1) }}
                                className="flex items-center text-xs text-slate-400"
                            >
                                <span className={`w-1 h-1 rounded-full mr-2 ${step.color.replace('text-', 'bg-')}`} />
                                {detail}
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

const TokenizationFlow = () => {
    return (
        <section className="w-full py-8">
            <motion.div
                className="w-full flex flex-col md:flex-row justify-between items-stretch gap-4 relative"
                initial="hidden"
                animate="visible"
            >
                {/* Desktop Horizontal Connector */}
                <div className="hidden md:block absolute top-[50px] left-[10%] right-[10%] h-[1px] bg-slate-800 -z-10 overflow-hidden">
                    <motion.div 
                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-1/2"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {steps.map((step, index) => (
                    <div key={step.id} className="w-full md:flex-1 relative">
                        {/* Mobile Vertical Connector */}
                        {index !== steps.length - 1 && (
                            <div className="md:hidden absolute left-[30px] bottom-[-24px] w-[2px] h-8 bg-slate-800 z-0 flex justify-center">
                                 <motion.div 
                                    className="w-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"
                                    initial={{ y: "-100%" }}
                                    animate={{ y: "200%" }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        )}
                        
                        <StepCard step={step} index={index} />
                    </div>
                ))}
            </motion.div>
        </section>
    );
};

export default TokenizationFlow;