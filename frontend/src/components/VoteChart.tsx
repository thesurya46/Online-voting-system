import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

interface VoteChartProps {
  data: Array<{
    name: string;
    votes: number;
  }>;
}

export const VoteChart: React.FC<VoteChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes" fill="#000" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
