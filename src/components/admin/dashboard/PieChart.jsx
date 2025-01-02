import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({ chartSettings, chartData, title }) => {
  const [state, setState] = useState({
    series: [],
    labels: [],
    colors: [],
    title: '',
  });

  useEffect(() => {
    // Merging chartSettings with chartData based on the id
    const mergedData = chartData.map(dataItem => {
      const setting = chartSettings.find(settingItem => settingItem.id === dataItem.id);
      return {
        id: dataItem.id,
        label: setting ? setting.label : '',  // Fallback to empty string if no match
        color: setting ? setting.color : '',  // Fallback to empty string if no match
        data: dataItem.data,
      };
    });

    // Now that we have merged data, we can separate the labels, colors, and series
    const labels = mergedData.map(item => item.label);
    const colors = mergedData.map(item => item.color);
    const series = mergedData.map(item => item.data);

    // Set the state with the processed data
    setState({
      series: series,
      labels: labels,
      colors: colors,
      title: title,
    });
  }, [chartSettings, chartData, title]); // Re-run if chartSettings, chartData, or title changes

  const options = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: state.colors,
    labels: state.labels,
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 py-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">{state.title}</h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {state.labels.map((label, index) => (
          <div className="sm:w-1/2 w-full px-8" key={index}>
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{ backgroundColor: state.colors[index] }}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{label}</span>
                <span>{state.series[index]}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
