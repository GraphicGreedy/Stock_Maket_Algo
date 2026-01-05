import { Brain, TrendingUp, Shield, AlertTriangle } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">About the System</h1>
        <p className="text-neutral-400">Philosophy and operational framework</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 mb-6">
        <h2 className="text-2xl font-serif font-bold mb-4 text-neutral-100">What This System Is</h2>
        <div className="space-y-4 text-neutral-300 leading-relaxed">
          <p>
            This is a professional-grade stock filtration platform built on quantitative logic
            and pattern recognition. The system applies trained trading strategies to identify
            stocks that match specific, predefined criteria.
          </p>
          <p>
            Each strategy operates on explicit rules derived from historical market patterns.
            The AI component handles pattern matching and rule application at scale, not prediction
            or black-box modeling.
          </p>
          <p>
            Results are scored, explained, and contextualized. Every filtered stock includes
            the logic for its selection, relevant risk factors, and confidence assessment.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 mb-6">
        <h2 className="text-2xl font-serif font-bold mb-4 text-neutral-100">What This System Is Not</h2>
        <div className="space-y-4 text-neutral-300 leading-relaxed">
          <p>
            This is not a prediction service. The system does not forecast price movements or
            guarantee outcomes. Strategies filter stocks based on current conditions matching
            historical patterns.
          </p>
          <p>
            This is not financial advice. All outputs serve as intelligence inputs for your own
            decision-making process. You maintain full responsibility for trading decisions.
          </p>
          <p>
            This is not a replacement for due diligence. The platform assists systematic analysis
            but cannot account for all market factors, company-specific events, or macroeconomic
            conditions.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 mb-6">
        <h2 className="text-xl font-semibold mb-6 text-neutral-100">Core Principles</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 rounded-lg p-3">
              <Brain className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">Explainability</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Every decision the system makes can be traced to specific rules and data points.
                No black boxes. No hidden logic. Complete transparency in how stocks are selected.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">Pattern Recognition</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Strategies identify repeating market structures. Historical performance provides
                context but does not guarantee future results. Market conditions evolve.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 rounded-lg p-3">
              <Shield className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">Risk Awareness</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Every strategy includes risk profile disclosure. Every filtered stock includes
                risk factors. The system acknowledges uncertainty and market regime dependency.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-neutral-100">How Strategies Work</h2>
        <div className="space-y-4 text-sm text-neutral-400 leading-relaxed">
          <div className="bg-neutral-800 rounded p-4">
            <h3 className="text-sm font-medium text-neutral-300 mb-2">1. Training Phase</h3>
            <p>
              Strategies analyze historical data to identify patterns that have shown statistical
              edge. Rules are defined based on price action, volume, fundamentals, or hybrid
              approaches.
            </p>
          </div>

          <div className="bg-neutral-800 rounded p-4">
            <h3 className="text-sm font-medium text-neutral-300 mb-2">2. Validation</h3>
            <p>
              Backtest results provide context on win rate, average return, drawdown, and trade
              frequency. This data helps users understand strategy behavior under various conditions.
            </p>
          </div>

          <div className="bg-neutral-800 rounded p-4">
            <h3 className="text-sm font-medium text-neutral-300 mb-2">3. Application</h3>
            <p>
              Active strategies continuously scan current market data, applying their rule sets
              to identify matching stocks. Results include confidence scores and explanations.
            </p>
          </div>

          <div className="bg-neutral-800 rounded p-4">
            <h3 className="text-sm font-medium text-neutral-300 mb-2">4. Monitoring</h3>
            <p>
              Strategies remain under observation. If market conditions shift significantly or
              performance degrades, strategies may be paused or retrained.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-amber-900/50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold mb-2 text-amber-400">Critical Disclosure</h3>
            <div className="text-xs text-neutral-400 leading-relaxed space-y-2">
              <p>
                This platform provides analytical tools, not trading signals or financial advice.
                All strategies operate on historical patterns that may not repeat.
              </p>
              <p>
                Markets are inherently uncertain. Strategies can and do fail. Past performance
                does not indicate future results. Drawdowns can exceed historical maximums.
              </p>
              <p>
                Users assume full responsibility for trading decisions and outcomes. Always
                consider your risk tolerance, time horizon, and financial situation before acting
                on any analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
