import React from 'react';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.firstName}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is your dashboard. More features coming soon...</p>
          </CardContent>
        </Card>
      </Layout>
    </>
  );
};
