
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TradeModalProps {
    title: string;
    assetName: string;
    pricePerToken: number;
    amount: number; // Token count
    totalValue: number;
    type: 'buy' | 'sell';
    onClose: () => void;
    onConfirm: () => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ title, assetName, pricePerToken, amount, totalValue, type, onClose, onConfirm }) => {
    const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');

    const handleConfirm = () => {
        setStep('processing');
        setTimeout(() => {
            onConfirm();
            setStep('success');
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0F1623] border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            >
                <div className="p-6">
                    {step === 'review' && (
                        <>
                            <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Asset</span>
                                    <span className="text-white font-medium">{assetName}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Action</span>
                                    <span className={`font-bold uppercase ${type === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>{type}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Price / Token</span>
                                    <span className="text-white font-mono">€{pricePerToken.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Quantity</span>
                                    <span className="text-white font-mono">{amount} Tokens</span>
                                </div>
                                <div className="h-px bg-slate-800 my-2"></div>
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-white">Total Value</span>
                                    <span className={type === 'buy' ? 'text-emerald-400' : 'text-white'}>€{totalValue.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={onClose} className="flex-1 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirm} 
                                    className={`flex-1 py-3 rounded-lg text-white font-bold transition-colors shadow-lg ${
                                        type === 'buy' 
                                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' 
                                        : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'
                                    }`}
                                >
                                    Confirm {type === 'buy' ? 'Transaction' : 'Order'}
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="text-lg font-bold text-white mb-2">Processing on Chain</h3>
                            <p className="text-slate-400 text-sm">Validating Smart Contract...</p>
                            <div className="mt-4 font-mono text-xs text-slate-500">
                                Hash: 0x8a...4b2f
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                            <p className="text-slate-400 text-sm mb-8">
                                The transaction has been settled instantly on the blockchain. Your portfolio has been updated.
                            </p>
                            <button onClick={onClose} className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors">
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default TradeModal;
