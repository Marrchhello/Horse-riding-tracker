import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';

interface Training {
  id: number;
  horse_id: number;
  trainer_id: number;
  training_type_id: number;
  date: string;
  capacity: number;
  status: string;
}

interface PaginatedResponse {
  items: Training[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const Trainings: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [trainerFilter, setTrainerFilter] = useState('');

  // Auxiliary data for filters/display
  const [trainers, setTrainers] = useState<any[]>([]);
  const [horses, setHorses] = useState<any[]>([]);
  const [trainingTypes, setTrainingTypes] = useState<any[]>([]);

  // Create Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newTraining, setNewTraining] = useState({
    horse_id: '',
    trainer_id: '',
    training_type_id: '',
    date: ''
  });

  // Participants State
  const [participantsMap, setParticipantsMap] = useState<Record<number, any[]>>({});

  useEffect(() => {
    api.get('/trainers').then(res => setTrainers(res.data)).catch(console.error);
    api.get('/horses').then(res => setHorses(res.data)).catch(console.error);
    api.get('/training-types').then(res => setTrainingTypes(res.data)).catch(console.error);
  }, []);

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '6'); // 6 per page
      if (statusFilter) params.append('status', statusFilter);
      if (trainerFilter) params.append('trainer_id', trainerFilter);

      const response = await api.get(`/trainings/search?${params.toString()}`);
      const data: PaginatedResponse = response.data;
      setTrainings(data.items);
      setTotalPages(data.pages);
    } catch (err: any) {
      setError('Failed to fetch trainings.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, trainerFilter]);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const handleJoin = async (id: number) => {
    try {
      await api.post(`/trainings/${id}/join`, {});
      alert('Successfully joined the training!');
      fetchTrainings(); 
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to join training.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this training?')) return;
    try {
      await api.delete(`/trainings/${id}`);
      fetchTrainings();
    } catch (err: any) {
      alert('Failed to delete training.');
    }
  };

  const fetchParticipants = async (id: number) => {
    try {
      const res = await api.get(`/trainings/${id}/participants`);
      setParticipantsMap(prev => ({ ...prev, [id]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/trainings', {
        ...newTraining,
        horse_id: parseInt(newTraining.horse_id),
        trainer_id: parseInt(newTraining.trainer_id),
        training_type_id: parseInt(newTraining.training_type_id)
      });
      setIsCreating(false);
      fetchTrainings();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create training.');
    }
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Trainings</h1>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 sm:mt-0"
        >
          {isCreating ? 'Cancel' : '+ Create Training'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 bg-white border border-gray-200 rounded shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">New Training Session</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Horse</label>
              <select required className="w-full px-3 py-2 border rounded" value={newTraining.horse_id} onChange={e => setNewTraining({...newTraining, horse_id: e.target.value})}>
                <option value="">Select Horse</option>
                {horses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trainer</label>
              <select required className="w-full px-3 py-2 border rounded" value={newTraining.trainer_id} onChange={e => setNewTraining({...newTraining, trainer_id: e.target.value})}>
                <option value="">Select Trainer</option>
                {trainers.map(t => <option key={t.id} value={t.id}>{t.name} {t.surname}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Training Type</label>
              <select required className="w-full px-3 py-2 border rounded" value={newTraining.training_type_id} onChange={e => setNewTraining({...newTraining, training_type_id: e.target.value})}>
                <option value="">Select Type</option>
                {trainingTypes.map(t => <option key={t.id} value={t.id}>{t.discipline} - {t.training_mode}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input required type="datetime-local" className="w-full px-3 py-2 border rounded" value={newTraining.date} onChange={e => setNewTraining({...newTraining, date: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">Submit</button>
        </form>
      )}

      {/* Filters */}
      <div className="p-4 bg-white rounded shadow-sm flex flex-col sm:flex-row gap-4 border border-gray-200">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select 
            value={statusFilter} 
            onChange={handleFilterChange(setStatusFilter)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="full">Full</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Trainer</label>
          <select 
            value={trainerFilter} 
            onChange={handleFilterChange(setTrainerFilter)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          >
            <option value="">All Trainers</option>
            {trainers.map(t => (
              <option key={t.id} value={t.id}>{t.name} {t.surname}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {/* Grid */}
      {loading ? (
        <div>Loading trainings...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training) => (
            <div key={training.id} className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  training.status === 'open' ? 'bg-green-100 text-green-800' :
                  training.status === 'full' ? 'bg-yellow-100 text-yellow-800' :
                  training.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {training.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(training.date).toLocaleString()}
                </span>
              </div>
              
              <div className="flex-1 space-y-2 relative">
                <button onClick={() => handleDelete(training.id)} className="absolute top-0 right-0 text-red-500 hover:text-red-700 text-sm">Delete</button>
                <p className="text-sm text-gray-700">Trainer: <span className="font-medium">{trainers.find(t => t.id === training.trainer_id)?.surname || training.trainer_id}</span></p>
                <p className="text-sm text-gray-700">Horse: <span className="font-medium">{horses.find(h => h.id === training.horse_id)?.name || training.horse_id}</span></p>
                <p className="text-sm text-gray-700">Capacity: <span className="font-medium">{training.capacity}</span></p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => fetchParticipants(training.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Participants
                </button>
                {participantsMap[training.id] && (
                  <ul className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {participantsMap[training.id].length > 0 ? (
                      participantsMap[training.id].map(p => <li key={p.id}>User ID: {p.user_id}</li>)
                    ) : <li>No participants</li>}
                  </ul>
                )}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleJoin(training.id)}
                  disabled={training.status !== 'open'}
                  className={`w-full px-4 py-2 text-sm font-medium rounded border ${
                    training.status === 'open' 
                      ? 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  {training.status === 'open' ? 'Join Training' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
          {trainings.length === 0 && <p className="text-gray-500">No trainings match your criteria.</p>}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Trainings;
