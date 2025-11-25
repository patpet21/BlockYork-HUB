
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LogEntry {
    id: string;
    timestamp: string;
    source: 'SYS' | 'API' | 'CHAIN' | 'SEC';
    message: string;
    status: 'info' | 'success' | 'warning' | 'error';
}

interface SystemTerminalProps {
    logs: LogEntry[];
    isOpen: boolean;
    onToggle: () => void;
}

const SystemTerminal: React.FC<SystemTerminalProps> = ({ logs, isOpen, onToggle }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isOpen]);

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out ${isOpen ? 'h-64' : 'h-9'}`}>
            <div className="w-full h-full bg-[#05080f] border-t border-slate-800 shadow-2xl flex flex-col font-mono text-xs">
                {/* Header / Toggle Bar */}
                <div 
                    onClick={onToggle}
                    className="h-9 flex items-center justify-between px-4 bg-slate-900/80 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                        </div>
                        <span className="text-slate-400 font-bold ml-2">NEXUS_KERNEL_V2.4.1</span>
                        <span className="text-slate-600">|</span>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                            <span className={isOpen ? 'text-emerald-500' : 'text-slate-500'}>{isOpen ? 'SYSTEM ONLINE' : 'IDLE'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                        <span>Latency: 14ms</span>
                        <span>Memory: 42%</span>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </div>
                </div>

                {/* Log Content */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar bg-black/90"
                >
                    {logs.length === 0 && (
                        <div className="text-slate-600 italic opacity-50">Waiting for system events...</div>
                    )}
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start hover:bg-white/5 p-0.5 rounded">
                            <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                            <span className={`
                                shrink-0 w-12 text-center font-bold px-1 rounded
                                ${log.source === 'API' ? 'text-blue-400 bg-blue-400/10' : 
                                  log.source === 'CHAIN' ? 'text-purple-400 bg-purple-400/10' :
                                  log.source === 'SEC' ? 'text-amber-400 bg-amber-400/10' :
                                  'text-slate-400 bg-slate-400/10'}
                            `}>
                                {log.source}
                            </span>
                            <span className={`
                                ${log.status === 'success' ? 'text-emerald-400' : 
                                  log.status === 'error' ? 'text-red-400' : 
                                  log.status === 'warning' ? 'text-amber-300' : 'text-slate-300'}
                            `}>
                                {log.message}
                            </span>
                        </div>
                    ))}
                    {/* Fake Cursor */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-4 bg-emerald-500 mt-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default SystemTerminal;
