/*
  # Stock Analysis Platform Schema

  ## Overview
  Comprehensive database schema for institutional-grade AI-powered stock analysis platform
  
  ## New Tables
  
  ### 1. strategies
  Core strategy management with AI logic configuration
  - `id` (uuid, primary key)
  - `name` (text) - Strategy display name
  - `description` (text) - Strategy overview
  - `timeframe` (text) - swing/positional/long-term
  - `logic_type` (text) - price_action/volume/fundamentals/hybrid
  - `market_suitability` (text) - trend/range/volatile
  - `status` (text) - active/paused/training
  - `core_rules` (jsonb) - Strategy rules and logic
  - `risk_profile` (text) - Risk characteristics
  - `confidence_threshold` (numeric) - Minimum confidence for filtering
  - `backtest_summary` (jsonb) - Historical performance data
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. filtered_stocks
  Stock screening results from strategy execution
  - `id` (uuid, primary key)
  - `strategy_id` (uuid, foreign key)
  - `symbol` (text) - Stock ticker
  - `company_name` (text)
  - `sector` (text)
  - `market_cap` (text) - large/mid/small
  - `timeframe` (text)
  - `trend_bias` (text) - bullish/bearish/neutral
  - `strength_score` (numeric) - 0-100 score
  - `confidence_level` (text) - high/medium/low
  - `match_explanation` (jsonb) - Why this stock was selected
  - `filtered_at` (timestamptz)
  - `data_freshness` (timestamptz) - When data was last updated
  
  ### 3. fundamentals
  Fundamental analysis data for stocks
  - `id` (uuid, primary key)
  - `symbol` (text, unique)
  - `company_name` (text)
  - `financial_health` (jsonb) - Health indicators
  - `growth_indicators` (jsonb) - Growth metrics
  - `valuation_metrics` (jsonb) - Valuation data
  - `long_term_bias` (text) - positive/neutral/negative
  - `ai_explanation` (text) - Why stock qualifies fundamentally
  - `updated_at` (timestamptz)
  
  ### 4. market_regime
  Current market condition tracking
  - `id` (uuid, primary key)
  - `regime_type` (text) - trending/sideways/uncertain
  - `regime_strength` (numeric) - 0-100
  - `description` (text)
  - `updated_at` (timestamptz)
  
  ### 5. data_integrations
  External data source connections
  - `id` (uuid, primary key)
  - `integration_type` (text) - google_sheets/api/other
  - `connection_name` (text)
  - `sync_status` (text) - connected/syncing/error/disconnected
  - `last_sync` (timestamptz)
  - `config` (jsonb) - Connection configuration
  - `created_at` (timestamptz)
  
  ### 6. user_preferences
  User settings and preferences
  - `id` (uuid, primary key)
  - `user_id` (uuid) - For future auth integration
  - `theme` (text) - dark/light
  - `visible_strategies` (text[]) - Array of strategy IDs
  - `data_sync_enabled` (boolean)
  - `updated_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Public read access for demo (can be restricted later)
  - Write access restricted for production data
*/

-- Create strategies table
CREATE TABLE IF NOT EXISTS strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  timeframe text NOT NULL CHECK (timeframe IN ('swing', 'positional', 'long-term')),
  logic_type text NOT NULL CHECK (logic_type IN ('price_action', 'volume', 'fundamentals', 'hybrid')),
  market_suitability text NOT NULL CHECK (market_suitability IN ('trend', 'range', 'volatile', 'all')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'training')),
  core_rules jsonb NOT NULL DEFAULT '{}',
  risk_profile text NOT NULL,
  confidence_threshold numeric DEFAULT 0.6 CHECK (confidence_threshold >= 0 AND confidence_threshold <= 1),
  backtest_summary jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create filtered_stocks table
CREATE TABLE IF NOT EXISTS filtered_stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  company_name text NOT NULL,
  sector text NOT NULL,
  market_cap text NOT NULL CHECK (market_cap IN ('large', 'mid', 'small')),
  timeframe text NOT NULL,
  trend_bias text NOT NULL CHECK (trend_bias IN ('bullish', 'bearish', 'neutral')),
  strength_score numeric NOT NULL CHECK (strength_score >= 0 AND strength_score <= 100),
  confidence_level text NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),
  match_explanation jsonb NOT NULL DEFAULT '{}',
  filtered_at timestamptz DEFAULT now(),
  data_freshness timestamptz DEFAULT now()
);

-- Create fundamentals table
CREATE TABLE IF NOT EXISTS fundamentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  company_name text NOT NULL,
  financial_health jsonb NOT NULL DEFAULT '{}',
  growth_indicators jsonb NOT NULL DEFAULT '{}',
  valuation_metrics jsonb NOT NULL DEFAULT '{}',
  long_term_bias text NOT NULL CHECK (long_term_bias IN ('positive', 'neutral', 'negative')),
  ai_explanation text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create market_regime table
CREATE TABLE IF NOT EXISTS market_regime (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regime_type text NOT NULL CHECK (regime_type IN ('trending', 'sideways', 'uncertain')),
  regime_strength numeric NOT NULL CHECK (regime_strength >= 0 AND regime_strength <= 100),
  description text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create data_integrations table
CREATE TABLE IF NOT EXISTS data_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type text NOT NULL CHECK (integration_type IN ('google_sheets', 'api', 'other')),
  connection_name text NOT NULL,
  sync_status text NOT NULL DEFAULT 'disconnected' CHECK (sync_status IN ('connected', 'syncing', 'error', 'disconnected')),
  last_sync timestamptz,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  theme text DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  visible_strategies text[] DEFAULT '{}',
  data_sync_enabled boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_filtered_stocks_strategy ON filtered_stocks(strategy_id);
CREATE INDEX IF NOT EXISTS idx_filtered_stocks_symbol ON filtered_stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_filtered_stocks_filtered_at ON filtered_stocks(filtered_at DESC);
CREATE INDEX IF NOT EXISTS idx_fundamentals_symbol ON fundamentals(symbol);

-- Enable Row Level Security
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE filtered_stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fundamentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_regime ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Public read access for demo (can be restricted later with auth)
CREATE POLICY "Public read access for strategies"
  ON strategies FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for filtered_stocks"
  ON filtered_stocks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for fundamentals"
  ON fundamentals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for market_regime"
  ON market_regime FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for data_integrations"
  ON data_integrations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for user_preferences"
  ON user_preferences FOR SELECT
  TO anon
  USING (true);