

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Types
export interface FinancialMetric {
    year: number;
    revenue: number;
    opex: number;
    noi: number;
}

export interface Document {
    name: string;
    type: string;
    size: string;
    date: string;
}

export interface Project {
    id: string;
    name: string;
    location: string;
    valuation: number;
    tokenPrice: number;
    apy: number;
    status: 'Funding' | 'Live' | 'Sold Out';
    tokensTotal: number;
    tokensSold: number;
    image: string; // URL placeholder
    description: string;
    assetClass: string;
    minInvestment: number;
    partners: {
        legal: string;
        tech: string;
        custody: string;
    };
    isUserCreated?: boolean;
    // Extended Data
    occupancyRate?: number;
    financials?: FinancialMetric[];
    documents?: Document[];
    tenantMix?: { name: string; percent: number }[];
    investmentThesis?: {
        marketOpportunity: string[];
        riskFactors: string[];
        exitStrategy: string[];
    };
}

export interface MarketListing {
    id: string;
    projectId: string;
    seller: string;
    amount: number;
    pricePerToken: number;
    discount: number; // Percentage relative to NAV
}

export interface PortfolioItem {
    projectId: string;
    tokenAmount: number;
    avgBuyPrice: number;
}

export interface ActivityLog {
    id: string;
    type: 'Buy' | 'Sell' | 'Dividend' | 'Origination';
    project: string;
    amount: number;
    date: string;
}

// Initial Data
const initialProjects: Project[] = [
    {
        id: 'p1',
        name: 'Palazzo Velasca Res.',
        location: 'Milano, IT',
        valuation: 4500000,
        tokenPrice: 50,
        apy: 7.2,
        status: 'Funding',
        tokensTotal: 90000,
        tokensSold: 45000,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
        description: 'Luxury residential complex in the heart of Milan. Fully renovated historic building with 24 residential units and commercial space on ground floor.',
        assetClass: 'Residential',
        minInvestment: 500,
        partners: { legal: 'DLA Piper', tech: 'Blocksquare', custody: 'BitGo' },
        occupancyRate: 92,
        financials: [
            { year: 2024, revenue: 320000, opex: 85000, noi: 235000 },
            { year: 2025, revenue: 345000, opex: 88000, noi: 257000 },
            { year: 2026, revenue: 360000, opex: 90000, noi: 270000 },
        ],
        documents: [
            { name: 'Appraisal Report 2024', type: 'PDF', size: '2.4 MB', date: '2024-01-15' },
            { name: 'Legal Title Deed', type: 'PDF', size: '1.1 MB', date: '2023-11-20' },
            { name: 'Building Inspection', type: 'PDF', size: '5.6 MB', date: '2024-02-10' },
        ],
        tenantMix: [
            { name: 'Residential Leases', percent: 85 },
            { name: 'Ground Floor Retail', percent: 15 }
        ],
        investmentThesis: {
            marketOpportunity: [
                "Milan's luxury real estate market has seen steady 4% YoY growth despite global headwinds.",
                "High demand for short-term rentals due to proximity to Duomo and Fashion District.",
                "Scarcity of renovated historic buildings with modern energy efficiency standards."
            ],
            riskFactors: [
                "Regulatory changes regarding short-term rentals in Milan historic center.",
                "Potential maintenance costs associated with heritage building preservation.",
                "Interest rate fluctuations affecting mortgage refinancing capabilities."
            ],
            exitStrategy: [
                "Individual unit sales (break-up strategy) targeting international buyers.",
                "Refinancing of the asset after 5 years to return capital to investors.",
                "Bulk sale to an institutional pan-European residential fund."
            ]
        }
    },
    {
        id: 'p2',
        name: 'Tech Hub Berlin',
        location: 'Berlin, DE',
        valuation: 2100000,
        tokenPrice: 100,
        apy: 5.8,
        status: 'Live',
        tokensTotal: 21000,
        tokensSold: 21000,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
        description: 'Modern co-working and office space located in Kreuzberg. 100% occupancy rate with long-term leases from tech startups.',
        assetClass: 'Commercial',
        minInvestment: 1000,
        partners: { legal: 'Latham & Watkins', tech: 'Tokeny', custody: 'BitGo' },
        occupancyRate: 100,
        financials: [
            { year: 2023, revenue: 150000, opex: 40000, noi: 110000 },
            { year: 2024, revenue: 165000, opex: 42000, noi: 123000 },
        ],
        documents: [
            { name: 'Lease Agreements Summary', type: 'PDF', size: '1.8 MB', date: '2023-06-01' },
            { name: 'ESG Compliance Cert', type: 'PDF', size: '0.9 MB', date: '2023-08-15' },
        ],
        tenantMix: [
            { name: 'FinTech Startup A', percent: 40 },
            { name: 'Design Agency B', percent: 30 },
            { name: 'Co-Working Desks', percent: 30 }
        ],
        investmentThesis: {
            marketOpportunity: [
                "Berlin remains the #1 startup hub in Germany, driving demand for flexible office space.",
                "Supply constraints for Grade A office space in Kreuzberg district.",
                "Tenant willingness to pay premiums for ESG-compliant smart buildings."
            ],
            riskFactors: [
                "Tech sector volatility impacting startup tenant solvency.",
                "Shift towards remote work potentially reducing demand for physical desks.",
                "Rising energy costs affecting operational expenditure margins."
            ],
            exitStrategy: [
                "Acquisition by a major REIT specializing in European office space.",
                "Token buyback program funded by excess cash flow reserves.",
                "IPO of the underlying SPV on a digital securities exchange."
            ]
        }
    },
    {
        id: 'p3',
        name: 'Logistica Amazon Hub',
        location: 'Piacenza, IT',
        valuation: 8200000,
        tokenPrice: 25,
        apy: 6.5,
        status: 'Live',
        tokensTotal: 328000,
        tokensSold: 300000,
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
        description: 'Last-mile logistics center leased to a major e-commerce player. Triple net lease structure ensuring stable cash flows.',
        assetClass: 'Industrial',
        minInvestment: 250,
        partners: { legal: 'DLA Piper', tech: 'Securitize', custody: 'Anchorage' },
        occupancyRate: 100,
        tenantMix: [
            { name: 'Amazon Logistics', percent: 100 }
        ],
        investmentThesis: {
            marketOpportunity: [
                "E-commerce penetration in Italy is growing faster than EU average.",
                "Strategic location near A1 highway junction, critical for last-mile delivery.",
                "Triple Net Lease structure protects investors from inflation and maintenance costs."
            ],
            riskFactors: [
                "Single-tenant dependency risk (vacancy if tenant leaves).",
                "Technological obsolescence of warehousing facilities over 10-year horizon.",
                "Supply chain disruptions impacting tenant operations."
            ],
            exitStrategy: [
                "Sale to an institutional Logistics Fund (e.g., Prologis, Blackstone).",
                "Long-term hold strategy maximizing dividend yield distribution.",
                "Lease renewal negotiation followed by refinancing at lower rates."
            ]
        }
    }
];

