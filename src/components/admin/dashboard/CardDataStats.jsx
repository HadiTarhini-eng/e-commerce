import React from 'react';

const CardDataStats = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="flex flex-row justify-between rounded-lg border border-stroke bg-white px-6 py-4 px-7.5 shadow-top-lg dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm font-medium">{title}</span>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
        </div>
      </div>

      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>
    </div>
  );
};

export default CardDataStats;
