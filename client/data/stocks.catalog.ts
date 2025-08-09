// Single Source of Truth for all stocks - Simplified structure
export type Stock = {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
};

export const STOCKS: Record<string, Stock> = {
  AAPL: { id: "stk_aapl", symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
  MSFT: { id: "stk_msft", symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
  AMZN: { id: "stk_amzn", symbol: "AMZN", name: "Amazon.com, Inc.", exchange: "NASDAQ" },
  NVDA: { id: "stk_nvda", symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
  GOOGL: { id: "stk_googl", symbol: "GOOGL", name: "Alphabet Inc. (Class A)", exchange: "NASDAQ" },
  META: { id: "stk_meta", symbol: "META", name: "Meta Platforms, Inc.", exchange: "NASDAQ" },
  TSLA: { id: "stk_tsla", symbol: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ" },
  "BRK.B": { id: "stk_brkb", symbol: "BRK.B", name: "Berkshire Hathaway Inc. (B)", exchange: "NYSE" },
  UNH: { id: "stk_unh", symbol: "UNH", name: "UnitedHealth Group", exchange: "NYSE" },
  JNJ: { id: "stk_jnj", symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE" },
  V: { id: "stk_v", symbol: "V", name: "Visa Inc.", exchange: "NYSE" },
  XOM: { id: "stk_xom", symbol: "XOM", name: "Exxon Mobil Corporation", exchange: "NYSE" },
  JPM: { id: "stk_jpm", symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE" },
  WMT: { id: "stk_wmt", symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE" },
  PG: { id: "stk_pg", symbol: "PG", name: "Procter & Gamble Company", exchange: "NYSE" },
  MA: { id: "stk_ma", symbol: "MA", name: "Mastercard Incorporated", exchange: "NYSE" },
  HD: { id: "stk_hd", symbol: "HD", name: "The Home Depot, Inc.", exchange: "NYSE" },
  MRK: { id: "stk_mrk", symbol: "MRK", name: "Merck & Co., Inc.", exchange: "NYSE" },
  CVX: { id: "stk_cvx", symbol: "CVX", name: "Chevron Corporation", exchange: "NYSE" },
  LLY: { id: "stk_lly", symbol: "LLY", name: "Eli Lilly and Company", exchange: "NYSE" },
  PEP: { id: "stk_pep", symbol: "PEP", name: "PepsiCo, Inc.", exchange: "NASDAQ" },
  BAC: { id: "stk_bac", symbol: "BAC", name: "Bank of America Corporation", exchange: "NYSE" },
  ABBV: { id: "stk_abbv", symbol: "ABBV", name: "AbbVie Inc.", exchange: "NYSE" },
  COST: { id: "stk_cost", symbol: "COST", name: "Costco Wholesale Corporation", exchange: "NASDAQ" },
  AVGO: { id: "stk_avgo", symbol: "AVGO", name: "Broadcom Inc.", exchange: "NASDAQ" },
  KO: { id: "stk_ko", symbol: "KO", name: "The Coca-Cola Company", exchange: "NYSE" },
  TMO: { id: "stk_tmo", symbol: "TMO", name: "Thermo Fisher Scientific Inc.", exchange: "NYSE" },
  CSCO: { id: "stk_csco", symbol: "CSCO", name: "Cisco Systems, Inc.", exchange: "NASDAQ" },
  MCD: { id: "stk_mcd", symbol: "MCD", name: "McDonald's Corporation", exchange: "NYSE" },
  CRM: { id: "stk_crm", symbol: "CRM", name: "Salesforce, Inc.", exchange: "NYSE" },
  ACN: { id: "stk_acn", symbol: "ACN", name: "Accenture plc", exchange: "NYSE" },
  ADBE: { id: "stk_adbe", symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ" },
  WFC: { id: "stk_wfc", symbol: "WFC", name: "Wells Fargo & Company", exchange: "NYSE" },
  DHR: { id: "stk_dhr", symbol: "DHR", name: "Danaher Corporation", exchange: "NYSE" },
  QCOM: { id: "stk_qcom", symbol: "QCOM", name: "QUALCOMM Incorporated", exchange: "NASDAQ" },
  TXN: { id: "stk_txn", symbol: "TXN", name: "Texas Instruments Incorporated", exchange: "NASDAQ" },
  UPS: { id: "stk_ups", symbol: "UPS", name: "United Parcel Service, Inc.", exchange: "NYSE" },
  LIN: { id: "stk_lin", symbol: "LIN", name: "Linde plc", exchange: "NYSE" },
  ORCL: { id: "stk_orcl", symbol: "ORCL", name: "Oracle Corporation", exchange: "NYSE" },
  PFE: { id: "stk_pfe", symbol: "PFE", name: "Pfizer Inc.", exchange: "NYSE" },
  IBM: { id: "stk_ibm", symbol: "IBM", name: "International Business Machines Corporation", exchange: "NYSE" },
  DIS: { id: "stk_dis", symbol: "DIS", name: "The Walt Disney Company", exchange: "NYSE" },
  CAT: { id: "stk_cat", symbol: "CAT", name: "Caterpillar Inc.", exchange: "NYSE" },
  INTU: { id: "stk_intu", symbol: "INTU", name: "Intuit Inc.", exchange: "NASDAQ" },
  COP: { id: "stk_cop", symbol: "COP", name: "ConocoPhillips", exchange: "NYSE" },
  RTX: { id: "stk_rtx", symbol: "RTX", name: "RTX Corporation", exchange: "NYSE" },
  PM: { id: "stk_pm", symbol: "PM", name: "Philip Morris International Inc.", exchange: "NYSE" },
  LMT: { id: "stk_lmt", symbol: "LMT", name: "Lockheed Martin Corporation", exchange: "NYSE" },
  LOW: { id: "stk_low", symbol: "LOW", name: "Lowe's Companies, Inc.", exchange: "NYSE" },
  HON: { id: "stk_hon", symbol: "HON", name: "Honeywell International Inc.", exchange: "NASDAQ" },
  NEE: { id: "stk_nee", symbol: "NEE", name: "NextEra Energy, Inc.", exchange: "NYSE" },
  SBUX: { id: "stk_sbux", symbol: "SBUX", name: "Starbucks Corporation", exchange: "NASDAQ" },
  BKNG: { id: "stk_bkng", symbol: "BKNG", name: "Booking Holdings Inc.", exchange: "NASDAQ" },
  AMGN: { id: "stk_amgn", symbol: "AMGN", name: "Amgen Inc.", exchange: "NASDAQ" },
  AMAT: { id: "stk_amat", symbol: "AMAT", name: "Applied Materials, Inc.", exchange: "NASDAQ" },
  AMD: { id: "stk_amd", symbol: "AMD", name: "Advanced Micro Devices, Inc.", exchange: "NASDAQ" },
  GILD: { id: "stk_gild", symbol: "GILD", name: "Gilead Sciences, Inc.", exchange: "NASDAQ" },
  GE: { id: "stk_ge", symbol: "GE", name: "General Electric Company", exchange: "NYSE" },
  SPGI: { id: "stk_spgi", symbol: "SPGI", name: "S&P Global Inc.", exchange: "NYSE" },
  NOW: { id: "stk_now", symbol: "NOW", name: "ServiceNow, Inc.", exchange: "NYSE" },
  C: { id: "stk_c", symbol: "C", name: "Citigroup Inc.", exchange: "NYSE" },
  DE: { id: "stk_de", symbol: "DE", name: "Deere & Company", exchange: "NYSE" },
  ADI: { id: "stk_adi", symbol: "ADI", name: "Analog Devices, Inc.", exchange: "NASDAQ" },
  TMUS: { id: "stk_tmus", symbol: "TMUS", name: "T-Mobile US, Inc.", exchange: "NASDAQ" },
  T: { id: "stk_t", symbol: "T", name: "AT&T Inc.", exchange: "NYSE" },
  BLK: { id: "stk_blk", symbol: "BLK", name: "BlackRock, Inc.", exchange: "NYSE" },
  MU: { id: "stk_mu", symbol: "MU", name: "Micron Technology, Inc.", exchange: "NASDAQ" },
  EOG: { id: "stk_eog", symbol: "EOG", name: "EOG Resources, Inc.", exchange: "NYSE" },
  ELV: { id: "stk_elv", symbol: "ELV", name: "Elevance Health, Inc.", exchange: "NYSE" },
  CVS: { id: "stk_cvs", symbol: "CVS", name: "CVS Health Corporation", exchange: "NYSE" },
  PGR: { id: "stk_pgr", symbol: "PGR", name: "The Progressive Corporation", exchange: "NYSE" },
  USB: { id: "stk_usb", symbol: "USB", name: "U.S. Bancorp", exchange: "NYSE" },
  CME: { id: "stk_cme", symbol: "CME", name: "CME Group Inc.", exchange: "NASDAQ" },
  ZTS: { id: "stk_zts", symbol: "ZTS", name: "Zoetis Inc.", exchange: "NYSE" },
  SCHW: { id: "stk_schw", symbol: "SCHW", name: "The Charles Schwab Corporation", exchange: "NYSE" },
  MDLZ: { id: "stk_mdlz", symbol: "MDLZ", name: "Mondelez International, Inc.", exchange: "NASDAQ" },
  MSCI: { id: "stk_msci", symbol: "MSCI", name: "MSCI Inc.", exchange: "NYSE" },
  PLD: { id: "stk_pld", symbol: "PLD", name: "Prologis, Inc.", exchange: "NYSE" },
  CHTR: { id: "stk_chtr", symbol: "CHTR", name: "Charter Communications, Inc.", exchange: "NASDAQ" },
  TGT: { id: "stk_tgt", symbol: "TGT", name: "Target Corporation", exchange: "NYSE" },
  HCA: { id: "stk_hca", symbol: "HCA", name: "HCA Healthcare, Inc.", exchange: "NYSE" },
  MO: { id: "stk_mo", symbol: "MO", name: "Altria Group, Inc.", exchange: "NYSE" },
  REGN: { id: "stk_regn", symbol: "REGN", name: "Regeneron Pharmaceuticals, Inc.", exchange: "NASDAQ" },
  BK: { id: "stk_bk", symbol: "BK", name: "The Bank of New York Mellon Corporation", exchange: "NYSE" },
  SO: { id: "stk_so", symbol: "SO", name: "The Southern Company", exchange: "NYSE" },
  DUK: { id: "stk_duk", symbol: "DUK", name: "Duke Energy Corporation", exchange: "NYSE" },
  ICE: { id: "stk_ice", symbol: "ICE", name: "Intercontinental Exchange, Inc.", exchange: "NYSE" },
  CB: { id: "stk_cb", symbol: "CB", name: "Chubb Limited", exchange: "NYSE" },
  AON: { id: "stk_aon", symbol: "AON", name: "Aon plc", exchange: "NYSE" },
  EQIX: { id: "stk_eqix", symbol: "EQIX", name: "Equinix, Inc.", exchange: "NASDAQ" },
  CL: { id: "stk_cl", symbol: "CL", name: "Colgate-Palmolive Company", exchange: "NYSE" },
  GM: { id: "stk_gm", symbol: "GM", name: "General Motors Company", exchange: "NYSE" },
  F: { id: "stk_f", symbol: "F", name: "Ford Motor Company", exchange: "NYSE" },
  PANW: { id: "stk_panw", symbol: "PANW", name: "Palo Alto Networks, Inc.", exchange: "NASDAQ" },
  LRCX: { id: "stk_lrcx", symbol: "LRCX", name: "Lam Research Corporation", exchange: "NASDAQ" },
  KLAC: { id: "stk_klac", symbol: "KLAC", name: "KLA Corporation", exchange: "NASDAQ" },
  MRVL: { id: "stk_mrvl", symbol: "MRVL", name: "Marvell Technology, Inc.", exchange: "NASDAQ" },
  NOC: { id: "stk_noc", symbol: "NOC", name: "Northrop Grumman Corporation", exchange: "NYSE" },
  ADP: { id: "stk_adp", symbol: "ADP", name: "Automatic Data Processing, Inc.", exchange: "NASDAQ" },
  LULU: { id: "stk_lulu", symbol: "LULU", name: "Lululemon Athletica Inc.", exchange: "NASDAQ" },
  NKE: { id: "stk_nke", symbol: "NKE", name: "Nike, Inc.", exchange: "NYSE" },
  GS: { id: "stk_gs", symbol: "GS", name: "Goldman Sachs Group, Inc.", exchange: "NYSE" },
  NFLX: { id: "stk_nflx", symbol: "NFLX", name: "Netflix, Inc.", exchange: "NASDAQ" },
  SQ: { id: "stk_sq", symbol: "SQ", name: "Block, Inc.", exchange: "NYSE" },
  PYPL: { id: "stk_pypl", symbol: "PYPL", name: "PayPal Holdings, Inc.", exchange: "NASDAQ" },
  SHOP: { id: "stk_shop", symbol: "SHOP", name: "Shopify Inc.", exchange: "NYSE" },
  UBER: { id: "stk_uber", symbol: "UBER", name: "Uber Technologies, Inc.", exchange: "NYSE" },
  ABNB: { id: "stk_abnb", symbol: "ABNB", name: "Airbnb, Inc.", exchange: "NASDAQ" },
  SPOT: { id: "stk_spot", symbol: "SPOT", name: "Spotify Technology S.A.", exchange: "NYSE" },
  TSM: { id: "stk_tsm", symbol: "TSM", name: "Taiwan Semiconductor Mfg.", exchange: "NYSE" },
  COIN: { id: "stk_coin", symbol: "COIN", name: "Coinbase Global, Inc.", exchange: "NASDAQ" },
  INTC: { id: "stk_intc", symbol: "INTC", name: "Intel Corporation", exchange: "NASDAQ" },
};

// Symbol normalization and resolution
export const resolveSymbol = (raw: string): string | null => {
  if (!raw) return null;
  const normalized = raw.trim().toUpperCase();
  
  // Handle common BRK.B aliases
  if (["BRKB", "BRK-B", "BRK/B", "BERKSHIRE"].includes(normalized)) {
    return "BRK.B";
  }
  
  return STOCKS[normalized] ? normalized : null;
};

export const getStock = (symbol: string): Stock | null => {
  const resolved = resolveSymbol(symbol);
  return resolved ? STOCKS[resolved] : null;
};

export const validateStock = (symbol: string): { isValid: boolean; error?: string } => {
  const trimmed = symbol?.trim();
  
  if (!trimmed) {
    return { isValid: false, error: "Symbol cannot be empty" };
  }
  
  const resolved = resolveSymbol(trimmed);
  if (!resolved) {
    return { isValid: false, error: `Unknown symbol: ${trimmed.toUpperCase()}` };
  }
  
  return { isValid: true };
};

export const getAllStocks = (): Stock[] => Object.values(STOCKS);
export const ALL_SYMBOLS = Object.keys(STOCKS);
export const STOCK_COUNT = ALL_SYMBOLS.length; // 100+ stocks
