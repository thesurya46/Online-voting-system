import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';

export const AdminDashboardPage: React.FC = () => {
  const { data: systemStats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: () => analyticsService.getSystemStats()
  });

  const { data: activityLog } = useQuery({
    queryKey: ['activity-log'],
    queryFn: () => analyticsService.getUserActivityLog(50)
  });

  return (
    <>
      <Header />
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and activity monitoring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent>
                <div className="text-center">
                  <p className="text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold">{systemStats?.totalUsers || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <p className="text-gray-600">Total Elections</p>
                  <p className="text-3xl font-bold">{systemStats?.totalElections || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <p className="text-gray-600">Total Votes</p>
                  <p className="text-3xl font-bold">{systemStats?.totalVotes || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activityLog?.map((log: any, index: number) => (
                  <div key={index} className="border-b pb-2 text-sm">
                    <p className="font-semibold">{log.action}</p>
                    <p className="text-gray-600">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};
