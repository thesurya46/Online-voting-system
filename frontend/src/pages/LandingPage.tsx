import React from 'react';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-5xl font-bold mb-4">Secure Online Voting System</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            A modern, secure, and transparent voting platform for organizations
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Register</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔒 Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <p>End-to-end encryption and secure authentication</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Real-time</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Live vote counting and election statistics</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Scalable infrastructure for large-scale elections</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};
