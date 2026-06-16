import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Trainings</h2>
          <p className="mt-2 text-gray-600">View and manage upcoming horse riding trainings.</p>
          <Link to="/trainings" className="inline-block mt-4 text-blue-600 hover:underline">Go to Trainings &rarr;</Link>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Horses</h2>
          <p className="mt-2 text-gray-600">Browse the list of available horses and their details.</p>
          <Link to="/horses" className="inline-block mt-4 text-blue-600 hover:underline">View Horses &rarr;</Link>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Trainers</h2>
          <p className="mt-2 text-gray-600">See our expert trainers and their specializations.</p>
          <Link to="/trainers" className="inline-block mt-4 text-blue-600 hover:underline">Meet Trainers &rarr;</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
