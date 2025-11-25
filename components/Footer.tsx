
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-slate-800/50 bg-[#0B0F19]/80 backdrop-blur-sm z-50">
            <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                
                <div className="flex items-center gap-4">
                    <p>
                        Powered by <span className="text-slate-300 font-semibold">Gemini API</span>
                    </p>
                    <span className="hidden md:inline text-slate-700">|</span>
                    <p className="hidden md:block">Real Estate Tokenization Explorer</p>
                </div>

                <div className="flex items-center gap-6">
                    <a
                        href="https://ai.google.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors"
                    >
                        Google AI for Developers
                    </a>
                    <a
                        href="https://gemini.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition-colors"
                    >
                        Try Gemini
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
