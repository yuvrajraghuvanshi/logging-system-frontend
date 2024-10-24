import { useState } from 'react';

const LogFilter = ({ logs, setFilteredLogs }) => {
  const [actionType, setActionType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    let filtered = [...logs];

    // Filter by action type if provided
    if (actionType) {
      filtered = filtered.filter(log => log.actionType === actionType);
    }

    // Filter by date range if provided
    if (startDate) {
      filtered = filtered.filter(log => new Date(log.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(log => new Date(log.createdAt) <= new Date(endDate));
    }

    setFilteredLogs(filtered);
    console.log(filtered)
  };

  return (
    <div className="filter-form">
      <h3>Filter Logs</h3>
      <div>
        <label>Action Type</label>
        <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
          <option value="">All</option>
          <option value="login">Login</option>
          <option value="Updated">Update</option>
          <option value="Deleted">Delete</option>
        </select>
      </div>
      <div>
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button className='bg-blue-400 p-2 rounded' onClick={handleFilter}>Apply Filter</button>
    </div>
  );
};

export default LogFilter;
