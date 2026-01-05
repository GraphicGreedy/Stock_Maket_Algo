import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database, CheckCircle, XCircle, Clock, RefreshCw, FileSpreadsheet } from 'lucide-react';
import type { DataIntegration } from '../types/database';

export default function DataIntegrations() {
  const [integrations, setIntegrations] = useState<DataIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIntegrations() {
      const { data } = await supabase.from('data_integrations').select('*').order('created_at');
      if (data) setIntegrations(data);
      setLoading(false);
    }

    fetchIntegrations();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <XCircle className="w-5 h-5 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
      case 'syncing':
        return 'bg-slate-900/30 text-slate-400 border-slate-800';
      case 'error':
        return 'bg-red-900/30 text-red-400 border-red-800';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-400">Loading integrations...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Data & Integrations</h1>
        <p className="text-neutral-400">
          Connect external data sources for flexible workflows and manual review
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="bg-neutral-800 rounded-lg p-3">
                  {integration.integration_type === 'google_sheets' ? (
                    <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Database className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-100 mb-1">
                    {integration.connection_name}
                  </h3>
                  <p className="text-sm text-neutral-400 capitalize">
                    {integration.integration_type.replace('_', ' ')} Integration
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(integration.sync_status)}
                <span
                  className={`text-sm px-3 py-1 rounded border ${getStatusColor(
                    integration.sync_status
                  )}`}
                >
                  {integration.sync_status}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-neutral-800 rounded p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500">Last Sync</span>
                </div>
                <div className="text-sm text-neutral-200">
                  {integration.last_sync
                    ? new Date(integration.last_sync).toLocaleString()
                    : 'Never synced'}
                </div>
              </div>

              <div className="bg-neutral-800 rounded p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500">Sync Frequency</span>
                </div>
                <div className="text-sm text-neutral-200 capitalize">
                  {typeof integration.config === 'object' && integration.config !== null && 'sync_frequency' in integration.config
                    ? String(integration.config.sync_frequency)
                    : 'Manual'}
                </div>
              </div>
            </div>

            {integration.sync_status === 'connected' && (
              <div className="bg-emerald-900/20 border border-emerald-800/50 rounded p-3">
                <p className="text-xs text-emerald-400/80 leading-relaxed">
                  Integration active. Data flows automatically based on configured sync schedule.
                </p>
              </div>
            )}

            {integration.sync_status === 'error' && (
              <div className="bg-red-900/20 border border-red-800/50 rounded p-3">
                <p className="text-xs text-red-400/80 leading-relaxed">
                  Connection error detected. Check credentials and permissions.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-neutral-100">Google Sheets Integration</h2>
        <div className="space-y-4 text-sm text-neutral-400 leading-relaxed">
          <p>
            Connect Google Sheets to enable bidirectional data flow between the strategy engine
            and your spreadsheets. This allows for manual review layers and custom analysis
            workflows.
          </p>
          <div className="bg-neutral-800 rounded p-4">
            <h3 className="text-sm font-medium text-neutral-300 mb-2">Use Cases</h3>
            <ul className="space-y-1 text-xs text-neutral-400">
              <li>• Export filtered stocks for manual review and annotation</li>
              <li>• Import custom watchlists for strategy application</li>
              <li>• Track historical filter results and performance</li>
              <li>• Build custom dashboards with strategy outputs</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-neutral-100">Data Pipeline Architecture</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 rounded p-2 mt-1">
              <Database className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-200 mb-1">Data Sources</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Market data, fundamental metrics, and technical indicators flow into the system
                from multiple verified sources.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 rounded p-2 mt-1">
              <RefreshCw className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-200 mb-1">Strategy Processing</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Data passes through active strategies, applying rule-based logic to identify
                matching stocks.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 rounded p-2 mt-1">
              <FileSpreadsheet className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-200 mb-1">Output & Export</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Results sync to connected integrations, enabling flexible downstream workflows
                and manual oversight.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-amber-900/50 rounded-lg p-4 mt-6">
        <p className="text-xs text-neutral-400 leading-relaxed">
          Data integrations handle sensitive information. Always use secure authentication methods
          and follow least-privilege access principles. Review integration logs regularly.
        </p>
      </div>
    </div>
  );
}
