import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, TrendingDown, Minus, DollarSign, Activity, BarChart3 } from 'lucide-react';
import type { Fundamental } from '../types/database';

export default function Fundamentals() {
  const [fundamentals, setFundamentals] = useState<Fundamental[]>([]);
  const [selectedStock, setSelectedStock] = useState<Fundamental | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFundamentals() {
      const { data } = await supabase.from('fundamentals').select('*').order('updated_at', { ascending: false });
      if (data) setFundamentals(data);
      setLoading(false);
    }

    fetchFundamentals();
  }, []);

  const getBiasIcon = (bias: string) => {
    if (bias === 'positive') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (bias === 'negative') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-neutral-500" />;
  };

  const getBiasColor = (bias: string) => {
    if (bias === 'positive') return 'text-emerald-400 bg-emerald-900/30';
    if (bias === 'negative') return 'text-red-400 bg-red-900/30';
    return 'text-neutral-400 bg-neutral-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-400">Loading fundamental analysis...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Fundamental Analysis</h1>
        <p className="text-neutral-400">
          Long-term quality assessment based on financial health and growth indicators
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {fundamentals.map((stock) => (
          <div
            key={stock.id}
            onClick={() => setSelectedStock(stock)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-neutral-700 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-neutral-100">{stock.symbol}</h3>
                <p className="text-sm text-neutral-400">{stock.company_name}</p>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded ${getBiasColor(stock.long_term_bias)}`}>
                {getBiasIcon(stock.long_term_bias)}
                <span className="text-xs capitalize">{stock.long_term_bias}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-neutral-500">Financial Health</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500">ROE:</span>
                    <span className="text-neutral-300 ml-1">{(stock.financial_health.roe * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Debt:</span>
                    <span className="text-neutral-300 ml-1">{stock.financial_health.debt_ratio.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-neutral-500">Growth Indicators</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500">Revenue:</span>
                    <span className={`ml-1 ${stock.growth_indicators.revenue_growth_3y >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stock.growth_indicators.revenue_growth_3y >= 0 ? '+' : ''}{(stock.growth_indicators.revenue_growth_3y * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Earnings:</span>
                    <span className={`ml-1 ${stock.growth_indicators.earnings_growth_3y >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stock.growth_indicators.earnings_growth_3y >= 0 ? '+' : ''}{(stock.growth_indicators.earnings_growth_3y * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-neutral-500">Valuation</span>
                </div>
                <div className="text-xs">
                  <span className="text-neutral-500">P/E:</span>
                  <span className="text-neutral-300 ml-1">{stock.valuation_metrics.pe_ratio.toFixed(1)}</span>
                  <span className="text-neutral-600 ml-2">|</span>
                  <span className="text-neutral-500 ml-2">P/S:</span>
                  <span className="text-neutral-300 ml-1">{stock.valuation_metrics.ps_ratio.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStock && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-neutral-100">{selectedStock.symbol}</h2>
              <p className="text-neutral-400">{selectedStock.company_name}</p>
            </div>
            <button
              onClick={() => setSelectedStock(null)}
              className="text-neutral-500 hover:text-neutral-300 text-sm"
            >
              Close
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Activity className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-semibold text-neutral-200">Financial Health</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Return on Equity</span>
                  <span className="text-neutral-200 font-medium">
                    {(selectedStock.financial_health.roe * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Debt Ratio</span>
                  <span className="text-neutral-200 font-medium">
                    {selectedStock.financial_health.debt_ratio.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Current Ratio</span>
                  <span className="text-neutral-200 font-medium">
                    {selectedStock.financial_health.current_ratio.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Cash Position</span>
                  <span className="text-neutral-200 font-medium capitalize">
                    {selectedStock.financial_health.cash_position}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-semibold text-neutral-200">Growth Indicators</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Revenue Growth (3Y)</span>
                  <span className={selectedStock.growth_indicators.revenue_growth_3y >= 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                    {selectedStock.growth_indicators.revenue_growth_3y >= 0 ? '+' : ''}{(selectedStock.growth_indicators.revenue_growth_3y * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Earnings Growth (3Y)</span>
                  <span className={selectedStock.growth_indicators.earnings_growth_3y >= 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                    {selectedStock.growth_indicators.earnings_growth_3y >= 0 ? '+' : ''}{(selectedStock.growth_indicators.earnings_growth_3y * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Margin Trend</span>
                  <span className="text-neutral-200 font-medium capitalize">
                    {selectedStock.growth_indicators.margin_trend}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Market Share</span>
                  <span className="text-neutral-200 font-medium capitalize">
                    {selectedStock.growth_indicators.market_share}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-semibold text-neutral-200">Valuation Metrics</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">P/E Ratio</span>
                  <span className="text-neutral-200 font-medium">
                    {selectedStock.valuation_metrics.pe_ratio.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">PEG Ratio</span>
                  <span className="text-neutral-200 font-medium">
                    {selectedStock.valuation_metrics.peg_ratio?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">P/S Ratio</span>
                  <span className="text-neutral-200 font-medium">
                    {selectedStock.valuation_metrics.ps_ratio.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Relative Valuation</span>
                  <span className="text-neutral-200 font-medium capitalize text-xs">
                    {selectedStock.valuation_metrics.relative_valuation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-neutral-200 mb-3">AI Analysis</h3>
            <p className="text-neutral-400 leading-relaxed text-sm">{selectedStock.ai_explanation}</p>
          </div>

          <div className="mt-4 text-xs text-neutral-500">
            Last updated: {new Date(selectedStock.updated_at).toLocaleString()}
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4 text-neutral-100">About Fundamental Analysis</h2>
        <div className="space-y-3 text-sm text-neutral-400 leading-relaxed">
          <p>
            Fundamental analysis evaluates long-term investment quality based on financial metrics,
            growth trajectory, and valuation. This is distinct from technical pattern recognition.
          </p>
          <p>
            The AI explanation synthesizes multiple data points to provide context on why a stock
            may or may not qualify for long-term consideration. This analysis supplements, not
            replaces, your own research.
          </p>
          <p>
            Metrics represent historical data and current valuations. Future performance depends
            on execution, market conditions, and factors not captured in quantitative analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
