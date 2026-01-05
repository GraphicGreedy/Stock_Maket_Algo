import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Strategies from './pages/Strategies';
import StrategyDetail from './pages/StrategyDetail';
import FilteredStocks from './pages/FilteredStocks';
import Fundamentals from './pages/Fundamentals';
import DataIntegrations from './pages/DataIntegrations';
import About from './pages/About';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/strategies"
          element={
            <Layout>
              <Strategies />
            </Layout>
          }
        />
        <Route
          path="/strategies/:id"
          element={
            <Layout>
              <StrategyDetail />
            </Layout>
          }
        />
        <Route
          path="/stocks"
          element={
            <Layout>
              <FilteredStocks />
            </Layout>
          }
        />
        <Route
          path="/fundamentals"
          element={
            <Layout>
              <Fundamentals />
            </Layout>
          }
        />
        <Route
          path="/integrations"
          element={
            <Layout>
              <DataIntegrations />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
