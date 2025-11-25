
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface PartnerData {
    id: string;
    title: string;
    sub: string;
    desc: string;
    features: string[];
    stats: { time: string; cost: string };
    logo: React.ReactNode;
    region: 'USA' | 'EU' | 'UAE' | 'GLOBAL';
}

interface SelectableCardProps {
    data: PartnerData;
    selected: boolean;
    onClick: () => void;
}

const SelectableCard: React.FC<SelectableCardProps> = ({ data, selected, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                ${selected 
                    ? 'bg-indigo-900/20 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}
            `}
        >
            {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
            )}
            
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 p-1.5 flex items-center justify-center shadow-inner">
                        {data.logo}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{data.title}</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">{data.sub}</p>
                    </div>
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-grow">
                    {data.desc}
                </p>

                <div className="border-t border-slate-700/50 pt-3 mt-auto">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2">
                        <span>Deploy: <span className="text-slate-300">{data.stats.time}</span></span>
                        <span>Cost: <span className="text-slate-300">{data.stats.cost}</span></span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                        {data.features.slice(0, 2).map((f, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-400 border border-slate-700">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectableCard;
