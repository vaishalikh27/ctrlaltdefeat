import type { SourceDef } from '../types'

export const SOURCES: Record<string, SourceDef> = {
  nse: {
    id: 'nse',
    label: 'NSE Market Data',
    description: 'Live price, volume and order-book feed from the National Stock Exchange.',
  },
  sebi: {
    id: 'sebi',
    label: 'SEBI Filing',
    description: 'Regulatory disclosures and corporate filings lodged with SEBI.',
  },
  earnings: {
    id: 'earnings',
    label: 'Latest Earnings Report',
    description: 'Most recent quarterly results, management commentary and guidance.',
  },
  flows: {
    id: 'flows',
    label: 'FII/DII Flow Data',
    description: 'Institutional buy/sell activity from foreign and domestic institutional investors.',
  },
  news: {
    id: 'news',
    label: 'Market News',
    description: 'Aggregated financial news and press coverage, scored for sentiment.',
  },
}

export const SOURCE_LIST = Object.values(SOURCES)
