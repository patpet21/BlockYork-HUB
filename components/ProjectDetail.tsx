
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { db } from '../lib/mockDb';
import { motion } from 'framer-motion';
import TradeModal from './TradeModal';

interface ProjectDetailProps {
    projectId: string;
    onBack: () => void;
    addLog: (msg: string, src: any, status: any) => void;
    onViewSecondaryMarket?: () => void; // Added prop for navigation
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onBack, addLog, onViewSecondaryMarket }) => {
    const project = db.getProjectById(projectId);
    const portfolioItem = db.getPortfolioItem(projectId);
    
    const [action, setAction] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState<number>(0);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'documents'>('overview');

    useEffect(() => {
        if (project) setAmount(action === 'buy' ? project.minInvestment : 0);
    }, [action, project]);

    if (!project) return <div>Project not found</div>;

    const tokenCount = Math.floor(amount / project.tokenPrice);
    const progress = (project.tokensSold / project.tokensTotal) * 100;
    const userOwnedTokens = portfolioItem ? portfolioItem.tokenAmount : 0;
    const userOwnedValue = userOwnedTokens * project.tokenPrice;

    const handleTrade = () => {
        if (action === 'buy' && amount < project.minInvestment) return;
        if (action === 'sell' && tokenCount > userOwnedTokens) return;
        if (amount <= 0) return;
        setShowTradeModal(true);
    };

    const confirmTrade = () => {
        if (action === 'buy') {
            db.buyTokens(project.id, tokenCount, project.tokenPrice);
            addLog(`Transaction Confirmed: Bought ${tokenCount} RET tokens.`, 'CHAIN', 'success');
        } else {
            db.sellTokens(project.id, tokenCount, project.tokenPrice);
            addLog(`Transaction Confirmed: Sold ${tokenCount} RET tokens.`, 'CHAIN', 'success');
        }
        addLog(`Ownership updated in SPV Registry on-chain.`, 'SYS', 'info');
    };

    return (
        <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
            {showTradeModal && (
                <TradeModal 
                    title={action === 'buy' ? 'Confirm Investment' : 'Confirm Sale'}
                    assetName={project.name}
                    pricePerToken={project.tokenPrice}
                    amount={tokenCount}
                    totalValue={amount}
                    type={action}
                    onClose={() => setShowTradeModal(false)}
                    onConfirm={confirmTrade}
                />
            )}

            {/* Nav Back */}
            <button onClick={onBack} className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Marketplace
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Image */}
                    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden group border border-slate-800">
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                                <div>
                                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] md:text-xs font-bold rounded mb-2 inline-block uppercase tracking-wider shadow-lg shadow-indigo-900/50">
                                        {project.assetClass}
                                    </span>
                                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight leading-tight">{project.name}</h1>
                                    <p className="text-slate-300 flex items-center gap-2 text-sm md:text-base">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {project.location}
                                    </p>
                                </div>
                                <div className="hidden md:block text-right">
                                    <div className="text-xs text-slate-400 uppercase font-bold">Asset Valuation</div>
                                    <div className="text-2xl font-mono text-white">€{project.valuation.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                         <div className="bg-slate-900/50 border border-slate-800 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                            <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Target APY</p>
                            <p className="text-lg md:text-xl font-mono text-emerald-400 font-bold">{project.apy}%</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                            <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Occupancy</p>
                            <p className="text-lg md:text-xl font-mono text-white">{project.occupancyRate || 95}%</p>
                        </div>
                         <div className="bg-slate-900/50 border border-slate-800 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                            <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Min Ticket</p>
                            <p className="text-lg md:text-xl font-mono text-white">€{project.minInvestment}</p>
                        </div>
                         <div className="bg-slate-900/50 border border-slate-800 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                            <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Token Price</p>
                            <p className="text-lg md:text-xl font-mono text-white">€{project.tokenPrice}</p>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="border-b border-slate-800 overflow-x-auto no-scrollbar">
                        <div className="flex gap-6 md:gap-8 min-w-max px-2">
                            {['overview', 'financials', 'documents'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`pb-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                                        activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 md:p-6 min-h-[300px]">
                        {activeTab === 'overview' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-3">Investment Thesis</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-6">
                                        {project.description}
                                    </p>

                                    {/* Expanded Investment Thesis Sections */}
                                    {project.investmentThesis && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                             <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-colors">
                                                <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                                    Market Opportunity
                                                </h4>
                                                <ul className="space-y-2.5">
                                                    {project.investmentThesis.marketOpportunity.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                           <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                                                           <span className="leading-relaxed">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                             </div>

                                             <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                                                <h4 className="text-xs font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    Exit Strategy
                                                </h4>
                                                <ul className="space-y-2.5">
                                                    {project.investmentThesis.exitStrategy.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                                           <span className="leading-relaxed">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                             </div>

                                             <div className="md:col-span-2 bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-rose-500/30 transition-colors">
                                                <h4 className="text-xs font-bold text-rose-400 uppercase mb-3 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                    Risk Factors
                                                </h4>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                                                    {project.investmentThesis.riskFactors.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                           <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                                                           <span className="leading-relaxed">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                             </div>
                                        </div>
                                    )}
                                </div>
                                
                                {project.tenantMix && (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-300 uppercase mb-4">Tenant Mix</h3>
                                        <div className="space-y-3">
                                            {project.tenantMix.map((tenant, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                        <span>{tenant.name}</span>
                                                        <span>{tenant.percent}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500/50" style={{ width: `${tenant.percent}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-bold text-slate-300 uppercase mb-3">Service Providers</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="px-3 py-1.5 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            Legal: {project.partners.legal}
                                        </span>
                                        <span className="px-3 py-1.5 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                            Tech: {project.partners.tech}
                                        </span>
                                        <span className="px-3 py-1.5 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            Custody: {project.partners.custody}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'financials' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {project.financials ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
                                            <thead className="text-xs text-slate-500 uppercase bg-slate-800/50">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-l-lg">Year</th>
                                                    <th className="px-4 py-3">Gross Revenue</th>
                                                    <th className="px-4 py-3">OpEx</th>
                                                    <th className="px-4 py-3 rounded-r-lg">NOI</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800">
                                                {project.financials.map((row, i) => (
                                                    <tr key={i} className="hover:bg-slate-800/30">
                                                        <td className="px-4 py-3 font-mono text-slate-300">{row.year}</td>
                                                        <td className="px-4 py-3 font-mono text-slate-400">€{row.revenue.toLocaleString()}</td>
                                                        <td className="px-4 py-3 font-mono text-slate-400">€{row.opex.toLocaleString()}</td>
                                                        <td className="px-4 py-3 font-mono text-emerald-400 font-bold">€{row.noi.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500 italic">Financial data requires NDA access.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {project.documents?.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-indigo-500 hover:bg-slate-900 cursor-pointer transition-all group">
                                        <div className="w-10 h-10 rounded bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="text-sm font-medium text-slate-200 group-hover:text-white truncate">{doc.name}</h4>
                                            <p className="text-xs text-slate-500 truncate">{doc.type} • {doc.size} • {doc.date}</p>
                                        </div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                                {!project.documents && <div className="text-slate-500 italic">No public documents available.</div>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Trading Terminal */}
                <div className="relative">
                    <div className="sticky bottom-4 lg:top-24 bg-[#0F1623] border border-slate-700 rounded-2xl p-6 shadow-2xl z-20">
                        
                        {/* Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400 text-sm font-medium">Fundraising Progress</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                    project.status === 'Funding' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                                }`}>
                                    {project.status}
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 font-mono">
                                <span>€{(project.tokensSold * project.tokenPrice).toLocaleString()} raised</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>

                        {/* Position Info */}
                        {userOwnedTokens > 0 && (
                            <div className="mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                                <p className="text-xs text-indigo-300 font-semibold uppercase mb-1">Your Position</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-bold text-white font-mono">{userOwnedTokens} RET</span>
                                    <span className="text-sm text-indigo-200">€{userOwnedValue.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Trading Tabs */}
                        <div className="flex p-1 bg-slate-900 rounded-lg mb-4">
                            <button 
                                onClick={() => setAction('buy')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                                    action === 'buy' 
                                    ? 'bg-emerald-600 text-white shadow' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                Buy
                            </button>
                            <button 
                                onClick={() => setAction('sell')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                                    action === 'sell' 
                                    ? 'bg-rose-600 text-white shadow' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                Sell
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                                    {action === 'buy' ? 'Investment Amount (€)' : 'Sell Amount (Tokens)'}
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white font-mono text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all group-hover:border-slate-500"
                                        min={action === 'buy' ? project.minInvestment : 0}
                                        max={action === 'sell' ? userOwnedTokens * project.tokenPrice : undefined} // Using value for simplify input reuse, normally tokens
                                        step={project.tokenPrice}
                                    />
                                    <span className="absolute right-4 top-3.5 text-slate-500 text-sm font-bold">
                                        {action === 'buy' ? 'EUR' : 'EUR Value'}
                                    </span>
                                </div>
                                {action === 'buy' && <p className="text-xs text-slate-500 mt-1 text-right">Min: €{project.minInvestment}</p>}
                                {action === 'sell' && <p className="text-xs text-slate-500 mt-1 text-right">Balance: €{userOwnedValue}</p>}
                            </div>
                            
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">{action === 'buy' ? 'Est. Tokens' : 'Tokens to Sell'}</span>
                                    <span className="text-white font-mono font-bold">{tokenCount} RET</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <span>{action === 'buy' ? 'Est. Annual Income' : 'Realized P&L (Sim)'}</span>
                                    <span>€{((amount * project.apy) / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleTrade}
                            disabled={
                                (action === 'buy' && amount < project.minInvestment) ||
                                (action === 'sell' && (tokenCount > userOwnedTokens || tokenCount <= 0))
                            }
                            className={`
                                w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all
                                ${
                                    (action === 'buy' && amount < project.minInvestment) || (action === 'sell' && (tokenCount > userOwnedTokens || tokenCount <= 0))
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : action === 'buy' 
                                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/50 hover:-translate-y-1'
                                        : 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/50 hover:-translate-y-1'
                                }
                            `}
                        >
                            {action === 'buy' ? 'Invest Now' : 'Place Sell Order'}
                        </button>
                        
                        <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-4">
                             {/* Secondary Market Link */}
                             {onViewSecondaryMarket && (
                                <button 
                                    onClick={onViewSecondaryMarket}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-indigo-300 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    View Secondary Market Offers
                                </button>
                             )}

                             <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Bank Grade Security</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
