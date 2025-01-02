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
                  <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z" />
                    <path d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z" />
                  </svg>
                )}
                {otherData.icon === "icon2" && (
                  <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z" />
                    <path d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z" />
                  </svg>
                )}
                {otherData.icon === "icon3" && (
                  <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z" />
                    <path d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z" />
                  </svg>
                )}
                {otherData.icon === "icon4" && (
                  <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z" />
                    <path d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z" />
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