import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { ElectionStats } from '../components/StatsCard';
import { VoteChart } from '../components/VoteChart';

interface AnalyticsPageProps {
  electionId: string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ electionId }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['election-stats', electionId],
    queryFn: () => analyticsService.getElectionStats(electionId)
  });

  const handleExportPDF = async () => {
    await analyticsService.exportReportAsPDF(electionId);
  };

  const handleExportCSV = async () => {
    await analyticsService.exportReportAsCSV(electionId);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Layout>
          <div>Loading analytics...</div>
        </Layout>
      </>
    );
  }

  const chartData = stats?.positions?.[0]?.candidates?.map((c: any) => ({
    name: c.name,
    votes: c.votes
  })) || [];

  return (
    <>
      <Header />
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Election Analytics</h1>
            <p className="text-gray-600">Real-time voting statistics and analysis</p>
          </div>

          <ElectionStats electionId={electionId} />

          <VoteChart data={chartData} />

          <Card>
            <CardHeader>
              <CardTitle>Position Results</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.positions?.map((position: any) => (
                <div key={position.positionId} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{position.positionTitle}</h3>
                  {position.candidates.map((candidate: any) => (
                    <div key={candidate.candidateId} className="flex justify-between mb-2">
                      <span>{candidate.name}</span>
                      <span>{candidate.votes} votes ({candidate.percentage}%)</span>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={handleExportPDF} variant="primary">
                  📄 Export as PDF
                </Button>
                <Button onClick={handleExportCSV} variant="secondary">
                  📊 Export as CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};
