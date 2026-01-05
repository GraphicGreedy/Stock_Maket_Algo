import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TrendingUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Strategy } from '../types/database';

export default function Strategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStrategies() {
      const { data } = await supabase.from('strategies').select('*').order('created_at');
      if (data) setStrategies(data);
      setLoading(false);
    }

    fetchStrategies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-400">Loading strategies...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Trading Strategies</h1>
        <p className="text-neutral-400">
          Independent strategy modules with defined logic and risk parameters
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-neutral-100 mb-1">{strategy.name}</h3>
                <p className="text-sm text-neutral-400">{strategy.description}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-500 mb-1">Timeframe</div>
                <div className="text-sm font-medium text-neutral-200 capitalize">
                  {strategy.timeframe}
                </div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-500 mb-1">Logic Type</div>
                <div className="text-sm font-medium text-neutral-200 capitalize">
                  {strategy.logic_type.replace('_', ' ')}
                </div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-500 mb-1">Market Suitability</div>
                <div className="text-sm font-medium text-neutral-200 capitalize">
                  {strategy.market_suitability}
                </div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-500 mb-1">Win Rate</div>
                <div className="text-sm font-medium text-neutral-200">
                  {(strategy.backtest_summary.win_rate * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded p-4 mb-4">
              <div className="text-xs text-neutral-500 mb-2">Backtest Performance</div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-neutral-500">Avg Return</div>
                  <div className="text-emerald-400 font-medium">
                    +{(strategy.backtest_summary.avg_return * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500">Max Drawdown</div>
                  <div className="text-red-400 font-medium">
                    -{(strategy.backtest_summary.max_drawdown * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500">Trades</div>
                  <div className="text-neutral-300 font-medium">
                    {strategy.backtest_summary.trades_analyzed}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-neutral-500 mb-2">Risk Profile</div>
              <p className="text-sm text-neutral-400 leading-relaxed">{strategy.risk_profile}</p>
            </div>

            <Link
              to={`/strategies/${strategy.id}`}
              className="block w-full text-center bg-neutral-800 hover:bg-neutral-750 text-neutral-200 py-2 rounded text-sm font-medium transition-colors"
            >
              View Strategy Details
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-neutral-100">Strategy Framework</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-neutral-200 mb-1">Pattern Recognition</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Strategies identify repeating market structures based on price, volume, and technical factors.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Activity className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-neutral-200 mb-1">Rule-Based Logic</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Each strategy operates on explicit rules with defined entry and exit criteria.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-neutral-200 mb-1">Historical Validation</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Backtest results provide context on strategy behavior under various market conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-amber-900/50 rounded-lg p-6 mt-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold mb-2 text-amber-400">Strategy Limitations</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Strategies are models based on historical patterns. They do not predict the future and can
              become ineffective as market conditions evolve. Performance metrics reflect backtested
              results and do not guarantee future outcomes. Always consider current market regime and
              your own risk tolerance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
