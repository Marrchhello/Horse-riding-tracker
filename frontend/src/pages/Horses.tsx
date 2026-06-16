import React, { useEffect, useState } from 'react';
import api from '../api';

interface Horse {
  id: number;
  name: string;
  discipline: string;
  daily_limit: number;
}

const Horses: React.FC = () => {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const response = await api.get('/horses');
        setHorses(response.data);
      } catch (err: any) {
        setError('Failed to load horses.');
      } finally {
        setLoading(false);
      }
    };
    fetchHorses();
  }, []);

  if (loading) return <div>Loading horses...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Horses</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {horses.map((horse) => (
          <div key={horse.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">{horse.name}</h3>
            <p className="mt-2 text-sm text-gray-600">Discipline: <span className="font-semibold text-green-600">{horse.discipline}</span></p>
            <p className="mt-1 text-sm text-gray-600">Daily Limit: {horse.daily_limit} trainings</p>
          </div>
        ))}
        {horses.length === 0 && <p className="text-gray-500">No horses available.</p>}
      </div>
    </div>
  );
};

export default Horses;
