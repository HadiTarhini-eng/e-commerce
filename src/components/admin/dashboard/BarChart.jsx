import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = ({ chartData }) => {
  const [state, setState] = useState({
    categories: chartData.map(item => item.category), // Extract categories
    series: [] // This will be dynamically generated
  });

  // Dynamically generate the series from the provided data
  const generateSeries = () => {
    const seriesData = [];
    const allNames = chartData[0]?.data.map(d => d.name); // Get the names of the series

    allNames.forEach((name, idx) => {
      const dataValues = chartData.map(item => item.data[idx].data); // Collect data for each series
      seriesData.push({
        name,
        data: dataValues
      });
    });

    setState((prevState) => ({
      ...prevState,
      series: seriesData
    }));
  };

  // Use effect or any other trigger to call generateSeries when chartData changes
  React.useEffect(() => {
    generateSeries();
  }, [chartData]);

  const options = {
    colors: ['#3C50E0', '#80CAEE', '#FF5733'], // Adjust colors based on the number of series
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: false, // No stacking now, columns will be separate
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: state.categories,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="col-span-12 p-4 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Orders in Top Cities
          </h4>
        </div>
        <div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
