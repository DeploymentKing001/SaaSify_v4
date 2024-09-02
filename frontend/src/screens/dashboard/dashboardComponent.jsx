import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { handleSave } from '../../components/helperFunctions/checkConfig';
import axios from 'axios';

const DashboardComponent = ({businessId, businessName}) => {
  const { data } = useSelector((state) => state.businessAccount);
  const [totalBusinessCount, setTotalBusinessCount] = useState(0);
  const [monthlyBusinessCount, setMonthlyBusinessCount] = useState([]);
  const [employeeMonthlyCount, setEmployeeMonthlyCount] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (data && data.businessAccountId && data.longToken && businessId) {
      handleSave(data.longToken, data.businessAccountId, businessId);
    }

    const getInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/count/?businessId=${businessId}`);
        setTotalBusinessCount(response.data.totalMessages);

        const responseMonthly = await axios.get(`http://localhost:3000/api/messages/count/monthly/?businessId=${businessId}`);
        setMonthlyBusinessCount(responseMonthly.data);

        const responseEmployeeMonthly = await axios.get(`http://localhost:3000/api/messages/count/employees/?businessId=${businessId}`);
        setEmployeeMonthlyCount(responseEmployeeMonthly.data);
      } catch (error) {
        console.error('Error fetching business count:', error);
      }
    };

    getInfo();
  }, [data, businessId]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const filteredMonthlyCount = monthlyBusinessCount.filter((item) =>
    item.month.includes(selectedMonth) && item.month.includes(selectedYear)
  );

  const filteredEmployeeCount = employeeMonthlyCount.filter((item) =>
    item.month.includes(selectedMonth) && item.month.includes(selectedYear)
  );

  return (
    <div className='font-poppins max-w-full md:max-w-[80vw] w-full md:mt-4 flex flex-col gap-y-4 mt-16 py-3'>
      <div className='w-full flex flex-col md:flex-row justify-between'>
        <div className='text-2xl md:text-3xl font-semibold'>{businessName} Overview</div>
        <div className='flex flex-col gap-y-3 md:gap-y-5 bg-[#FF6666] w-full md:w-1/4 px-4 md:px-7 py-2 md:py-3 text-xs rounded-md'>
          <div>Current Limit</div>
          <div className='flex justify-between'>
            <div className='font-bold text-sm'>9,000</div>
            <div>Monthly</div>
          </div>
        </div>
      </div>

      <div className='opacity-50 text-xs'>Total Messages Sent</div>
      <div className='flex flex-col gap-y-3 md:gap-y-5 bg-[#40BBFF] w-full md:w-1/4 px-4 md:px-7 py-2 md:py-3 text-xs rounded-md'>
        <div>Messages</div>
        <div className='flex justify-between'>
          <div className='font-bold text-sm'>{totalBusinessCount}</div>
          <div>Till Now</div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div className='opacity-50 text-xs'>Historical messages counts</div>
        <div className='flex gap-3'>
          <select
            id="month-options"
            name="month-options"
            className="block bg-white border border-gray-300 rounded-md shadow-sm mr-3 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="" disabled defaultValue={'select'}>Select Month</option>
            <option value="January">Jan</option>
            <option value="February">Feb</option>
            <option value="March">Mar</option>
            <option value="April">Apr</option>
            <option value="May">May</option>
            <option value="June">Jun</option>
            <option value="July">Jul</option>
            <option value="August">Aug</option>
            <option value="September">Sep</option>
            <option value="October">Oct</option>
            <option value="November">Nov</option>
            <option value="December">Dec</option>
          </select>

          <select
            id="year-options"
            name="year-options"
            className="block bg-white border border-gray-300 rounded-md shadow-sm mr-3 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="" disabled defaultValue={'select'}>Select Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
      </div>

      <div className='flex flex-wrap justify-start gap-2'>
        {filteredMonthlyCount.map((data, index) => (
          <div key={index} className={`flex flex-col gap-y-3 md:gap-y-5 bg-[#E3F5FF] ${data.color} w-full md:w-[24.3%] px-4 md:px-7 py-2 md:py-3 text-xs rounded-md`}>
            <div>Messages</div>
            <div className='flex justify-between'>
              <div className='font-bold text-sm'>{data.amount}</div>
              <div>{data.month}</div>
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-y-4 md:max-h-56 md:overflow-y-auto'>
        <div className='flex md:justify-between justify-center items-center flex-wrap'>
          <div className='opacity-50 text-xs'>Breakdown by employee</div>
          <select
            id="month-employee-options"
            name="month-employee-options"
            className="block bg-white border border-gray-300 rounded-md shadow-sm mr-3 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="" disabled defaultValue={'select'}>Select Month</option>
            <option value="January">Jan</option>
            <option value="February">Feb</option>
            <option value="March">Mar</option>
            <option value="April">Apr</option>
            <option value="May">May</option>
            <option value="June">Jun</option>
            <option value="July">Jul</option>
            <option value="August">Aug</option>
            <option value="September">Sep</option>
            <option value="October">Oct</option>
            <option value="November">Nov</option>
            <option value="December">Dec</option>
          </select>
        </div>

        <div className='flex flex-wrap justify-start gap-2'>
          {filteredEmployeeCount.map((data, index) => (
            <div key={index} className={`flex flex-col gap-y-3 ${data.employeeId === '' ? 'hidden' : ''} md:gap-y-5 bg-[#E3F5FF] ${data.color} w-full md:w-[24.3%] px-4 md:px-7 py-2 md:py-3 text-xs rounded-md`}>
              <div>Messages</div>
              <div className='flex justify-between'>
                <div className='font-bold text-sm'>{data.amount}</div>
                <div className='flex gap-x-3'>
                  <div>{data.employeeId}</div>
                  <div>{data.month}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className='opacity-50 text-xs'>Connection Status</div>
      <div className='flex flex-wrap justify-between gap-y-3'>
        <div className='w-full md:w-2/5 bg-[#E3F0FF] px-4 md:px-5 py-2 rounded-md flex items-center justify-between'>
          <div className='font-semibold italic'>Page Access Token</div>
          <div className='bg-[#00FF75] rounded-md px-3 py-1 cursor-pointer font-semibold text-xs'>{data?.credentialsStatus ? 'Valid' : 'Invalid'}</div>
        </div>
        <div className='w-full md:w-2/5 bg-[#E3F0FF] px-4 md:px-5 py-2 rounded-md flex items-center justify-between'>
          <div className='font-semibold italic'>Business Account</div>
          <div className='bg-[#00FF75] rounded-md px-3 py-1 cursor-pointer font-semibold text-xs'>{data?.credentialsStatus ? 'Valid' : 'Invalid'}</div>
        </div>
      </div> */}
    </div>
  );
};

export default DashboardComponent;
