import React from 'react';
import { 
    BarChart as ReBarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

interface Props {
    data: any[];
    xKey: string;
    yKey: string;
    height?: number;
    color?: string;
}

export function BarChart({ data, xKey, yKey, height = 300, color = '#3b82f6' }: Props) {
    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <ReBarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey={xKey} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ 
                            borderRadius: '8px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }} 
                    />
                    <Bar 
                        dataKey={yKey} 
                        fill={color} 
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    />
                </ReBarChart>
            </ResponsiveContainer>
        </div>
    );
}
