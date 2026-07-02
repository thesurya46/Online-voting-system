import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

export const StatsCard: React.FC<{ title: string; value: string | number; icon: string }> = ({
  title,
  value,
  icon
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className="text-3xl">{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export const ElectionStats: React.FC<{ electionId: string }> = ({ electionId }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['election-stats', electionId],
    queryFn: async () => {
      const response = await api.get(`/analytics/election/${electionId}/stats`);
      return response.data.data;
    }
  });

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Total Voters"
        value={stats?.totalVoters || 0}
        icon="🗳️"
      />
      <StatsCard
        title="Total Votes"
        value={stats?.totalVotes || 0}
        icon="✅"
      />
      <StatsCard
        title="Voter Turnout"
        value={stats?.voterTurnout?.toFixed(2) + '%' || '0%'}
        icon="📊"
      />
      <StatsCard
        title="Positions"
        value={stats?.positions?.length || 0}
        icon="📋"
      />
    </div>
  );
};
