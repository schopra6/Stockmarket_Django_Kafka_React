import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
const baseEndpoint = "http://localhost:6000/api"

const FinanceDashboard = () => {
  const [financeData, setFinanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);


// Fetch financial data from API
  useEffect(() => {
      try {
           getFinanceList()
            .then(data => {
                setFinanceData(data);
                setFilteredData(data);// Update state with fetched data
            })
            .catch(error => {
                console.error('Error fetching the finance list:', error);
            });
       // Initialize filtered data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },[]);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = financeData.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(financeData);
    }
  }, [searchTerm, financeData]);

  return (
    <div>
      <h1>Finance Dashboard</h1>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      {/* Line Graph */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Close" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* Data Table */}
      <table border="1" cellPadding="10" cellSpacing="0">
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
          {filteredData.map((item) => (
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
    </div>
  );
};

const options = {
        method: "GET",
    }


function getFinanceList() {
    const endpoint = `/api/finances/`;
    const options = getFetchOptions()
    return fetch(endpoint,options)
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
function getFetchOptions(method,body){
    return {
        method: method === null ? "GET" : method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNzI2NzM2NTkxfQ.N4JD3BTk_i89kXqlTW0n1fSAvNPBpeqaqVEdHKpjkbY'
         },
        body: body ? body : null
    }
}

  
export default FinanceDashboard;
