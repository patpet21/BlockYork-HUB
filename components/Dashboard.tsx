
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, Project } from '../lib/mockDb';

const StatCard: React.FC<{ title: string, value: string, change: string, isPositive: boolean, icon: any }> = ({ title, value, change, isPositive, icon }) => (
    <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-indigo-500/10 transition-colors"></div>
        <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-white transition-colors border border-slate-800">
                {icon}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                {change}
            </span>
        </div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <span className="text-2xl font-bold text-white font-mono">{value}</span>
    </div>
);

const ProjectCard: React.FC<{ project: Project, onSelect: (id: string) => void }> = ({ project, onSelect }) => (
    <div 
        onClick={() => onSelect(project.id)}
        className="bg-[#0F1623] border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-900/20 transition-all cursor-pointer group flex flex-col h-full"
    >
        <div className="h-40 bg-slate-800 relative overflow-hidden">
            <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1623] to-transparent opacity-60"></div>
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-bold text-white border border-white/10">
                {project.status}
            </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
            <div className="mb-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide bg-indigo-400/10 px-2 py-0.5 rounded-sm">
                    {project.assetClass}
                </span>
            </div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
            <p className="text-slate-500 text-sm mb-4 flex items-center gap-1 truncate">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {project.location}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 mt-auto pt-4 border-t border-slate-800">
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Valuation</p>
                    <p className="text-sm font-mono text-white">€{(project.valuation / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Target APY</p>
                    <p className="text-sm font-mono text-emerald-400 font-bold">{project.apy}%</p>
                </div>
            </div>
            
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-indigo-500" style={{ width: `${(project.tokensSold / project.tokensTotal) * 100}%` }} />
            </div>
        </div>
    </div>
);

// Compliance Widget Component
const ComplianceWidget = ({ state, actions }: { state: any, actions: any }) => {
    const steps = [
        { id: 'wallet', title: 'Connect Wallet', status: state.isConnected ? 'done' : 'active', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        )},
        { id: 'kyc', title: 'Identity (KYC)', status: state.isVerified ? 'done' : state.isConnected ? 'active' : 'pending', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )},
        { id: 'payment', title: 'Payment Method', status: state.paymentMethods.length > 0 ? 'done' : state.isVerified ? 'active' : 'pending', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        )},
        { id: 'whitelist', title: 'Whitelist', status: state.isWhitelisted ? 'done' : (state.paymentMethods.length > 0) ? 'active' : 'pending', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        )}
    ];

    return (
        <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wide">Onboarding Status</h3>
                {state.isWhitelisted && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Ready to Trade
                </span>}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                {steps.map((step, idx) => (
                    <div key={step.id} className="flex-1">
                        <div className={`
                            relative p-3 rounded-lg border transition-all flex items-center gap-3
                            ${step.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                              step.status === 'active' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-slate-800 opacity-60'}
                        `}>
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                ${step.status === 'done' ? 'bg-emerald-500 text-white' : 
                                  step.status === 'active' ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-700 text-slate-400'}
                            `}>
                                {step.status === 'done' ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : idx + 1}
                            </div>
                            <div className="flex-1">
                                <p className={`text-xs font-bold ${step.status === 'done' ? 'text-emerald-400' : 'text-white'}`}>{step.title}</p>
                                {step.status === 'active' && (
                                    <button 
                                        onClick={() => {
                                            if (step.id === 'wallet') actions.connect();
                                            if (step.id === 'kyc') actions.startKYC();
                                            if (step.id === 'payment') actions.addPayment();
                                            if (step.id === 'whitelist') actions.whitelist();
                                        }}
                                        className="text-[10px] bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded text-white mt-1.5 shadow-sm font-semibold tracking-wide border border-indigo-500/50"
                                    >
                                        Complete Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                <span className="text-xs text-slate-500">Network:</span>
                <select 
                    value={state.network} 
                    onChange={(e) => actions.setNetwork(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none"
                >
                    <option>Ethereum Mainnet</option>
                    <option>Polygon POS</option>
                    <option>Avalanche C-Chain</option>
                    <option>Private Rollup (Inst.)</option>
                </select>
            </div>
        </div>
    );
};

interface DashboardProps {
    onNavigateToWizard?: () => void;
    onViewProject: (id: string) => void;
    walletState?: any;
    walletActions?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToWizard, onViewProject, walletState, walletActions }) => {
    const [viewMode, setViewMode] = useState<'investor' | 'issuer'>('investor');
    const [projects, setProjects] = useState<Project[]>([]);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);

    // Simulator State
    const [simScenario, setSimScenario] = useState({ appreciation: 5, yieldAdj: 0 });

    useEffect(() => {
        setProjects(db.getProjects());
        setPortfolio(db.getUserPortfolio());
        setActivity(db.getRecentActivity());
    }, []);

    // Derived Stats
    const totalInvested = portfolio.reduce((acc, curr) => acc + (curr.tokenAmount * curr.avgBuyPrice), 0);
    const portfolioApy = portfolio.length > 0 
        ? portfolio.reduce((acc, curr) => acc + (curr.project.apy * curr.tokenAmount), 0) / portfolio.reduce((acc, curr) => acc + curr.tokenAmount, 0)
        : 0;

    // Simulation Calculations
    const simulatedApy = Math.max(0, portfolioApy + simScenario.yieldAdj);
    const simulatedAppreciation = simScenario.appreciation;
    const projectedValue = totalInvested * (1 + (simulatedAppreciation / 100));
    const annualPassiveIncome = projectedValue * (simulatedApy / 100);
    const monthlyPassiveIncome = annualPassiveIncome / 12;

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-12 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h2>
                    <div className="flex gap-4 border-b border-slate-800 overflow-x-auto">
                        <button 
                            onClick={() => setViewMode('investor')}
                            className={`pb-2 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 whitespace-nowrap ${viewMode === 'investor' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            Investor View
                        </button>
                        <button 
                            onClick={() => setViewMode('issuer')}
                            className={`pb-2 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 whitespace-nowrap ${viewMode === 'issuer' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            Issuer View
                        </button>
                    </div>
                </div>
                {viewMode === 'issuer' && (
                    <button 
                        onClick={onNavigateToWizard}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20 whitespace-nowrap self-start md:self-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Originate New Deal
                    </button>
                )}
            </div>

            {/* Compliance Widget */}
            {viewMode === 'investor' && walletState && (
                <ComplianceWidget state={walletState} actions={walletActions} />
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {viewMode === 'investor' ? (
                    <>
                        <StatCard 
                            title="Total Net Worth" 
                            value={`€${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                            change="+12.5%" 
                            isPositive={true}
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                        <StatCard 
                            title="Active Tokens" 
                            value={portfolio.reduce((a, c) => a + c.tokenAmount, 0).toLocaleString()} 
                            change="+50" 
                            isPositive={true} 
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                        />
                        <StatCard 
                            title="Est. Annual Income" 
                            value={`€${(totalInvested * (portfolioApy/100)).toFixed(0)}`} 
                            change="+3.2%" 
                            isPositive={true} 
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                        />
                        <StatCard 
                            title="Weighted APY" 
                            value={`${portfolioApy.toFixed(1)}%`} 
                            change="+0.4%" 
                            isPositive={true} 
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                        />
                    </>
                ) : (
                    <>
                         <StatCard title="Total Value Locked" value="€14.8M" change="+1.5M" isPositive={true} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
                         <StatCard title="Investors" value="1,842" change="+12" isPositive={true} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                         <StatCard title="Capital Deployed" value="88%" change="Stable" isPositive={true} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} />
                         <StatCard title="Active Projects" value={projects.filter(p => p.isUserCreated).length.toString()} change="+1" isPositive={true} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                    </>
                )}
            </div>

            {/* Portfolio Allocation Visual */}
            {viewMode === 'investor' && portfolio.length > 0 && (
                <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-4 md:p-6">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Portfolio Allocation</h3>
                    <div className="flex h-4 rounded-full overflow-hidden w-full">
                        {portfolio.map((item, index) => (
                            <div 
                                key={item.projectId}
                                className={`h-full ${['bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500'][index % 4]}`}
                                style={{ width: `${((item.tokenAmount * item.avgBuyPrice) / totalInvested) * 100}%` }}
                                title={item.project.name}
                            />
                        ))}
                    </div>
                    <div className="flex gap-4 mt-3 flex-wrap">
                         {portfolio.map((item, index) => (
                            <div key={item.projectId} className="flex items-center gap-2 text-xs">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${['bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500'][index % 4]}`} />
                                <span className="text-slate-300 whitespace-nowrap">{item.project.name}</span>
                                <span className="text-slate-500">{Math.round(((item.tokenAmount * item.avgBuyPrice) / totalInvested) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {viewMode === 'investor' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* My Holdings Section */}
                        <section>
                            <h3 className="font-bold text-white text-xl mb-4">My Holdings</h3>
                            {portfolio.length === 0 ? (
                                <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center">
                                    <p className="text-slate-500 mb-4">You haven't invested in any projects yet.</p>
                                    <button className="text-indigo-400 hover:text-white underline">Browse Marketplace</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {portfolio.map((item) => (
                                        <ProjectCard key={item.projectId} project={item.project} onSelect={onViewProject} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Portfolio Scenario Simulator */}
                         {portfolio.length > 0 && (
                            <section className="bg-gradient-to-br from-[#0F1623] to-[#141b2d] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    Portfolio Scenario Planner
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <label className="text-slate-400">Market Appreciation Trend</label>
                                                <span className={`${simScenario.appreciation >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold`}>
                                                    {simScenario.appreciation > 0 ? '+' : ''}{simScenario.appreciation}%
                                                </span>
                                            </div>
                                            <input 
                                                type="range" min="-10" max="20" step="1"
                                                value={simScenario.appreciation}
                                                onChange={(e) => setSimScenario(prev => ({...prev, appreciation: Number(e.target.value)}))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                            <p className="text-[10px] text-slate-500 mt-1">Simulate general real estate market movements over 1 year.</p>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <label className="text-slate-400">Rental Yield Adjustment</label>
                                                <span className={`${simScenario.yieldAdj >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold`}>
                                                    {simScenario.yieldAdj > 0 ? '+' : ''}{simScenario.yieldAdj}%
                                                </span>
                                            </div>
                                            <input 
                                                type="range" min="-3" max="5" step="0.5"
                                                value={simScenario.yieldAdj}
                                                onChange={(e) => setSimScenario(prev => ({...prev, yieldAdj: Number(e.target.value)}))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                            <p className="text-[10px] text-slate-500 mt-1">Adjust occupancy or rental demand impact on APY.</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex flex-col justify-center">
                                        <div className="mb-4">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Projected Portfolio Value (1Y)</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-2xl font-bold text-white font-mono">
                                                    €{projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </span>
                                                <span className="text-xs text-emerald-400 mb-1">
                                                    (+€{(projectedValue - totalInvested).toLocaleString(undefined, { maximumFractionDigits: 0 })})
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-slate-700/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-xs text-slate-500 uppercase font-bold">Potential Monthly Income</p>
                                                <p className="text-sm font-bold text-emerald-400">{simulatedApy.toFixed(1)}% APY</p>
                                            </div>
                                            <p className="text-xl font-bold text-white font-mono">
                                                €{monthlyPassiveIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-slate-500 font-normal">/ mo</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Marketplace */}
                        <section>
                            <h3 className="font-bold text-white text-xl mt-8 mb-4">Explore Marketplace</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} onSelect={onViewProject} />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Recent Activity Sidebar */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-white text-xl">Recent Activity</h3>
                        <div className="bg-[#0F1623] border border-slate-800 rounded-xl overflow-hidden">
                            {activity.length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-sm">No recent activity</div>
                            ) : (
                                <div className="divide-y divide-slate-800">
                                    {activity.map((log) => (
                                        <div key={log.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                                    log.type === 'Buy' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    log.type === 'Sell' ? 'bg-rose-500/10 text-rose-400' :
                                                    'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                    {log.type}
                                                </span>
                                                <span className="text-xs text-slate-500">{log.date}</span>
                                            </div>
                                            <p className="text-sm text-white font-medium">{log.project}</p>
                                            <p className="text-xs text-slate-400 font-mono mt-1">
                                                {log.type === 'Origination' ? `Val: €${log.amount.toLocaleString()}` : `€${log.amount.toLocaleString()}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'issuer' && (
                <div className="space-y-6">
                    <h3 className="font-bold text-white text-xl">Managed Assets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.filter(p => p.isUserCreated).length === 0 ? (
                             <div className="col-span-full p-12 border border-dashed border-slate-700 rounded-xl text-center bg-slate-900/20">
                                <p className="text-slate-400 mb-4">No originated deals found.</p>
                                <button onClick={onNavigateToWizard} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Start Origination</button>
                             </div>
                        ) : (
                            projects.filter(p => p.isUserCreated).map((project) => (
                                <ProjectCard key={project.id} project={project} onSelect={onViewProject} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
