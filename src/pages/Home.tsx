import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Brain, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif font-bold mb-6 text-neutral-50">
            Institutional-Grade Stock Analysis
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            AI-powered strategy filtration system designed for serious traders.
            Logic-driven, explainable, and built on quantitative principles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
            <Brain className="w-10 h-10 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-neutral-100">Strategy Engine</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Multiple independent strategies with deterministic, explainable logic. No black boxes.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
            <TrendingUp className="w-10 h-10 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-neutral-100">Smart Filtration</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Automated stock screening based on trained patterns, not predictions.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
            <Shield className="w-10 h-10 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-neutral-100">Risk Aware</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Every strategy includes risk profile and market suitability analysis.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
            <Database className="w-10 h-10 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-neutral-100">Data Integration</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Connect Google Sheets for flexible data workflows and manual review.
            </p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-10 mb-20">
          <h2 className="text-2xl font-serif font-bold mb-6 text-neutral-50">
            What This System Is
          </h2>
          <div className="space-y-4 text-neutral-300 leading-relaxed">
            <p>
              A professional-grade filtration tool that applies trained trading strategies
              to identify stocks matching specific criteria. The system is built on
              quantitative logic and pattern recognition.
            </p>
            <p>
              Each strategy has clear entry and exit rules, risk parameters, and historical
              context. Results are scored and explained, not predicted.
            </p>
            <p>
              This platform assists decision-making through systematic analysis. It does
              not provide financial advice or guarantee outcomes.
            </p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-amber-900/50 rounded-lg p-8 mb-12">
          <h3 className="text-lg font-semibold mb-3 text-amber-400">System Disclosure</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            This is an analytical tool, not a trading signal service. All strategies
            operate on historical patterns and current market structure. Past performance
            does not indicate future results. Users maintain full responsibility for
            trading decisions. Market conditions change, and strategies may become
            ineffective.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-block bg-slate-700 hover:bg-slate-600 text-neutral-100 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Access Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
