/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { db, MarketListing } from '../lib/mockDb';
import TradeModal from './TradeModal';

const SecondaryMarket = ({ onSelectProject }: { onSelectProject: (id: string) => void }) => {
    const listings = db.getListings();
    const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);

    const handleBuy = (listing: MarketListing) => {
        // Logic to execute buy would go here, updating DB
        // For simulation, we just close modal and pretend
        db.buyTokens(listing.projectId, listing.amount, listing.pricePerToken);
        setSelectedListing(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {selectedListing && (
                <TradeModal 
                    title="Confirm Market Buy"
                    assetName={selectedListing.projectName}
                    pricePerToken={selectedListing.pricePerToken}
                    amount={selectedListing.amount}
                    totalValue={selectedListing.amount * selectedListing.pricePerToken}
                    type="buy"
                    onClose={() => setSelectedListing(null)}
                    onConfirm={() => handleBuy(selectedListing)}
                />
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Secondary Market (P2P)</h2>
                    <p className="text-slate-400 text-sm md:text-base">Trade security tokens directly with other investors. Instant settlement via smart contracts.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input type="text" placeholder="Search tokens..." className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500 w-full" />
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Asset Name</th>
                                <th className="px-6 py-4">Seller Address</th>
                                <th className="px-6 py-4 text-right">Amount (Tokens)</th>
                                <th className="px-6 py-4 text-right">Price / Token</th>
                                <th className="px-6 py-4 text-right">Discount to NAV</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {listings.map((listing) => (
                                <tr key={listing.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td 
                                        onClick={() => onSelectProject(listing.projectId)}
                                        className="px-6 py-4 font-medium text-white flex items-center gap-3 cursor-pointer hover:text-indigo-400"
                                    >
                                        <div className="w-8 h-8 rounded bg-indigo-900/30 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 flex-shrink-0">
                                            {listing.projectName.charAt(0)}
                                        </div>
                                        {listing.projectName}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-500">
                                        {listing.seller}
                                    </td>
                                    <td className="px-6 py-4 text-right text-white font-mono">
                                        {listing.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-white">
                                        €{listing.pricePerToken.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            listing.discount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                        }`}>
                                            {listing.discount > 0 ? `-${listing.discount}%` : `+${Math.abs(listing.discount)}%`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                        <button 
                                            onClick={() => setSelectedListing(listing)}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all shadow shadow-emerald-900/20"
                                        >
                                            Buy Now
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {listings.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No active listings found in the order book.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecondaryMarket;