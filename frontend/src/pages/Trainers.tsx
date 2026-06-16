import React, { useEffect, useState } from 'react';
import api from '../api';

interface Trainer {
  id: number;
  name: string;
  surname: string;
  specialization: string | null;
}

const Trainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get('/trainers');
        setTrainers(response.data);
      } catch (err: any) {
        setError('Failed to load trainers.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  if (loading) return <div>Loading trainers...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Trainers</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">{trainer.name} {trainer.surname}</h3>
            {trainer.specialization && (
              <p className="mt-2 text-sm text-gray-600">Specialization: <span className="font-semibold text-blue-600">{trainer.specialization}</span></p>
            )}
          </div>
        ))}
        {trainers.length === 0 && <p className="text-gray-500">No trainers available.</p>}
      </div>
    </div>
  );
};

export default Trainers;
