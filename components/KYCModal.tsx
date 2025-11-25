
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KYCModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleNext = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            if (step < 3) {
                setStep(s => s + 1);
            } else {
                onComplete();
                onClose();
            }
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0B0F19] border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Identity Verification</h2>
                        <p className="text-slate-400 text-sm mt-1">Required for Regulatory Compliance (KYC/AML)</p>
                    </div>

                    {/* Step Content */}
                    <div className="mb-8 min-h-[150px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    key="1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center"
                                >
                                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 hover:border-indigo-500 transition-colors cursor-pointer bg-slate-900/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                        <p className="text-slate-300 font-medium">Upload Government ID</p>
                                        <p className="text-xs text-slate-500 mt-1">Passport or Driver's License</p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    key="2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center"
                                >
                                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/30">
                                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent z-10"></div>
                                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" alt="Face" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                                            <div className="w-24 h-24 border-2 border-white/30 rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 font-medium mt-4">Biometric Face Match</p>
                                    <p className="text-xs text-slate-500">Analyzing liveness...</p>
                                </motion.div>
                            )}

                             {step === 3 && (
                                <motion.div 
                                    key="3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="inline-block p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Verification Complete</h3>
                                    <p className="text-slate-400 text-sm">
                                        Your wallet address <span className="font-mono text-slate-300">0x71...9A23</span> has been whitelisted on the protocol.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <button 
                        onClick={handleNext}
                        disabled={isProcessing}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : step === 3 ? 'Go to Dashboard' : 'Continue'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default KYCModal;
