'use client';

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid
} from 'recharts';
import usefoodStore from '@/store/foodStore';
import { useEffect } from 'react';
import dayjs from 'dayjs';

const COLORS = ['#10b981', '#ef4444', '#f59e0b']; // Claimed, Expired, Available

const TestChart = () => {
  const { data, fetchData } = usefoodStore();

  useEffect(() => {
    if (!data || data.length === 0) {
      fetchData();
    }
  }, [data, fetchData]);

  const statusData = data ? getStatusCounts(data) : [];
  const monthlyData = data ? getPostsPerMonth(data) : [];
  const last7DaysData = data ? getLast7DaysPosts(data) : [];

  return (
    <>
      {/* 🥧 Pie & 📊 Bar Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Your Post Status">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ChartCard>

        <ChartCard title="Monthly Posts">
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" stroke="#8884d8" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>

      {/* 📈 Line Chart – Full Width Below */}
      <ChartCard title="Last 7 Days Activity">
        <LineChart data={last7DaysData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ChartCard>
    </>

  );
};

export default TestChart;

// ✅ Reusable Chart Card Wrapper
const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 mt-6">
    <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">{title}</h3>
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

const getStatusCounts = (donations = []) => {
  const now = dayjs();
  const counts = { Claimed: 0, Expired: 0, Available: 0 };

  donations.forEach(post => {
    const isExpired = dayjs(post.expiresAt).isBefore(now);
    const isClaimed = post.status === 'claimed';

    if (isClaimed) counts.Claimed += 1;
    else if (isExpired) counts.Expired += 1;
    else counts.Available += 1;
  });

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

const getPostsPerMonth = (donations = []) => {
  const counts = {};

  donations.forEach(post => {
    const month = dayjs(post.postedAt).format('MMM YYYY');
    counts[month] = (counts[month] || 0) + 1;
  });

  return Object.entries(counts).map(([month, value]) => ({ month, value }));
};

const getLast7DaysPosts = (donations = []) => {
  const today = dayjs();
  const counts = {};

  for (let i = 6; i >= 0; i--) {
    const date = today.subtract(i, 'day').format('DD MMM');
    counts[date] = 0;
  }

  donations.forEach(post => {
    const date = dayjs(post.postedAt).format('DD MMM');
    if (counts.hasOwnProperty(date)) counts[date]++;
  });

  return Object.entries(counts).map(([date, value]) => ({ date, value }));
};
