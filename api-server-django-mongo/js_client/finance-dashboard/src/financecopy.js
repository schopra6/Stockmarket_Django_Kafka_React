import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const FinanceDashboard = () => {
  const [financeData, setFinanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDataKey, setSelectedDataKey] = useState('Close');
  const [timeDuration, setTimeDuration] = useState('5mins');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch financial data from API
  useEffect(() => {
    try {
      getFinanceList(timeDuration)
        .then(data => {
          setFinanceData(data);
          setFilteredData(data); // Update state with fetched data
        })
        .catch(error => {
          console.error('Error fetching the finance list:', error);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [timeDuration]);

  // Determine tick interval based on time duration
  const getTickInterval = () => {
    switch (timeDuration) {
      case '5mins':
        return 5 * 60 * 1000; // 5 minutes in milliseconds
      case '10mins':
        return 10 * 60 * 1000; // 10 minutes in milliseconds
      case '1hour':
        return 60 * 60 * 1000; // 1 hour in milliseconds
      default:
        return 5 * 60 * 1000; // Default to 5 minutes
    }
  };

  // Format tick labels based on time duration
  const formatTick = (tick) => {
    switch (timeDuration) {
      case '5mins':
      case '10mins':
        return moment(tick).format('HH:mm');
      case '1hour':
        return moment(tick).format('HH:mm');
      default:
        return moment(tick).format('HH:mm');
    }
  };

  // Calculate the data to be displayed on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.value));
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div style={{ backgroundColor: '#121212', color: '#ffffff', padding: '20px' }}>
      <h1>Finance Dashboard</h1>

      {/* Dropdown for Data Key */}
      <select
        value={selectedDataKey}
        onChange={(e) => setSelectedDataKey(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px', width: '150px' }}
      >
        <option value="Open">Open</option>
        <option value="High">High</option>
        <option value="Low">Low</option>
        <option value="Close">Close</option>
      </select>

      {/* Dropdown for Time Duration */}
      <select
        value={timeDuration}
        onChange={(e) => setTimeDuration(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px', width: '150px' }}
      >
        <option value="5mins">5 mins</option>
        <option value="10mins">10 mins</option>
        <option value="1hour">1 hour</option>
      </select>

      {/* Line Graph */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="timestamp" tickInterval={getTickInterval()} tickFormatter={formatTick} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={selectedDataKey} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* Data Table */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.timestamp}</td>
              <td>{item.Open}</td>
              <td>{item.High}</td>
              <td>{item.Low}</td>
              <td>{item.Close}</td>
              <td>{item.Volume}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px' }}>
        <select value={currentPage} onChange={handlePageChange} style={{ padding: '5px', width: '100px' }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const options = {
  method: "GET",
}

function getFinanceList(duration) {
  const endpoint = `/api/finances?duration=${duration}`;
  const options = getFetchOptions()
  return fetch(endpoint, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Return the parsed JSON data
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      throw error; // Re-throw the error to handle it later
    });
}

function getFetchOptions(method, body) {
  return {
    method: method === null ? "GET" : method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwiZXhwIjoxNzI2MDU5MTA0fQ.wTvWVsMWEKTz4_t51sicwja_EHQFRcYuL4oLbEmbvt8'
    },
    body: body ? body : null
  }
}

export default FinanceDashboard;