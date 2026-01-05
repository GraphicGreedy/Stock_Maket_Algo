import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import type { UserPreferences, Strategy } from '../types/database';

export default function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [prefsRes, strategiesRes] = await Promise.all([
        supabase.from('user_preferences').select('*').limit(1).maybeSingle(),
        supabase.from('strategies').select('*'),
      ]);

      if (prefsRes.data) {
        setPreferences(prefsRes.data);
      }
      if (strategiesRes.data) {
        setStrategies(strategiesRes.data);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    await supabase
      .from('user_preferences')
      .update({
        theme: preferences.theme,
        visible_strategies: preferences.visible_strategies,
        data_sync_enabled: preferences.data_sync_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('id', preferences.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleStrategy = (strategyId: string) => {
    if (!preferences) return;

    const currentVisible = preferences.visible_strategies || [];
    const newVisible = currentVisible.includes(strategyId)
      ? currentVisible.filter((id) => id !== strategyId)
      : [...currentVisible, strategyId];

    setPreferences({ ...preferences, visible_strategies: newVisible });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-400">Loading settings...</div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center py-12 text-neutral-400">
          No preferences found. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Settings</h1>
        <p className="text-neutral-400">Configure system preferences and display options</p>
      </div>

      <div className="space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-neutral-100">Appearance</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">Theme</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 bg-neutral-800 rounded cursor-pointer hover:bg-neutral-750 transition-colors">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={preferences.theme === 'dark'}
                  onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'dark' | 'light' })}
                  className="w-4 h-4 text-slate-600 focus:ring-slate-500"
                />
                <div>
                  <div className="text-sm font-medium text-neutral-200">Dark Mode</div>
                  <div className="text-xs text-neutral-500">Professional dark theme optimized for extended use</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-neutral-800 rounded cursor-pointer hover:bg-neutral-750 transition-colors">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={preferences.theme === 'light'}
                  onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'dark' | 'light' })}
                  className="w-4 h-4 text-slate-600 focus:ring-slate-500"
                />
                <div>
                  <div className="text-sm font-medium text-neutral-200">Light Mode</div>
                  <div className="text-xs text-neutral-500">High contrast light theme for bright environments</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-100 mb-4">Strategy Visibility</h2>
          <p className="text-sm text-neutral-400 mb-4">
            Control which strategies are displayed in your dashboard and filtered stocks view.
            Disabled strategies continue running but won't appear in your interface.
          </p>

          <div className="space-y-2">
            {strategies.map((strategy) => {
              const isVisible =
                preferences.visible_strategies.length === 0 ||
                preferences.visible_strategies.includes(strategy.id);

              return (
                <label
                  key={strategy.id}
                  className="flex items-center justify-between p-3 bg-neutral-800 rounded cursor-pointer hover:bg-neutral-750 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-neutral-200">{strategy.name}</div>
                    <div className="text-xs text-neutral-500 capitalize">
                      {strategy.timeframe} • {strategy.logic_type.replace('_', ' ')}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => toggleStrategy(strategy.id)}
                    className="w-4 h-4 text-slate-600 focus:ring-slate-500 rounded"
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-100 mb-4">Data Synchronization</h2>
          <label className="flex items-center justify-between p-3 bg-neutral-800 rounded cursor-pointer hover:bg-neutral-750 transition-colors">
            <div>
              <div className="text-sm font-medium text-neutral-200">Enable Data Sync</div>
              <div className="text-xs text-neutral-500">
                Automatically sync strategy outputs to connected integrations
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.data_sync_enabled}
              onChange={(e) =>
                setPreferences({ ...preferences, data_sync_enabled: e.target.checked })
              }
              className="w-4 h-4 text-slate-600 focus:ring-slate-500 rounded"
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              saved
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
                : 'bg-slate-700 hover:bg-slate-600 text-neutral-100'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-8">
        <h2 className="text-lg font-semibold text-neutral-100 mb-3">About Preferences</h2>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Preferences are stored locally and affect only your view of the system. Strategy execution
          and data processing continue independently of display settings. Hiding a strategy from
          view does not disable it.
        </p>
      </div>
    </div>
  );
}
