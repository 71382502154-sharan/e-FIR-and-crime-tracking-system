import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { FIR } from '../types';

interface DashboardChartsProps {
  firs: FIR[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardCharts({ firs }: DashboardChartsProps) {
  const { statusData, monthlyData } = useMemo(() => {
    const statusCounts = firs.reduce((acc, fir) => {
      acc[fir.status] = (acc[fir.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    const monthlyCounts = firs.reduce((acc, fir) => {
      const month = new Date(fir.dateFiled).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Show up to current month or months with data
    const currentMonthIdx = new Date().getMonth();
    const monthlyData = monthsOrder.map((month, idx) => ({
      name: month,
      count: monthlyCounts[month] || 0
    })).filter((m, idx) => m.count > 0 || idx <= currentMonthIdx);

    return { statusData, monthlyData };
  }, [firs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Trends Chart */}
      <div className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.07)]">
        <h3 className="text-lg font-bold text-slate-800 mb-4 font-display">FIR Submission Trends</h3>
        <div className="h-64">
          
            <LineChart width={500} height={250} data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="count" name="FIRs Filed" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          
        </div>
      </div>

      {/* Status Distribution Chart */}
      <div className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.07)]">
        <h3 className="text-lg font-bold text-slate-800 mb-4 font-display">Status Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          
            <PieChart width={300} height={250}>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          
        </div>
      </div>
    </div>
  );
}
