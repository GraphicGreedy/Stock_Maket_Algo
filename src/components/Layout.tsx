import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Filter, PieChart, Database, Info, Settings } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Strategies', path: '/strategies', icon: TrendingUp },
    { name: 'Filtered Stocks', path: '/stocks', icon: Filter },
    { name: 'Fundamentals', path: '/fundamentals', icon: PieChart },
    { name: 'Data & Integrations', path: '/integrations', icon: Database },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-slate-400" />
              <span className="text-lg font-serif font-bold text-neutral-100">
                StrategyEngine
              </span>
            </Link>

            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-800 text-neutral-100'
                        : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
