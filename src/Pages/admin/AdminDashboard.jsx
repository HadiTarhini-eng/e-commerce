import React, { useEffect, useState } from 'react';
import { getIconComponent } from '../../utils/getIconComponent';
import { fetchCardData, fetchCardSettings, fetchLineChartData, fetchBarChartData, fetchPieChartPendingSettings, fetchPieChartPastSettings, fetchPieChartPendingData, fetchPieChartPastData } from '../../api/adminApi';
import CardDataStats from '../../components/admin/dashboard/CardDataStats';
import LineChart from '../../components/admin/dashboard/LineChart';
import PieChart from '../../components/admin/dashboard/PieChart';
import BarChart from '../../components/admin/dashboard/BarChart';
import card from '@material-tailwind/react/theme/components/card';

const AdminDashboard = () => {
  const [cards, setCards] = useState([]);
  const [cardSettings, setCardSettings] = useState([]);
  const [lineChartData, setlineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartPendingSettings, setPieChartPendingSettings] = useState([]);
  const [pieChartPendingData, setPieChartPendingData] = useState([]);
  const [pieChartPastSettings, setPieChartPastSettings] = useState([]);
  const [pieChartPastData, setPieChartPastData] = useState([]);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const cardResponse = await fetchCardData();
        setCards(cardResponse);

        const cardSettingsResponse = await fetchCardSettings();
        setCardSettings(cardSettingsResponse);

        const lineChartResponse = await fetchLineChartData();
        setlineChartData(lineChartResponse);

        const barChartResponse = await fetchBarChartData();
        setBarChartData(barChartResponse);

        const pieChartPendingSettingsResponse = await fetchPieChartPendingSettings();
        setPieChartPendingSettings(pieChartPendingSettingsResponse);

        const pieChartPendingResponse = await fetchPieChartPendingData();
        setPieChartPendingData(pieChartPendingResponse);

        const pieChartPastSettingsResponse = await fetchPieChartPastSettings();
        setPieChartPastSettings(pieChartPastSettingsResponse);

        const pieChartPastResponse = await fetchPieChartPastData();
        setPieChartPastData(pieChartPastResponse);
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    };

    fetchCard();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {cards.map((data, index) => {
          const otherData = cardSettings.find(item => item.title === data.title);

          if (otherData) {
            return (
              <CardDataStats
                key={index}
                title={data.title}
                total={data.total}
                rate={otherData.rate}
                levelUp={otherData.levelUp}
                levelDown={otherData.levelDown}
              >
                {/* Directly rendering the SVG icons for each case */}
                {otherData.icon === "icon1" && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="size-6">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                )}
                {otherData.icon === "icon2" && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="size-6">
                  <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
                </svg>
                )}
                {otherData.icon === "icon3" && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="pink" className="size-6">
                  <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                </svg>
                )}
                {otherData.icon === "icon4" && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#19bcff" className="size-6 ">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                </svg>
                )}
              </CardDataStats>
            );
          }

          return null;
        })}
      </div>

      <div className="mt-4 flex flex-col gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {lineChartData.length > 0 && <LineChart data={lineChartData} />}
        {barChartData.length > 0 && <BarChart chartData={barChartData} />}
        <div className='flex flex-col sm:flex-row mt-10'>
          <PieChart chartSettings={pieChartPendingSettings} chartData={pieChartPendingData} title={'Pending Orders'} />
          <PieChart chartSettings={pieChartPastSettings} chartData={pieChartPastData} title={'Past Orders'} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;