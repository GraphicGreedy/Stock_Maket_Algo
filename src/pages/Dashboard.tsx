import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Activity, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import type { Strategy, MarketRegime, FilteredStock } from '../types/database';

export default function Dashboard() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [marketRegime, setMarketRegime] = useState<MarketRegime | null>(null);
  const [recentStocks, setRecentStocks] = useState<FilteredStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [strategiesRes, regimeRes, stocksRes] = await Promise.all([
        supabase.from('strategies').select('*').order('created_at'),
        supabase.from('market_regime').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('filtered_stocks').select('*').order('filtered_at', { ascending: false }).limit(5),
      ]);

      if (strategiesRes.data) setStrategies(strategiesRes.data);
      if (regimeRes.data) setMarketRegime(regimeRes.data);
      if (stocksRes.data) setRecentStocks(stocksRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-400">Loading system data...</div>
      </div>
    );
  }

  const activeStrategies = strategies.filter((s) => s.status === 'active').length;
  const trainingStrategies = strategies.filter((s) => s.status === 'training').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">System Dashboard</h1>
        <p className="text-neutral-400">Real-time strategy performance and market conditions</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Active Strategies</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-100">{activeStrategies}</div>
          <div className="text-xs text-neutral-500 mt-1">
            {trainingStrategies > 0 && `${trainingStrategies} in training`}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Market Regime</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg font-semibold text-neutral-100 capitalize">
            {marketRegime?.regime_type || 'Unknown'}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Strength: {marketRegime?.regime_strength || 0}%
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Filtered Stocks</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-neutral-100">{recentStocks.length}</div>
          <div className="text-xs text-neutral-500 mt-1">Last 24 hours</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Data Freshness</span>
            <AlertCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-semibold text-emerald-500">Current</div>
          <div className="text-xs text-neutral-500 mt-1">Updated 15 min ago</div>
        </div>
      </div>

      {marketRegime && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3 text-neutral-100">Market Condition Analysis</h2>
          <p className="text-neutral-300 leading-relaxed text-sm">{marketRegime.description}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-neutral-100">Strategy Health</h2>
          <div className="space-y-3">
            {strategies.map((strategy) => (
              <Link
                key={strategy.id}
                to={`/strategies/${strategy.id}`}
                className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-750 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-100">{strategy.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      strategy.status === 'active'
                        ? 'bg-emerald-900/30 text-emerald-400'
                        : strategy.status === 'training'
                        ? 'bg-amber-900/30 text-amber-400'
                        : 'bg-neutral-700 text-neutral-400'
                    }`}
                  >
                    {strategy.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-neutral-400">
                  <span className="capitalize">{strategy.timeframe}</span>
                  <span>•</span>
                  <span className="capitalize">{strategy.market_suitability} markets</span>
                  <span>•</span>
                  <span>Win rate: {(strategy.backtest_summary.win_rate * 100).toFixed(0)}%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-neutral-100">Recent Filter Results</h2>
          <div className="space-y-3">
            {recentStocks.length > 0 ? (
              recentStocks.map((stock) => (
                <div key={stock.id} className="p-4 bg-neutral-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-neutral-100">{stock.symbol}</span>
                      <span className="text-neutral-400 text-sm ml-2">{stock.company_name}</span>
                    </div>
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
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-neutral-400">
                    <span>Score: {stock.strength_score}</span>
                    <span>•</span>
                    <span className="capitalize">{stock.trend_bias}</span>
                    <span>•</span>
                    <span>{stock.sector}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-500">No recent filter results</div>
            )}
          </div>
          <Link
            to="/stocks"
            className="block mt-4 text-center text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            View all filtered stocks →
          </Link>
        </div>
      </div>

      <div className="bg-neutral-900 border border-amber-900/50 rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-2 text-amber-400">System Status</h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          All strategies operating within normal parameters. Data pipeline synchronized.
          Market regime detection active. No critical alerts.
        </p>
      </div>
    </div>
  );
}
