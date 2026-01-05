import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Filter, Clock, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import type { FilteredStock, Strategy } from '../types/database';

export default function FilteredStocks() {
  const [stocks, setStocks] = useState<FilteredStock[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<FilteredStock | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [stocksRes, strategiesRes] = await Promise.all([
        supabase.from('filtered_stocks').select('*').order('filtered_at', { ascending: false }),
        supabase.from('strategies').select('*'),
      ]);

      if (stocksRes.data) setStocks(stocksRes.data);
      if (strategiesRes.data) setStrategies(strategiesRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  const filteredStocks = stocks.filter((stock) => {
    if (selectedStrategy !== 'all' && stock.strategy_id !== selectedStrategy) return false;
    if (selectedSector !== 'all' && stock.sector !== selectedSector) return false;
    if (selectedConfidence !== 'all' && stock.confidence_level !== selectedConfidence) return false;
    return true;
  });

  const sectors = Array.from(new Set(stocks.map((s) => s.sector)));

  const getStrategyName = (strategyId: string) => {
    return strategies.find((s) => s.id === strategyId)?.name || 'Unknown';
  };

  const getTrendIcon = (bias: string) => {
    if (bias === 'bullish') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (bias === 'bearish') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-neutral-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-400">Loading filtered stocks...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Filtered Stocks</h1>
        <p className="text-neutral-400">
          Strategy-matched results with explainable selection criteria
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-300">Filters</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Strategy</label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-slate-600"
            >
              <option value="all">All Strategies</option>
              {strategies.map((strategy) => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-slate-600"
            >
              <option value="all">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Confidence Level</label>
            <select
              value={selectedConfidence}
              onChange={(e) => setSelectedConfidence(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-slate-600"
            >
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800 border-b border-neutral-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Strategy
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Trend
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Filtered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <tr
                    key={stock.id}
                    onClick={() => setSelectedStock(stock)}
                    className="hover:bg-neutral-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold text-neutral-100">{stock.symbol}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm text-neutral-200">{stock.company_name}</div>
                        <div className="text-xs text-neutral-500">{stock.sector}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-neutral-300">{getStrategyName(stock.strategy_id)}</div>
                      <div className="text-xs text-neutral-500 capitalize">{stock.timeframe}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(stock.trend_bias)}
                        <span className="text-sm text-neutral-300 capitalize">{stock.trend_bias}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-lg font-semibold text-neutral-100">{stock.strength_score}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          stock.confidence_level === 'high'
                            ? 'bg-emerald-900/30 text-emerald-400'
                            : stock.confidence_level === 'medium'
                            ? 'bg-amber-900/30 text-amber-400'
                            : 'bg-neutral-700 text-neutral-400'
                        }`}
                      >
                        {stock.confidence_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-xs text-neutral-500">
                        {new Date(stock.filtered_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {new Date(stock.filtered_at).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-500">
                    No stocks match current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStock && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-100">
              Why {selectedStock.symbol} was selected
            </h2>
            <button
              onClick={() => setSelectedStock(null)}
              className="text-neutral-500 hover:text-neutral-300 text-sm"
            >
              Close
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-3">Matched Rules</h3>
              <div className="space-y-2">
                {selectedStock.match_explanation.matched_rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span className="text-neutral-400">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-3">Catalyst</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                {selectedStock.match_explanation.catalyst}
              </p>

              <h3 className="text-sm font-medium text-neutral-300 mb-3">Risk Factors</h3>
              <div className="space-y-2">
                {selectedStock.match_explanation.risk_factors.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-400">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center space-x-2 text-xs text-neutral-500">
            <Clock className="w-3 h-3" />
            <span>Data updated: {new Date(selectedStock.data_freshness).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-amber-900/50 rounded-lg p-4 mt-6">
        <p className="text-xs text-neutral-400 leading-relaxed">
          These stocks matched strategy criteria at the time of filtering. This is intelligence for
          consideration, not a recommendation to trade. Always conduct your own analysis and
          consider current market conditions.
        </p>
      </div>
    </div>
  );
}
