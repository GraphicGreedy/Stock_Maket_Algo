export interface Database {
  public: {
    Tables: {
      strategies: {
        Row: Strategy;
        Insert: Omit<Strategy, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Strategy, 'id' | 'created_at'>>;
      };
      filtered_stocks: {
        Row: FilteredStock;
        Insert: Omit<FilteredStock, 'id' | 'filtered_at'>;
        Update: Partial<Omit<FilteredStock, 'id'>>;
      };
      fundamentals: {
        Row: Fundamental;
        Insert: Omit<Fundamental, 'id' | 'updated_at'>;
        Update: Partial<Omit<Fundamental, 'id'>>;
      };
      market_regime: {
        Row: MarketRegime;
        Insert: Omit<MarketRegime, 'id' | 'updated_at'>;
        Update: Partial<Omit<MarketRegime, 'id'>>;
      };
      data_integrations: {
        Row: DataIntegration;
        Insert: Omit<DataIntegration, 'id' | 'created_at'>;
        Update: Partial<Omit<DataIntegration, 'id'>>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Omit<UserPreferences, 'id' | 'updated_at'>;
        Update: Partial<Omit<UserPreferences, 'id'>>;
      };
    };
  };
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  timeframe: 'swing' | 'positional' | 'long-term';
  logic_type: 'price_action' | 'volume' | 'fundamentals' | 'hybrid';
  market_suitability: 'trend' | 'range' | 'volatile' | 'all';
  status: 'active' | 'paused' | 'training';
  core_rules: {
    rules: string[];
    entry_logic: string;
    exit_logic: string;
  };
  risk_profile: string;
  confidence_threshold: number;
  backtest_summary: {
    win_rate: number;
    avg_return: number;
    max_drawdown: number;
    trades_analyzed: number;
  };
  created_at: string;
  updated_at: string;
}

export interface FilteredStock {
  id: string;
  strategy_id: string;
  symbol: string;
  company_name: string;
  sector: string;
  market_cap: 'large' | 'mid' | 'small';
  timeframe: string;
  trend_bias: 'bullish' | 'bearish' | 'neutral';
  strength_score: number;
  confidence_level: 'high' | 'medium' | 'low';
  match_explanation: {
    matched_rules: string[];
    catalyst: string;
    risk_factors: string[];
  };
  filtered_at: string;
  data_freshness: string;
}

export interface Fundamental {
  id: string;
  symbol: string;
  company_name: string;
  financial_health: {
    debt_ratio: number;
    current_ratio: number;
    roe: number;
    cash_position: string;
  };
  growth_indicators: {
    revenue_growth_3y: number;
    earnings_growth_3y: number;
    margin_trend: string;
    market_share: string;
  };
  valuation_metrics: {
    pe_ratio: number;
    peg_ratio: number | null;
    ps_ratio: number;
    relative_valuation: string;
  };
  long_term_bias: 'positive' | 'neutral' | 'negative';
  ai_explanation: string;
  updated_at: string;
}

export interface MarketRegime {
  id: string;
  regime_type: 'trending' | 'sideways' | 'uncertain';
  regime_strength: number;
  description: string;
  updated_at: string;
}

export interface DataIntegration {
  id: string;
  integration_type: 'google_sheets' | 'api' | 'other';
  connection_name: string;
  sync_status: 'connected' | 'syncing' | 'error' | 'disconnected';
  last_sync: string | null;
  config: Record<string, unknown>;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string | null;
  theme: 'dark' | 'light';
  visible_strategies: string[];
  data_sync_enabled: boolean;
  updated_at: string;
}
