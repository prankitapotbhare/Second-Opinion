"use client";

import React, { useEffect, useState, useRef } from 'react';

const AppointmentsChart = () => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  
  useEffect(() => {
    let myChart = null;
    let handleResize = null;
    
    // Import echarts dynamically on client side
    import('echarts').then((echarts) => {
      if (chartRef.current) {
        // Initialize chart
        myChart = echarts.init(chartRef.current);
        setChartInstance(myChart);
        
        // Generate realistic appointment data
        const currentDate = new Date();
        const lastWeekData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayNames = [];
        
        // Generate data for the last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(currentDate.getDate() - i);
          const dayName = days[date.getDay()];
          dayNames.push(dayName);
          
          // Generate random appointment counts with a realistic pattern
          // Weekdays have more appointments than weekends
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const baseCount = isWeekend ? 5 : 12;
          const randomVariation = Math.floor(Math.random() * 8);
          lastWeekData.push(baseCount + randomVariation);
        }
        
        // Chart options
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: dayNames,
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Appointments',
              type: 'bar',
              barWidth: '60%',
              data: lastWeekData,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#3b82f6' },
                  { offset: 1, color: '#60a5fa' }
                ])
              }
            }
          ]
        };
        
        // Set chart options
        myChart.setOption(option);
        
        // Handle resize
        handleResize = () => {
          myChart.resize();
        };
        
        window.addEventListener('resize', handleResize);
      }
    });
    
    // Cleanup
    return () => {
      if (myChart) {
        myChart.dispose();
      }
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Appointment Statistics</h2>
      <div ref={chartRef} style={{ height: '300px' }}></div>
    </div>
  );
};

export default AppointmentsChart;