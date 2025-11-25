/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import TokenizationFlow from './components/TokenizationFlow';
import Dashboard from './components/Dashboard';
import OnboardingWizard from './components/OnboardingWizard';
import Footer from './components/Footer';
import SystemTerminal, { LogEntry } from './components/SystemTerminal';
import ProjectDetail from './components/ProjectDetail';
import SecondaryMarket from './components/SecondaryMarket';
import KYCModal from './components/KYCModal';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [view, setView] = useState<'landing' | 'dashboard' | 'wizard' | 'project-detail' | 'market'>('landing');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    
    // User State
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isKYCVerified, setIsKYCVerified] = useState(false);
    const [showKYCModal, setShowKYCModal] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('Ethereum Mainnet');
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
    const [isWhitelisted, setIsWhitelisted] = useState(false);

    // Mobile Nav State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Function to add logs (passed down to children)
    const addLog = (message: string, source: 'SYS' | 'API' | 'CHAIN' | 'SEC' = 'SYS', status: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
            source,
            message,
            status
        };
        setLogs(prev => [...prev, newLog]);
    };

    // Initial system boot logs
    useEffect(() => {
        setTimeout(() => addLog('PropertyDEX Protocol initialized', 'SYS', 'success'), 500);
        setTimeout(() => addLog('Connecting to Institutional Nodes...', 'CHAIN'), 1200);
        setTimeout(() => addLog('Node Connection Established (Latency: 12ms)', 'CHAIN', 'success'), 2000);
    }, []);

    const handleStartWizard = () => {
        setView('wizard');
        setIsTerminalOpen(true);
        addLog('Initiating Deal Origination Sequence...', 'SYS', 'info');
        setIsMobileMenuOpen(false);
    };

    const handleViewProject = (id: string) => {
        setSelectedProjectId(id);
        setView('project-detail');
        addLog(`Fetching metadata for asset ${id}...`, 'API', 'info');
        window.scrollTo(0,0);
    };

    const handleConnectWallet = () => {
        if (isWalletConnected) return;
        addLog('Requesting wallet connection...', 'SYS');
        setTimeout(() => {
            setIsWalletConnected(true);
            addLog('Wallet Connected: 0x71C...9A23', 'CHAIN', 'success');
        }, 800);
    };

    const handleAddPaymentMethod = () => {
        addLog('Initiating Fiat On-Ramp Provider (Stripe/Circle)...', 'API');
        setTimeout(() => {
            setPaymentMethods(['Visa ending 4242']);
            addLog('Payment method verified & attached to identity.', 'SYS', 'success');
        }, 1500);
    };

    const handleWhitelist = () => {
        addLog('Checking investor eligibility against Reg D/S requirements...', 'SEC');
        setTimeout(() => {
            setIsWhitelisted(true);
            addLog('Address 0x71C...9A23 added to Global Whitelist Registry.', 'CHAIN', 'success');
        }, 2000);
    };

    // Navigation Helper
    const navTo = (target: typeof view) => {
        setView(target);
        setIsMobileMenuOpen(false);
        window.scrollTo(0,0);
    };

    return (
        <main className="bg-[#0B0F19] text-slate-200 min-h-screen w-full flex flex-col relative overflow-x-hidden font-sans selection:bg-indigo-500/30 pb-10">
            {/* Global Modals */}
            <KYCModal 
                isOpen={showKYCModal} 
                onClose={() => setShowKYCModal(false)} 
                onComplete={() => {
                    setIsKYCVerified(true);
                    addLog('User Identity Verified (KYC Level 1)', 'SEC', 'success');
                }}
            />

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10" />
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-50 w-full border-b border-slate-800/60 bg-[#0B0F19]/90 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3 cursor-pointer z-50" onClick={() => navTo('landing')}>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-white text-lg">P</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white tracking-tight text-base md:text-lg leading-tight">Property<span className="text-indigo-400">DEX</span></span>
                            <span className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Digital Asset Exchange</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-6 mr-4">
                            <button onClick={() => navTo('landing')} className={`text-sm font-medium transition-colors ${view === 'landing' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Home</button>
                            <button onClick={() => navTo('dashboard')} className={`text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Dashboard</button>
                            <button onClick={() => navTo('market')} className={`text-sm font-medium transition-colors ${view === 'market' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Secondary Market</button>
                        </div>
                        <div className="h-6 w-px bg-slate-800" />
                        <div className="flex items-center gap-3">
                            {!isWalletConnected ? (
                                <button onClick={handleConnectWallet} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700">Connect Wallet</button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end cursor-pointer" onClick={() => !isKYCVerified && setShowKYCModal(true)}>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-xs font-mono text-slate-300">0x71C...</span>
                                        </div>
                                        <span className={`text-[9px] font-bold px-1.5 rounded ${isKYCVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {isKYCVerified ? 'VERIFIED' : 'UNVERIFIED'}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">JS</div>
                                </div>
                            )}
                            <button onClick={handleStartWizard} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${view === 'wizard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'bg-white text-slate-900 hover:bg-slate-200'}`}>
                                <span>Simulate Deal</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden bg-[#0F1623] border-b border-slate-800 overflow-hidden"
                        >
                            <div className="px-4 py-6 flex flex-col gap-4">
                                <button onClick={() => navTo('landing')} className="text-left text-slate-300 font-medium py-2">Home</button>
                                <button onClick={() => navTo('dashboard')} className="text-left text-slate-300 font-medium py-2">Dashboard</button>
                                <button onClick={() => navTo('market')} className="text-left text-slate-300 font-medium py-2">Secondary Market</button>
                                <div className="h-px bg-slate-800 my-2" />
                                
                                <div className="flex flex-col gap-3">
                                    {!isWalletConnected ? (
                                        <button onClick={() => { handleConnectWallet(); setIsMobileMenuOpen(false); }} className="w-full py-3 rounded-lg bg-slate-800 text-white font-bold text-sm">
                                            Connect Wallet
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">JS</div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-white font-mono">0x71C...9A23</span>
                                                    <span className={`text-[10px] font-bold ${isKYCVerified ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {isKYCVerified ? 'Verified Investor' : 'Unverified'}
                                                    </span>
                                                </div>
                                            </div>
                                            {!isKYCVerified && (
                                                <button onClick={() => { setShowKYCModal(true); setIsMobileMenuOpen(false); }} className="text-xs bg-indigo-600 px-3 py-1.5 rounded text-white">
                                                    KYC
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <button onClick={handleStartWizard} className="w-full py-3 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-lg">
                                        Simulate New Deal
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <div className="z-10 flex flex-col w-full max-w-7xl mx-auto flex-1 mb-24 px-4 sm:px-6">
                <AnimatePresence mode="wait">
                    {view === 'landing' && (
                        <motion.div 
                            key="landing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center py-8 md:py-16"
                        >
                            <header className="text-center mb-16 relative max-w-5xl mx-auto">
                                <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                                    PropertyDEX Enterprise
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight text-white leading-tight">
                                    Il Futuro del Real Estate <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                                        È Liquido e Digitale
                                    </span>
                                </h1>
                                <p className="text-slate-400 text-base md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
                                    Trasformiamo immobili illiquidi in Security Token scambiabili globalmente.
                                    Una suite completa che unisce <strong>Legal</strong>, <strong>Tech</strong> e <strong>Finanza</strong> in un unico hub istituzionale.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                     <button onClick={handleStartWizard} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-900/40 w-full sm:w-auto text-lg flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        Simula Tokenizzazione
                                     </button>
                                     <button onClick={() => navTo('dashboard')} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold transition-all w-full sm:w-auto text-lg">
                                        Marketplace Demo
                                     </button>
                                </div>
                            </header>

                            {/* Stats Section */}
                            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 border-y border-slate-800/50 py-8 bg-[#0F1623]/30">
                                <div className="text-center border-r border-slate-800/50 last:border-0">
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">€16T+</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-widest">Real Estate Market</div>
                                </div>
                                <div className="text-center border-r border-slate-800/50 last:border-0">
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">-40%</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-widest">Costi di Gestione</div>
                                </div>
                                <div className="text-center border-r border-slate-800/50 last:border-0">
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-widest">Trading Liquidity</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">T+0</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-widest">Settlement Istantaneo</div>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-24 max-w-6xl">
                                <div className="space-y-4 p-6 rounded-2xl bg-[#0F1623] border border-slate-800 hover:border-indigo-500 transition-colors group">
                                    <div className="w-12 h-12 bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Frazionamento & Liquidità</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Abbatti le barriere all'ingresso. Dividi un immobile da 10M€ in 10 milioni di token da 1€, rendendolo accessibile a una platea globale di investitori retail e istituzionali.
                                    </p>
                                </div>
                                <div className="space-y-4 p-6 rounded-2xl bg-[#0F1623] border border-slate-800 hover:border-emerald-500 transition-colors group">
                                    <div className="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Compliance Automatica</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Lo Smart Contract incorpora le regole normative (KYC/AML, Reg D/S). Il token stesso "sa" chi può comprarlo e chi no, bloccando automaticamente transazioni non autorizzate.
                                    </p>
                                </div>
                                <div className="space-y-4 p-6 rounded-2xl bg-[#0F1623] border border-slate-800 hover:border-blue-500 transition-colors group">
                                    <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Efficienza Operativa</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Distribuzione automatica dei dividendi (affitti) direttamente nei wallet degli investitori tramite stablecoin. Nessun intermediario bancario, costi ridotti e trasparenza totale.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full mb-8 text-center">
                                <h2 className="text-3xl font-bold text-white mb-4">Il Processo di Tokenizzazione</h2>
                                <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                                    PropertyDEX funge da Hub Centrale, coordinando l'intero ciclo di vita dell'asset digitale. Ecco come avviene la magia, passo dopo passo.
                                </p>
                            </div>

                            <TokenizationFlow />

                            {/* CTA Footer */}
                            <div className="mt-24 w-full bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-3xl -z-10"></div>
                                <h2 className="text-3xl font-bold text-white mb-4">Pronto a sbloccare il valore del tuo Asset?</h2>
                                <p className="text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                                    Inizia oggi con una simulazione gratuita. Riceverai un <strong>report di fattibilità</strong> personalizzato e una consulenza strategica con i nostri esperti per valutare la struttura legale e tecnica migliore.
                                </p>
                                <button onClick={handleStartWizard} className="px-10 py-4 bg-white text-indigo-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-xl text-lg">
                                    Avvia Simulazione Gratuita
                                </button>
                                <p className="mt-4 text-xs text-slate-500">
                                    Nessun costo iniziale. Riceverai il report entro 3 giorni lavorativi.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {view === 'wizard' && (
                        <motion.div
                            key="wizard"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="w-full py-6 md:py-8"
                        >
                            <OnboardingWizard 
                                onComplete={() => {
                                    addLog('Deal Room deployed successfully', 'SYS', 'success');
                                    setView('dashboard');
                                    window.scrollTo(0,0);
                                }} 
                                addLog={addLog}
                            />
                        </motion.div>
                    )}

                    {view === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="w-full py-6 md:py-8"
                        >
                            <Dashboard 
                                onNavigateToWizard={handleStartWizard} 
                                onViewProject={handleViewProject}
                                walletState={{
                                    isConnected: isWalletConnected,
                                    isVerified: isKYCVerified,
                                    network: selectedNetwork,
                                    isWhitelisted: isWhitelisted,
                                    paymentMethods: paymentMethods
                                }}
                                walletActions={{
                                    connect: handleConnectWallet,
                                    startKYC: () => setShowKYCModal(true),
                                    addPayment: handleAddPaymentMethod,
                                    whitelist: handleWhitelist,
                                    setNetwork: setSelectedNetwork
                                }}
                            />
                        </motion.div>
                    )}

                    {view === 'project-detail' && selectedProjectId && (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full py-6 md:py-8"
                        >
                            <ProjectDetail 
                                projectId={selectedProjectId} 
                                onBack={() => navTo('dashboard')}
                                addLog={addLog}
                                onViewSecondaryMarket={() => navTo('market')}
                            />
                        </motion.div>
                    )}

                    {view === 'market' && (
                        <motion.div
                            key="market"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="w-full py-6 md:py-8"
                        >
                            <SecondaryMarket onSelectProject={handleViewProject} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <SystemTerminal 
                logs={logs} 
                isOpen={isTerminalOpen} 
                onToggle={() => setIsTerminalOpen(!isTerminalOpen)} 
            />

            <Footer />
        </main>
    );
}

export default App;