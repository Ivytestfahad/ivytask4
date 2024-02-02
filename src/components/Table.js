import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './Table.css';
import Calendar from '@wojtekmaj/react-daterange-picker';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const generateRandomDate = () => {
  const start = new Date(2024, 0, 1); 
  const end = new Date(2024, 0, 31); 
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
};

const generateRandomTasks = () => {
  const tasks = [];
  const taskCount = Math.floor(Math.random() * 6) + 1;

  for (let i = 0; i < taskCount; i++) {
    const taskDate = generateRandomDate();
    tasks.push({
      taskName: `Task ${i + 1}`,
      taskDate: formatDate(taskDate),
    });
  }
  return tasks;
};

const generateEmployees = () => {
  const employees = [];
  for (let i = 1; i <= 100; i++) {
    employees.push({
      id: i,
      name: `Employee ${i}`,
      tasks: generateRandomTasks()
    });
  }
  return employees;
};

const Table = () => {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [chartInstance, setChartInstance] = useState(null);
  const employees = generateEmployees();

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleShowChart = () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      alert('Please select a date range.');
      return;
    }

    const filteredEmployees = employees.filter(employee =>
      employee.tasks.some(task => {
        const taskDate = new Date(task.taskDate);
        return taskDate >= selectedDates[0] && taskDate <= selectedDates[1];
      })
    );

    renderChart(filteredEmployees);
  };

  const renderChart = (filteredEmployees) => {
    const employeeTaskCounts = {};
  
    filteredEmployees.forEach((employee) => {
      let totalTasks = 0;
      employee.tasks.forEach((task) => {
        const taskDate = new Date(task.taskDate);
        if (taskDate >= selectedDates[0] && taskDate <= selectedDates[1]) {
          totalTasks++;
        }
      });
      employeeTaskCounts[employee.name] = totalTasks;
    });
  
    const employeeNames = Object.keys(employeeTaskCounts);
    const taskCounts = Object.values(employeeTaskCounts);
  
    const ctx = document.getElementById('myChart');
  
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: employeeNames,
        datasets: [
          {
            label: `Tasks for Selected Date Range`,
            data: taskCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Tasks',
            },
          },
          x: {
            stacked: true,
            maxBarThickness: 100,
            max: employeeNames.length,
            ticks: {
              autoSkip: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItem) => tooltipItem[0].label,
              label: (tooltipItem) => {
                const employeeName = tooltipItem.label;
                const totalTasks = tooltipItem.raw;
                const employee = filteredEmployees.find(
                  (emp) => emp.name === employeeName
                );
                const tasksWithinRange = employee.tasks.filter((task) => {
                  const taskDate = new Date(task.taskDate);
                  return (
                    taskDate >= selectedDates[0] && taskDate <= selectedDates[1]
                  );
                });
                const taskDates = tasksWithinRange
                  .map((task) => task.taskDate)
                  .join(', ');
                return `Date(s): ${taskDates} | Total Tasks: ${totalTasks}`;
              },
            },
          },
        },
      },
    });
  
    setChartInstance(chart);
  };
  

  return (
    <div className="container">
      <h2>Employee Task Chart</h2>
      <div className="form-group">
        <label htmlFor="taskDate">Select Date Range:</label>
        <Calendar
          onChange={handleDateChange}
          value={selectedDates}
          selectRange
        />
      </div>
      <button className="btn" onClick={handleShowChart}>Show Chart</button>
      <div className="chart-container">
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
      <div className="employee-names">
        {chartInstance &&
          chartInstance.data.labels.map((label, index) => (
            <div key={index} className="employee-name">
              {/* <span>{label}</span> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Table;
