import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Menu, TrendingUp, TrendingDown } from 'lucide-react';

const TradingDashboard = () => {
  const [data, setData] = useState([]);
  const [fulldata, setfullData] = useState([]);
  const [watchlistItem, setWatchlistItem] = useState({
    symbol: 'IBM',
    price: 0,
    change: 0,
    color: 'green',
  });
  const [selectedMetric, setSelectedMetric] = useState('Close');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          headers: {
            "Content-Type": "application/json",
            "Authorization": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNzI2NzM2NTkxfQ.N4JD3BTk_i89kXqlTW0n1fSAvNPBpeqaqVEdHKpjkbY'
          }
        };
       // console.log(fulldata.length);
        //const latestTimestamp = fulldata.length > 0 ? fulldata[fulldata.length - 1].timestamp : '2021-01-01T00:00:00Z';
       // console.log(latestTimestamp);
        //let api='/api/finances/?timestamp__gte=' + latestTimestamp;
       // console.log(api);
        const response = await axios.get('/api/finances/', options); // Replace with your API endpoint
        const chartData = response.data;
        setfullData(chartData)

        // Transform data for LineChart
const transformedData = chartData
  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  .map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: item[selectedMetric]
  }));

        setData([...data,...transformedData]);

        const ibmData = chartData
        //.filter(item => item.symbol === 'IBM');

        if (ibmData.length > 1) {
          const latestData = ibmData[ibmData.length - 1];
          const previousData = ibmData[ibmData.length - 2];
          const change = ((latestData[selectedMetric] - previousData[selectedMetric]) / previousData[selectedMetric]) * 100;
          setWatchlistItem({
            symbol: 'IBM',
            price: latestData[selectedMetric],
            change: change.toFixed(2),
            color: change >= 0 ? 'green' : 'red',
          });
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 70000); // Fetch data every 60 seconds

    return () => clearInterval(interval);
  }, [selectedMetric]);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <span className="text-2xl font-bold text-blue-500">TY</span>
          <nav className="hidden md:flex space-x-6">
            {['Products', 'Community', 'Markets', 'News', 'Brokers'].map((item) => (
              <a key={item} href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">{item}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input type="text" placeholder="Search" className="bg-gray-700 text-white rounded-full py-2 px-4 pl-10 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button className="bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition-colors duration-200">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 overflow-hidden flex">
        <div className="flex-grow mr-4">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">Market Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-64 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.slice(-50)}>
            <XAxis dataKey="time" stroke="#6B7280" />
            <YAxis domain={[0, dataMax => dataMax + 10]} stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
        </div>

        <aside className="w-64 bg-gray-800 p-4 rounded-lg overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Watchlist</h3>
          <div className="mb-4">
            <label htmlFor="metric-select" className="block text-sm font-medium text-gray-300">Select Metric:</label>
            <select
              id="metric-select"
              className="mt-1 block w-full bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {['Open', 'High', 'Low', 'Close', 'Volume'].map((metric) => (
                <option key={metric} value={metric}>{metric}</option>
              ))}
            </select>
          </div>
          <ul className="space-y-2">
            <li key={watchlistItem.symbol} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
              <div>
                <span className="font-medium">{watchlistItem.symbol}</span>
                <span className="block text-sm text-gray-400">{watchlistItem.price.toLocaleString()}</span>
              </div>
              <div className={`flex items-center ${watchlistItem.color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
                {watchlistItem.color === 'green' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                <span>{watchlistItem.change > 0 ? '+' : ''}{watchlistItem.change}%</span>
              </div>
            </li>
          </ul>
        </aside>
      </main>
    </div>
  );
};

export default TradingDashboard;