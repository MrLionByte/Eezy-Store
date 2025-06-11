import { useEffect, useState } from 'react';
import { adminDashboardService } from '../../../services/apiService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#22c55e', '#14b8a6', '#eab308'];

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardService.getTopProducts()
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 bg-muted min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-primary">Admin Dashboard</h1>

      
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Top Selling Products (Bar)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-48">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="product_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_sales">
                    {data.map((entry, index) => (
                      <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Top Selling Products (Pie)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-48">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={data}
                    dataKey="total_sales"
                    nameKey="product_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                     label={({ name }) => `${name.substring(0, 8)}${name.length > 8 ? '…' : ''}`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
    
    </div>
  );
}
