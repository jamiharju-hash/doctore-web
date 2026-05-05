import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Award, Calendar, Percent } from 'lucide-react';

const roiData = [
  { month: 'Jan', roi: 4.5 },
  { month: 'Feb', roi: 5.2 },
  { month: 'Mar', roi: 3.8 },
  { month: 'Apr', roi: 6.1 },
  { month: 'May', roi: 5.8 },
];

const accuracyData = [
  { range: '0-1% Edge', acc: 51.2 },
  { range: '1-2% Edge', acc: 53.5 },
  { range: '2-4% Edge', acc: 56.8 },
  { range: '4%+ Edge', acc: 62.1 },
];

const distributionData = [
  { name: 'Wins', value: 585, color: '#10b981' },
  { name: 'Losses', value: 415, color: '#ef4444' },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-slate-500 font-medium">Deep-dive into model precision and historical returns</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">+0.4%</Badge>
            </div>
            <h4 className="text-sm font-medium text-slate-500">All-Time ROI</h4>
            <p className="text-2xl font-bold font-display">+18.42%</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-default/10 text-accent-default rounded-lg">
                <Award size={20} />
              </div>
              <Badge variant="outline">Top 5%</Badge>
            </div>
            <h4 className="text-sm font-medium text-slate-500">Sharpe Ratio</h4>
            <p className="text-2xl font-bold font-display">1.64</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Calendar size={20} />
              </div>
              <p className="text-xs text-slate-400">Total Sample</p>
            </div>
            <h4 className="text-sm font-medium text-slate-500">Games Predicted</h4>
            <p className="text-2xl font-bold font-display">2,410</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Percent size={20} />
              </div>
              <p className="text-xs font-bold text-amber-600">Stable</p>
            </div>
            <h4 className="text-sm font-medium text-slate-500">Win Probability</h4>
            <p className="text-2xl font-bold font-display">58.5%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-display">Probability Calibration</CardTitle>
            <CardDescription>Predicted probability vs Actual win rate by edge bracket</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                  <YAxis domain={[50, 65]} axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="acc" fill="var(--dt-color-accent-default)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
           <CardHeader>
            <CardTitle className="text-lg font-display">W/L Distribution</CardTitle>
            <CardDescription>Total outcomes breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
             <div className="h-[240px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={distributionData}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {distributionData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="flex gap-6 mt-4 w-full justify-center">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500" />
                 <span className="text-xs font-medium text-slate-600">Wins (58.5%)</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500" />
                 <span className="text-xs font-medium text-slate-600">Losses (41.5%)</span>
               </div>
             </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-sm">
           <CardHeader>
            <CardTitle className="text-lg font-display">Month-over-Month ROI (%)</CardTitle>
            <CardDescription>Consolidated portfolio growth trend</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roiData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                   <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                   <Tooltip />
                   <Line 
                    type="monotone" 
                    dataKey="roi" 
                    stroke="var(--dt-color-accent-default)" 
                    strokeWidth={3} 
                    dot={{ fill: 'var(--dt-color-accent-default)', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