const initialListings: MarketListing[] = [
    { id: 'm1', projectId: 'p2', seller: '0x71...9A23', amount: 50, pricePerToken: 98, discount: 2 },
    { id: 'm2', projectId: 'p2', seller: '0x3B...11C2', amount: 200, pricePerToken: 99.5, discount: 0.5 },
    { id: 'm3', projectId: 'p3', seller: '0x8A...FE44', amount: 1000, pricePerToken: 26, discount: -4 }, // Premium
];

// Singleton Store (Mocking a DB)
class MockDatabase {
    projects: Project[] = [...initialProjects];
    listings: MarketListing[] = [...initialListings];
    portfolio: PortfolioItem[] = [
        { projectId: 'p2', tokenAmount: 10, avgBuyPrice: 100 } // Initial investment
    ];
    activityLog: ActivityLog[] = [
        { id: 'a1', type: 'Buy', project: 'Tech Hub Berlin', amount: 1000, date: '2023-10-12' },
        { id: 'a2', type: 'Dividend', project: 'Tech Hub Berlin', amount: 45, date: '2024-01-01' }
    ];

    getProjects() {
        return this.projects;
    }

    getProjectById(id: string) {
        return this.projects.find(p => p.id === id);
    }

    addProject(project: Project) {
        // Add default thesis for user-created projects
        if (!project.investmentThesis) {
            project.investmentThesis = {
                marketOpportunity: ["High potential for capital appreciation.", "Strategic location in developing area.", "Strong rental demand forecast."],
                riskFactors: ["Market liquidity risk during initial years.", "Construction delays (if development).", "Regulatory changes."],
                exitStrategy: ["Sale after 5-year hold period.", "Refinancing.", "Secondary market liquidation."]
            };
        }
        this.projects.push(project);
        this.activityLog.unshift({
            id: Math.random().toString(36),
            type: 'Origination',
            project: project.name,
            amount: project.valuation,
            date: new Date().toISOString().split('T')[0]
        });
    }

    getListings() {
        return this.listings.map(l => {
            const proj = this.projects.find(p => p.id === l.projectId);
            return { ...l, projectName: proj?.name || 'Unknown', tokenPrice: proj?.tokenPrice || 0 };
        });
    }

    getUserPortfolio() {
        return this.portfolio.map(item => {
            const proj = this.projects.find(p => p.id === item.projectId);
            return {
                ...item,
                project: proj!
            };
        });
    }

    getPortfolioItem(projectId: string) {
        return this.portfolio.find(p => p.projectId === projectId);
    }

    getRecentActivity() {
        return this.activityLog;
    }

    buyTokens(projectId: string, amount: number, price: number) {
        const existing = this.portfolio.find(p => p.projectId === projectId);
        if (existing) {
            // Update average price
            const totalValue = (existing.tokenAmount * existing.avgBuyPrice) + (amount * price);
            existing.tokenAmount += amount;
            existing.avgBuyPrice = totalValue / existing.tokenAmount;
        } else {
            this.portfolio.push({ projectId, tokenAmount: amount, avgBuyPrice: price });
        }
        
        // Update project sold amount
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.tokensSold = Math.min(project.tokensTotal, project.tokensSold + amount);
            
            this.activityLog.unshift({
                id: Math.random().toString(36),
                type: 'Buy',
                project: project.name,
                amount: amount * price,
                date: new Date().toISOString().split('T')[0]
            });
        }
    }

    sellTokens(projectId: string, amount: number, price: number) {
        const existing = this.portfolio.find(p => p.projectId === projectId);
        if (existing && existing.tokenAmount >= amount) {
            existing.tokenAmount -= amount;
            if (existing.tokenAmount === 0) {
                this.portfolio = this.portfolio.filter(p => p.projectId !== projectId);
            }
            
             // Update project sold amount (assuming selling back to issuer for simplicity, or just reducing hold)
             // In secondary market logic, this would go to listings. For simplicity here:
             const project = this.projects.find(p => p.id === projectId);
             if (project) {
                 this.activityLog.unshift({
                    id: Math.random().toString(36),
                    type: 'Sell',
                    project: project.name,
                    amount: amount * price,
                    date: new Date().toISOString().split('T')[0]
                });
             }
        }
    }
}

export const db = new MockDatabase();
