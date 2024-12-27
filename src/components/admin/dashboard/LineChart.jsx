import { useEffect } from 'react';

const LineChart = ({ chartData }) => {
  useEffect(() => {
    if (document.getElementById("line-chart") && typeof ApexCharts !== 'undefined') {
      const options = {
        chart: {
          height: chartData.chartOptions.height,
          maxWidth: chartData.chartOptions.maxWidth,
          type: chartData.chartOptions.type,
          fontFamily: chartData.chartOptions.fontFamily,
          dropShadow: chartData.chartOptions.dropShadow,
          toolbar: chartData.chartOptions.toolbar,
        },
        tooltip: chartData.chartOptions.tooltip,
        dataLabels: chartData.chartOptions.dataLabels,
        stroke: chartData.chartOptions.stroke,
        grid: chartData.chartOptions.grid,
        legend: chartData.chartOptions.legend,
        xaxis: chartData.chartOptions.xaxis,
        yaxis: chartData.chartOptions.yaxis,
        series: chartData.seriesData,
      };

      const chart = new ApexCharts(document.getElementById("line-chart"), options);
      chart.render();
    }
  }, [chartData]);

  return <div id="line-chart"></div>;
};

export default LineChart;
