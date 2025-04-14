"use client";

import React, { useEffect, useState } from 'react';

const AppointmentsChart = () => {
  const [chartInstance, setChartInstance] = useState(null);
  
  useEffect(() => {
    // Import echarts dynamically on client side
    import('echarts').then((echarts) => {
      const chartDom = document.getElementById('appointments-chart');
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        
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
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'Appointments',
              type: 'bar',
              barWidth: '60%',
              data: [10, 15, 12, 8, 7, 11, 13],
              itemStyle: {
                color: '#3b82f6'
              }
            }
          ]
        };
        
        myChart.setOption(option);
        setChartInstance(myChart);
        
        // Handle resize
        const handleResize = () => {
          myChart.resize();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          myChart.dispose();
        };
      }
    });
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Weekly Appointments</h2>
      <div id="appointments-chart" className="w-full h-80"></div>
    </div>
  );
};

export default AppointmentsChart;