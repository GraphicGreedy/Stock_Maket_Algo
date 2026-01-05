import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Strategy } from '../types/database';

export default function StrategyDetail() {
  const { id } = useParams<{ id: string }>();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStrategy() {
      if (!id) return;
      const { data } = await supabase.from('strategies').select('*').eq('id', id).maybeSingle();
      if (data) setStrategy(data);
      setLoading(false);
    }

    fetchStrategy();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-400">Loading strategy...</div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl text-neutral-400">Strategy not found</h2>
          <Link to="/strategies" className="text-slate-400 hover:text-slate-300 mt-4 inline-block">
            Return to strategies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link
        to="/strategies"
        className="inline-flex items-center space-x-2 text-neutral-400 hover:text-neutral-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Strategies</span>
      </Link>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-serif font-bold text-neutral-100">{strategy.name}</h1>
          <span
            className={`text-sm px-4 py-1 rounded-full ${
              strategy.status === 'active'
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
                : strategy.status === 'training'
                ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}
          >
            {strategy.status}
          </span>
        </div>
        <p className="text-neutral-400 text-lg">{strategy.description}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-xs text-neutral-500 mb-1">Timeframe</div>
          <div className="text-lg font-semibold text-neutral-100 capitalize">{strategy.timeframe}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-xs text-neutral-500 mb-1">Logic Type</div>
          <div className="text-lg font-semibold text-neutral-100 capitalize">
            {strategy.logic_type.replace('_', ' ')}
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-xs text-neutral-500 mb-1">Market Suitability</div>
          <div className="text-lg font-semibold text-neutral-100 capitalize">
            {strategy.market_suitability}
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-neutral-100">Core Rules</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-2">Entry Criteria</h3>
            <div className="space-y-2">
              {strategy.core_rules.rules.map((rule, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-400">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-4">
            <h3 className="text-sm font-medium text-neutral-300 mb-2">Entry Logic</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {strategy.core_rules.entry_logic}
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-4">
            <h3 className="text-sm font-medium text-neutral-300 mb-2">Exit Logic</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{strategy.core_rules.exit_logic}</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-neutral-100">Backtest Summary</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-500 mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-neutral-100">
              {(strategy.backtest_summary.win_rate * 100).toFixed(0)}%
            </div>
          </div>
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-500 mb-1">Average Return</div>
            <div className="text-2xl font-bold text-emerald-400">
              +{(strategy.backtest_summary.avg_return * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-500 mb-1">Max Drawdown</div>
            <div className="text-2xl font-bold text-red-400">
              -{(strategy.backtest_summary.max_drawdown * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-500 mb-1">Trades Analyzed</div>
            <div className="text-2xl font-bold text-neutral-100">
              {strategy.backtest_summary.trades_analyzed}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-neutral-800 rounded">
          <p className="text-xs text-neutral-500 leading-relaxed">
            Backtest data reflects historical performance and does not guarantee future results.
            These metrics provide context for understanding strategy behavior across different market
            conditions.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-neutral-100">Risk Profile</h2>
        <p className="text-neutral-400 leading-relaxed">{strategy.risk_profile}</p>
        <div className="mt-4 p-3 bg-neutral-800 rounded">
          <div className="text-xs text-neutral-500 mb-1">Confidence Threshold</div>
          <div className="text-sm text-neutral-300">
            Minimum confidence level for stock filtration: {(strategy.confidence_threshold * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-amber-900/50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold mb-2 text-amber-400">Risk Disclosure</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              This strategy operates on historical patterns and may not perform as expected in current
              market conditions. All trading involves risk of loss. The strategy does not constitute
              financial advice. Users are responsible for their own trading decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
