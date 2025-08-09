// Single Source of Truth for all stocks (31 items)
export type Stock = {
  id: string;
  symbol: string;
  name: string;
  exchange?: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  pe: number | null;
  dividendYield: number | null;
  isGainer: boolean;
  newsSummary: string;
  returns?: {
    oneMonth: number;
    sixMonth: number;
    oneYear: number;
  };
  earningsDate?: string;
  beta: number;
  eps: number;
  bookValue: number;
  priceToBook: number;
  revenue: string;
  netIncome: string;
  employees: number;
  founded: string;
};

export const STOCKS: Record<string, Stock> = {
  AAPL: {id:"stk_aapl",symbol:"AAPL",name:"Apple Inc.",exchange:"NASDAQ",sector:"Technology",price:182.52,change:2.31,changePercent:1.28,volume:"52.4M",marketCap:"2.85T",pe:29.8,dividendYield:0.5,isGainer:true,newsSummary:"Strong iPhone sales, AI momentum",returns:{oneMonth:3.2,sixMonth:12.7,oneYear:18.4},earningsDate:"Dec 19, 2025",beta:1.2,eps:6.13,bookValue:4.82,priceToBook:37.9,revenue:"394.3B",netIncome:"99.8B",employees:164000,founded:"1976"},
  MSFT: {id:"stk_msft",symbol:"MSFT",name:"Microsoft Corporation",exchange:"NASDAQ",sector:"Technology",price:374.12,change:3.45,changePercent:0.93,volume:"21.8M",marketCap:"2.78T",pe:28.2,dividendYield:0.7,isGainer:true,newsSummary:"Azure cloud growth, AI integration across products",returns:{oneMonth:4.1,sixMonth:15.3,oneYear:22.8},earningsDate:"Jan 24, 2025",beta:0.9,eps:13.26,bookValue:25.73,priceToBook:14.5,revenue:"211.9B",netIncome:"72.4B",employees:221000,founded:"1975"},
  GOOGL: {id:"stk_googl",symbol:"GOOGL",name:"Alphabet Inc. (Class A)",exchange:"NASDAQ",sector:"Communication Services",price:163.45,change:2.11,changePercent:1.31,volume:"18.7M",marketCap:"2.05T",pe:23.8,dividendYield:0.0,isGainer:true,newsSummary:"Search dominance continues, AI advancements in Gemini",returns:{oneMonth:2.8,sixMonth:11.4,oneYear:19.2},earningsDate:"Feb 4, 2025",beta:1.1,eps:6.87,bookValue:86.32,priceToBook:1.9,revenue:"282.8B",netIncome:"59.9B",employees:182502,founded:"1998"},
  AMZN: {id:"stk_amzn",symbol:"AMZN",name:"Amazon.com, Inc.",exchange:"NASDAQ",sector:"Consumer Discretionary",price:151.23,change:1.87,changePercent:1.25,volume:"32.1M",marketCap:"1.56T",pe:42.3,dividendYield:0.0,isGainer:true,newsSummary:"AWS growth continues, e-commerce efficiency gains",returns:{oneMonth:3.4,sixMonth:18.7,oneYear:28.9},earningsDate:"Feb 1, 2025",beta:1.3,eps:3.58,bookValue:88.15,priceToBook:1.7,revenue:"574.8B",netIncome:"33.4B",employees:1541000,founded:"1994"},
  META: {id:"stk_meta",symbol:"META",name:"Meta Platforms, Inc.",exchange:"NASDAQ",sector:"Communication Services",price:332.18,change:-2.45,changePercent:-0.73,volume:"15.2M",marketCap:"848.3B",pe:24.1,dividendYield:0.4,isGainer:false,newsSummary:"Metaverse investments paying off, VR adoption growing",returns:{oneMonth:-1.2,sixMonth:21.3,oneYear:67.8},earningsDate:"Jan 31, 2025",beta:1.4,eps:13.77,bookValue:50.84,priceToBook:6.5,revenue:"134.9B",netIncome:"39.1B",employees:77805,founded:"2004"},
  NVDA: {id:"stk_nvda",symbol:"NVDA",name:"NVIDIA Corporation",exchange:"NASDAQ",sector:"Technology",price:118.34,change:4.23,changePercent:3.71,volume:"89.2M",marketCap:"2.91T",pe:63.2,dividendYield:0.03,isGainer:true,newsSummary:"AI chip demand soaring, data center revenue growth",returns:{oneMonth:8.7,sixMonth:45.2,oneYear:178.3},earningsDate:"Feb 21, 2025",beta:1.7,eps:1.87,bookValue:26.12,priceToBook:4.5,revenue:"126.0B",netIncome:"29.8B",employees:29600,founded:"1993"},
  TSLA: {id:"stk_tsla",symbol:"TSLA",name:"Tesla, Inc.",exchange:"NASDAQ",sector:"Consumer Discretionary",price:248.45,change:-3.21,changePercent:-1.28,volume:"45.3M",marketCap:"789.2B",pe:58.9,dividendYield:0.0,isGainer:false,newsSummary:"EV deliveries strong, autonomous driving progress",returns:{oneMonth:-5.2,sixMonth:12.4,oneYear:23.1},earningsDate:"Jan 29, 2025",beta:2.1,eps:4.22,bookValue:25.34,priceToBook:9.8,revenue:"96.8B",netIncome:"15.0B",employees:140473,founded:"2003"},
  NKE: {id:"stk_nke",symbol:"NKE",name:"Nike, Inc.",exchange:"NYSE",sector:"Consumer Discretionary",price:98.45,change:-1.23,changePercent:-1.23,volume:"8.2M",marketCap:"154.2B",pe:24.1,dividendYield:1.4,isGainer:false,newsSummary:"Strong athletic wear demand, expansion in international markets",returns:{oneMonth:-2.1,sixMonth:8.3,oneYear:12.7},earningsDate:"Mar 21, 2025",beta:0.9,eps:4.08,bookValue:15.23,priceToBook:6.5,revenue:"51.2B",netIncome:"5.1B",employees:83700,founded:"1964"},
  PEP: {id:"stk_pep",symbol:"PEP",name:"PepsiCo, Inc.",exchange:"NASDAQ",sector:"Consumer Staples",price:165.78,change:0.89,changePercent:0.54,volume:"4.1M",marketCap:"228.3B",pe:25.4,dividendYield:2.9,isGainer:true,newsSummary:"Steady beverage sales, healthier snack options gaining traction",returns:{oneMonth:1.8,sixMonth:5.2,oneYear:7.1},earningsDate:"Feb 12, 2025",beta:0.6,eps:6.53,bookValue:16.84,priceToBook:9.8,revenue:"86.4B",netIncome:"9.3B",employees:315000,founded:"1965"},
  KO: {id:"stk_ko",symbol:"KO",name:"Coca-Cola Company",exchange:"NYSE",sector:"Consumer Staples",price:61.45,change:0.34,changePercent:0.56,volume:"12.8M",marketCap:"265.4B",pe:26.1,dividendYield:3.1,isGainer:true,newsSummary:"Global brand strength, dividend aristocrat status",returns:{oneMonth:2.1,sixMonth:6.8,oneYear:11.2},earningsDate:"Feb 13, 2025",beta:0.6,eps:2.36,bookValue:11.23,priceToBook:5.5,revenue:"46.0B",netIncome:"10.7B",employees:82500,founded:"1886"},
  MCD: {id:"stk_mcd",symbol:"MCD",name:"McDonald's Corporation",exchange:"NYSE",sector:"Consumer Discretionary",price:287.12,change:1.45,changePercent:0.51,volume:"2.8M",marketCap:"213.5B",pe:24.8,dividendYield:2.1,isGainer:true,newsSummary:"Digital transformation driving efficiency, global expansion",returns:{oneMonth:1.9,sixMonth:8.4,oneYear:13.6},earningsDate:"Jan 30, 2025",beta:0.7,eps:11.57,bookValue:9.54,priceToBook:30.1,revenue:"25.5B",netIncome:"8.5B",employees:200000,founded:"1955"},
  DIS: {id:"stk_dis",symbol:"DIS",name:"The Walt Disney Company",exchange:"NYSE",sector:"Communication Services",price:91.23,change:-0.87,changePercent:-0.94,volume:"9.6M",marketCap:"166.8B",pe:null,dividendYield:0.0,isGainer:false,newsSummary:"Streaming wars continue, parks recovering post-pandemic",returns:{oneMonth:-3.2,sixMonth:2.1,oneYear:-8.4},earningsDate:"Feb 7, 2025",beta:1.2,eps:-0.32,bookValue:54.32,priceToBook:1.7,revenue:"82.7B",netIncome:"-2.5B",employees:220000,founded:"1923"},
  JPM: {id:"stk_jpm",symbol:"JPM",name:"JPMorgan Chase & Co.",exchange:"NYSE",sector:"Financial Services",price:198.45,change:2.34,changePercent:1.19,volume:"11.2M",marketCap:"584.3B",pe:12.8,dividendYield:2.2,isGainer:true,newsSummary:"Net interest income rising with higher rates, trading revenues strong",returns:{oneMonth:4.1,sixMonth:18.7,oneYear:26.3},earningsDate:"Jan 12, 2025",beta:1.1,eps:15.52,bookValue:95.34,priceToBook:2.1,revenue:"162.4B",netIncome:"49.6B",employees:295174,founded:"1799"},
  GS: {id:"stk_gs",symbol:"GS",name:"Goldman Sachs Group, Inc.",exchange:"NYSE",sector:"Financial Services",price:389.67,change:3.21,changePercent:0.83,volume:"1.8M",marketCap:"133.2B",pe:14.2,dividendYield:2.4,isGainer:true,newsSummary:"Investment banking fees recovering, wealth management growth",returns:{oneMonth:5.2,sixMonth:14.1,oneYear:21.8},earningsDate:"Jan 15, 2025",beta:1.4,eps:27.45,bookValue:298.45,priceToBook:1.3,revenue:"50.1B",netIncome:"11.9B",employees:49100,founded:"1869"},
  "BRK.B": {id:"stk_brkb",symbol:"BRK.B",name:"Berkshire Hathaway Inc. (B)",exchange:"NYSE",sector:"Financial Services",price:445.67,change:1.89,changePercent:0.43,volume:"3.4M",marketCap:"986.7B",pe:null,dividendYield:0.0,isGainer:true,newsSummary:"Buffett's conglomerate benefits from diversified holdings",returns:{oneMonth:2.8,sixMonth:12.3,oneYear:18.9},earningsDate:"Feb 24, 2025",beta:0.9,eps:null,bookValue:348.23,priceToBook:1.3,revenue:"364.5B",netIncome:"96.2B",employees:396500,founded:"1839"},
  V: {id:"stk_v",symbol:"V",name:"Visa Inc.",exchange:"NYSE",sector:"Financial Services",price:289.34,change:2.45,changePercent:0.85,volume:"5.8M",marketCap:"612.4B",pe:32.1,dividendYield:0.7,isGainer:true,newsSummary:"Digital payments growth, international expansion strong",returns:{oneMonth:3.4,sixMonth:11.8,oneYear:19.6},earningsDate:"Jan 25, 2025",beta:1.0,eps:9.01,bookValue:19.87,priceToBook:14.6,revenue:"32.7B",netIncome:"17.3B",employees:26500,founded:"1958"},
  MA: {id:"stk_ma",symbol:"MA",name:"Mastercard Incorporated",exchange:"NYSE",sector:"Financial Services",price:445.78,change:3.12,changePercent:0.71,volume:"2.9M",marketCap:"429.8B",pe:33.8,dividendYield:0.5,isGainer:true,newsSummary:"Cross-border volume recovering, cybersecurity investments",returns:{oneMonth:2.9,sixMonth:13.4,oneYear:22.1},earningsDate:"Jan 30, 2025",beta:1.1,eps:13.19,bookValue:24.56,priceToBook:18.1,revenue:"25.1B",netIncome:"11.2B",employees:33400,founded:"1966"},
  NFLX: {id:"stk_nflx",symbol:"NFLX",name:"Netflix, Inc.",exchange:"NASDAQ",sector:"Communication Services",price:487.23,change:-4.56,changePercent:-0.93,volume:"4.2M",marketCap:"209.8B",pe:41.2,dividendYield:0.0,isGainer:false,newsSummary:"Content spending high, subscriber growth in international markets",returns:{oneMonth:-2.1,sixMonth:19.7,oneYear:45.3},earningsDate:"Jan 18, 2025",beta:1.2,eps:11.83,bookValue:45.67,priceToBook:10.7,revenue:"33.7B",netIncome:"5.4B",employees:13000,founded:"1997"},
  ADBE: {id:"stk_adbe",symbol:"ADBE",name:"Adobe Inc.",exchange:"NASDAQ",sector:"Technology",price:567.89,change:8.45,changePercent:1.51,volume:"1.9M",marketCap:"265.4B",pe:44.7,dividendYield:0.0,isGainer:true,newsSummary:"Creative Cloud subscriptions strong, AI features driving adoption",returns:{oneMonth:6.8,sixMonth:21.3,oneYear:34.7},earningsDate:"Mar 14, 2025",beta:1.2,eps:12.71,bookValue:68.34,priceToBook:8.3,revenue:"20.0B",netIncome:"5.8B",employees:29239,founded:"1982"},
  CRM: {id:"stk_crm",symbol:"CRM",name:"Salesforce, Inc.",exchange:"NYSE",sector:"Technology",price:234.56,change:-1.23,changePercent:-0.52,volume:"6.7M",marketCap:"230.5B",pe:58.9,dividendYield:0.0,isGainer:false,newsSummary:"AI integration in CRM, enterprise digital transformation",returns:{oneMonth:-1.8,sixMonth:8.9,oneYear:15.2},earningsDate:"Feb 28, 2025",beta:1.3,eps:3.98,bookValue:34.23,priceToBook:6.9,revenue:"34.9B",netIncome:"4.1B",employees:79390,founded:"1999"},
  ORCL: {id:"stk_orcl",symbol:"ORCL",name:"Oracle Corporation",exchange:"NYSE",sector:"Technology",price:118.67,change:0.98,changePercent:0.83,volume:"14.3M",marketCap:"328.9B",pe:24.3,dividendYield:1.3,isGainer:true,newsSummary:"Cloud infrastructure growth, database modernization trends",returns:{oneMonth:3.1,sixMonth:14.6,oneYear:28.4},earningsDate:"Mar 11, 2025",beta:0.9,eps:4.88,bookValue:12.45,priceToBook:9.5,revenue:"50.0B",netIncome:"11.4B",employees:164000,founded:"1977"},
  INTC: {id:"stk_intc",symbol:"INTC",name:"Intel Corporation",exchange:"NASDAQ",sector:"Technology",price:22.45,change:-0.34,changePercent:-1.49,volume:"45.8M",marketCap:"95.2B",pe:null,dividendYield:1.9,isGainer:false,newsSummary:"Foundry business struggles, competition from NVIDIA and AMD",returns:{oneMonth:-8.4,sixMonth:-15.2,oneYear:-42.1},earningsDate:"Jan 23, 2025",beta:0.8,eps:-1.61,bookValue:34.21,priceToBook:0.7,revenue:"63.1B",netIncome:"-1.6B",employees:131900,founded:"1968"},
  AMD: {id:"stk_amd",symbol:"AMD",name:"Advanced Micro Devices, Inc.",exchange:"NASDAQ",sector:"Technology",price:134.78,change:2.89,changePercent:2.19,volume:"28.9M",marketCap:"217.8B",pe:47.8,dividendYield:0.0,isGainer:true,newsSummary:"AI chip competition with NVIDIA, server CPU market share gains",returns:{oneMonth:12.3,sixMonth:28.7,oneYear:56.8},earningsDate:"Jan 30, 2025",beta:1.9,eps:2.82,bookValue:18.45,priceToBook:7.3,revenue:"25.0B",netIncome:"3.2B",employees:31000,founded:"1969"},
  SQ: {id:"stk_sq",symbol:"SQ",name:"Block, Inc.",exchange:"NYSE",sector:"Financial Services",price:67.89,change:1.45,changePercent:2.18,volume:"8.9M",marketCap:"39.8B",pe:null,dividendYield:0.0,isGainer:true,newsSummary:"Digital payments recovery, Bitcoin strategy questioned",returns:{oneMonth:8.9,sixMonth:-5.2,oneYear:-12.8},earningsDate:"Feb 22, 2025",beta:2.1,eps:-0.43,bookValue:24.56,priceToBook:2.8,revenue:"21.9B",netIncome:"-541M",employees:13000,founded:"2009"},
  PYPL: {id:"stk_pypl",symbol:"PYPL",name:"PayPal Holdings, Inc.",exchange:"NASDAQ",sector:"Financial Services",price:63.45,change:-0.87,changePercent:-1.35,volume:"11.2M",marketCap:"72.1B",pe:18.9,dividendYield:0.0,isGainer:false,newsSummary:"Competition from Apple Pay and other fintech, cost reduction efforts",returns:{oneMonth:-4.2,sixMonth:-8.7,oneYear:-18.9},earningsDate:"Feb 6, 2025",beta:1.3,eps:3.36,bookValue:22.34,priceToBook:2.8,revenue:"29.8B",netIncome:"4.3B",employees:30900,founded:"1998"},
  SHOP: {id:"stk_shop",symbol:"SHOP",name:"Shopify Inc.",exchange:"NYSE",sector:"Technology",price:87.23,change:3.45,changePercent:4.12,volume:"5.4M",marketCap:"110.4B",pe:null,dividendYield:0.0,isGainer:true,newsSummary:"E-commerce platform growth, AI-powered merchant tools",returns:{oneMonth:18.7,sixMonth:34.2,oneYear:67.8},earningsDate:"Feb 13, 2025",beta:1.8,eps:-0.14,bookValue:32.45,priceToBook:2.7,revenue:"7.1B",netIncome:"-3.5B",employees:12600,founded:"2006"},
  UBER: {id:"stk_uber",symbol:"UBER",name:"Uber Technologies, Inc.",exchange:"NYSE",sector:"Technology",price:68.34,change:1.23,changePercent:1.83,volume:"19.8M",marketCap:"139.7B",pe:null,dividendYield:0.0,isGainer:true,newsSummary:"Ride-sharing recovery post-pandemic, delivery segment profitability",returns:{oneMonth:8.4,sixMonth:21.7,oneYear:89.3},earningsDate:"Feb 8, 2025",beta:1.6,eps:-1.87,bookValue:15.67,priceToBook:4.4,revenue:"37.3B",netIncome:"-1.9B",employees:32200,founded:"2009"},
  ABNB: {id:"stk_abnb",symbol:"ABNB",name:"Airbnb, Inc.",exchange:"NASDAQ",sector:"Consumer Discretionary",price:131.45,change:-2.34,changePercent:-1.75,volume:"4.7M",marketCap:"85.2B",pe:17.8,dividendYield:0.0,isGainer:false,newsSummary:"Travel demand strong, regulatory challenges in key markets",returns:{oneMonth:-5.6,sixMonth:12.4,oneYear:23.1},earningsDate:"Feb 13, 2025",beta:1.9,eps:7.38,bookValue:23.45,priceToBook:5.6,revenue:"9.9B",netIncome:"4.8B",employees:6907,founded:"2008"},
  SPOT: {id:"stk_spot",symbol:"SPOT",name:"Spotify Technology S.A.",exchange:"NYSE",sector:"Communication Services",price:187.67,change:4.23,changePercent:2.30,volume:"1.8M",marketCap:"37.4B",pe:null,dividendYield:0.0,isGainer:true,newsSummary:"Podcast strategy paying off, premium subscriber growth",returns:{oneMonth:12.1,sixMonth:45.6,oneYear:78.9},earningsDate:"Feb 4, 2025",beta:1.4,eps:-0.89,bookValue:12.34,priceToBook:15.2,revenue:"13.2B",netIncome:"-462M",employees:9308,founded:"2006"},
  COST: {id:"stk_cost",symbol:"COST",name:"Costco Wholesale Corporation",exchange:"NASDAQ",sector:"Consumer Staples",price:898.45,change:5.67,changePercent:0.63,volume:"1.2M",marketCap:"398.7B",pe:48.9,dividendYield:0.5,isGainer:true,newsSummary:"Membership model resilient, international expansion continues",returns:{oneMonth:2.1,sixMonth:8.9,oneYear:18.4},earningsDate:"Mar 7, 2025",beta:0.7,eps:18.37,bookValue:89.45,priceToBook:10.0,revenue:"249.6B",netIncome:"7.4B",employees:304000,founded:"1976"},
  TSM: {id:"stk_tsm",symbol:"TSM",name:"Taiwan Semiconductor Mfg.",exchange:"NYSE",sector:"Technology",price:132.45,change:2.34,changePercent:1.80,volume:"16.7M",marketCap:"686.8B",pe:18.9,dividendYield:1.8,isGainer:true,newsSummary:"Leading-edge chip manufacturing, Apple and NVIDIA partnerships",returns:{oneMonth:6.7,sixMonth:23.4,oneYear:45.1},earningsDate:"Jan 17, 2025",beta:1.1,eps:7.01,bookValue:45.67,priceToBook:2.9,revenue:"75.9B",netIncome:"26.9B",employees:73894,founded:"1987"}
};

export const CANONICAL = (s: string) => s.trim().toUpperCase();
export const getStock = (s: string) => STOCKS[CANONICAL(s)] ?? null;
export const ALL_SYMBOLS = Object.keys(STOCKS); // 31 tickers

// Additional utility functions
export const hasStock = (symbol: string): boolean => {
  return Boolean(getStock(symbol));
};

export const getAllStocks = (): Stock[] => {
  return Object.values(STOCKS);
};

export const validateStock = (symbol: string): { isValid: boolean; error?: string } => {
  const trimmed = symbol.trim();

  if (!trimmed) {
    return { isValid: false, error: "Symbol cannot be empty" };
  }

  const normalized = trimmed.toUpperCase();

  if (!STOCKS[normalized]) {
    return { isValid: false, error: `Unknown symbol: ${normalized}` };
  }

  return { isValid: true };
};

// Export count for monitoring
export const STOCK_COUNT = Object.keys(STOCKS).length;
