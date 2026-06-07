import { useEffect } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Clock,
} from 'lucide-react';
import { aqiService } from '../services/routeService';
import useApi from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import AQICard from '../components/AQICard';
import { formatNumber, formatDate, getAQIColor } from '../utils/helpers';
import './AQIHistory.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="tooltip-value" style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function AQIHistory() {
  const { data, loading, error, execute: fetchHistory } = useApi(() =>
    aqiService.getHistory()
  );

  useEffect(() => {
    fetchHistory();
  }, []);

  // Transform data to match actual API response shape:
  // { id, aqi, temperature, humidity, windSpeed, recordedAt, route: { id, routeName } }
  const chartData = data
    ? data.map((item, idx) => ({
        ...item,
        name: item.recordedAt
          ? new Date(item.recordedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
          : `#${idx + 1}`,
        aqiValue: item.aqi ?? 0,
        temperature: item.temperature ?? 0,
        humidity: item.humidity ?? 0,
        windSpeed: item.windSpeed ?? 0,
        routeName: item.route?.routeName || 'Unknown',
      }))
    : [];

  // Compute summary stats
  const latestEntry = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const avgAqi =
    chartData.length > 0
      ? (chartData.reduce((sum, d) => sum + d.aqiValue, 0) / chartData.length).toFixed(1)
      : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AQI History</h1>
        <p>Track air quality trends over time with interactive charts</p>
      </div>

      {error && (
        <div className="error-banner animate-in">
          <p>⚠️ {error}</p>
        </div>
      )}

      {loading && <LoadingSpinner text="Loading AQI history..." />}

      {!loading && chartData.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid-4 summary-cards">
            <div className="glass-card stat-card animate-in animate-in-delay-1">
              <div className="stat-icon green">
                <Activity size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Latest AQI</span>
                <span className="stat-value">{latestEntry?.aqiValue ?? '—'}</span>
              </div>
            </div>

            <div className="glass-card stat-card animate-in animate-in-delay-2">
              <div className="stat-icon blue">
                <TrendingUp size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Average AQI</span>
                <span className="stat-value">{avgAqi ?? '—'}</span>
              </div>
            </div>

            <div className="glass-card stat-card animate-in animate-in-delay-3">
              <div className="stat-icon amber">
                <Thermometer size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Latest Temp</span>
                <span className="stat-value">
                  {formatNumber(latestEntry?.temperature, 1)}
                  <span className="stat-unit">°C</span>
                </span>
              </div>
            </div>

            <div className="glass-card stat-card animate-in animate-in-delay-4">
              <div className="stat-icon purple">
                <BarChart3 size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Records</span>
                <span className="stat-value">{chartData.length}</span>
              </div>
            </div>
          </div>

          {/* AQI Line Chart */}
          <div className="glass-card chart-card animate-in">
            <div className="chart-header">
              <h2 className="section-title">
                <TrendingUp size={18} />
                AQI Trend Over Time
              </h2>
              <span className="chart-badge">{chartData.length} data points</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    domain={[0, 5]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="aqiValue"
                    name="AQI"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#aqiGradient)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weather Metrics Chart */}
          <div className="glass-card chart-card animate-in animate-in-delay-1">
            <div className="chart-header">
              <h2 className="section-title">
                <BarChart3 size={18} />
                Weather Conditions
              </h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ color: '#94a3b8', fontSize: 13 }}
                  />
                  <Bar dataKey="temperature" name="Temp (°C)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="humidity" name="Humidity (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="windSpeed" name="Wind (m/s)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="glass-card chart-card animate-in animate-in-delay-2">
            <div className="chart-header">
              <h2 className="section-title">
                <Clock size={18} />
                Detailed Records
              </h2>
            </div>
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>AQI</th>
                    <th>Temp (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Wind (m/s)</th>
                    <th>Recorded At</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="route-name-cell">{item.routeName}</td>
                      <td>
                        <span
                          className="aqi-cell-badge"
                          style={{
                            color: getAQIColor(item.aqiValue),
                            background: `${getAQIColor(item.aqiValue)}1a`,
                          }}
                        >
                          {item.aqiValue}
                        </span>
                      </td>
                      <td>{formatNumber(item.temperature, 1)}</td>
                      <td>{formatNumber(item.humidity, 0)}</td>
                      <td>{formatNumber(item.windSpeed, 1)}</td>
                      <td className="date-cell">{item.recordedAt ? formatDate(item.recordedAt) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && chartData.length === 0 && !error && (
        <div className="empty-state animate-in">
          <BarChart3 size={48} />
          <h3>No AQI data available</h3>
          <p>Historical air quality data will appear here once available.</p>
        </div>
      )}
    </div>
  );
}
