import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardComponent from './dashboardComponent';

const Dashboard = () => {
  const [totalMessagesAdmin, setTotalMessagesAdmin] = useState(0);
  const [messagesCountMontlyAdmin, setMessagesCountMontlyAdmin] = useState([]);
  const [messageDataBusiness, setMessageDataBusiness] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showBusiness, setShowBusiness] = useState(false)
  const [selectedBusinessId, setSelectedBusinessId] = useState('')
  const [selectedBusinessName, setSelectedBusinessName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:3000/api/messages/count-empty-ourData`);
      setTotalMessagesAdmin(response.data.count);

      const responseMonthlyData = await axios.get(`http://localhost:3000/api/messages/monthly-count-empty-ourData`);
      setMessagesCountMontlyAdmin(responseMonthlyData.data);

      const responseBusinessData = await axios.get(`http://localhost:3000/api/messages/count-empty-ourData-by-business`);
      const businessDataWithNames = await Promise.all(
        responseBusinessData.data.map(async (data) => {
          const businessName = await fetchBusinessName(data.businessId);
          return { ...data, businessName };
        })
      );
      setMessageDataBusiness(businessDataWithNames);
    };
    fetchData();
  }, []);

  // Function to fetch the business name by id
  async function fetchBusinessName(id) {
    if (!id) return '';

    try {
      const response = await fetch(`http://localhost:3000/api/business/name?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.businessName;
    } catch (error) {
      console.error('Failed to fetch business name:', error);
      return null;
    }
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Filter the data based on the selected month and year
  const filteredMessagesCount = messagesCountMontlyAdmin.filter((data) =>
    (selectedMonth ? (data.month && data.month.includes(selectedMonth)) : true) &&
    (selectedYear ? (data.month && data.month.includes(selectedYear)) : true)
  );

  const filteredBusinessData = messageDataBusiness.filter((data) =>
    (selectedMonth ? (data.month && data.month.includes(selectedMonth)) : true) &&
    (selectedYear ? (data.month && data.month.includes(selectedYear)) : true)
  );

  const handleShowBusiness = (data) => {
    setShowBusiness(true)
    setSelectedBusinessId(data.businessId)
    setSelectedBusinessName(data.businessName)
  }

  return (
    <div className='font-poppins max-w-full md:max-w-[80vw] w-full md:mt-4 px-4 md:px-10 flex flex-col gap-y-4 mt-16 py-3'>
      <div className='w-full flex flex-col md:flex-row justify-between'>
        <div className='text-2xl md:text-3xl font-semibold'>Platform Overview</div>
      </div>

      <div className='opacity-50 text-xs'>Total Messages Sent from Platform</div>
      <div className='flex flex-col gap-y-3 md:gap-y-5 bg-[#40BBFF] w-full md:w-1/4 px-4 md:px-7 py-2 md:py-3 text-xs rounded-md'>
        <div>Messages</div>
        <div className='flex justify-between'>
          <div className='font-bold text-sm'>{totalMessagesAdmin}</div>
          <div>Till Now</div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div className='opacity-50 text-xs'>Historical messages countsd </div>
        <div className='flex gap-3'>
          <select
            id="month-options"
            name="month-options"
            className="block bg-white border border-gray-300 rounded-md shadow-sm mr-3 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="" disabled>Select Month</option>
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
            <option value="" disabled>Select Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
      </div>

      <div className='flex flex-wrap justify-start gap-2'>
        {filteredMessagesCount.map((data, index) => (
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
          <div className='opacity-50 text-xs'>Breakdown by Business Owners</div>
        </div>
        <div className='flex flex-wrap justify-start gap-2'>
          {messageDataBusiness.map((data, index) => (
            <div key={index} className={`flex flex-col gap-y-3 md:gap-y-5 bg-[#E3F5FF] ${data.color} w-full md:w-[24.3%] px-4 md:px-7 py-2 md:py-3 text-xs rounded-md cursor-pointer hover:bg-blue-500 transition-all duration-500`} onClick={() => { handleShowBusiness(data) }}>
              <div>Messages</div>
              <div className='flex justify-between'>
                <div className='font-bold text-sm'>{data.amount}</div>
                <div>{data.businessName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showBusiness && <DashboardComponent businessId={selectedBusinessId} businessName={selectedBusinessName} />}
    </div>
  );
};

export default Dashboard;
