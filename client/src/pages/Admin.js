import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  VideoCameraIcon,
  SignalIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [streams, setStreams] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStreams();
  }, [user, navigate]);

  const fetchStreams = async () => {
    try {
      const response = await axios.get('/api/streams');
      setStreams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streams:', error);
      setLoading(false);
    }
  };

  const handleCreateStream = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/streams', formData);
      setFormData({ title: '', description: '' });
      setShowCreateForm(false);
      fetchStreams();
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Failed to create stream');
    }
  };

  const handleDeleteStream = async (id) => {
    if (window.confirm('Are you sure you want to delete this stream?')) {
      try {
        await axios.delete(`/api/streams/${id}`);
        fetchStreams();
      } catch (error) {
        console.error('Error deleting stream:', error);
        alert('Failed to delete stream');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/streams/${id}/status`, { status });
      fetchStreams();
    } catch (error) {
      console.error('Error updating stream status:', error);
      alert('Failed to update stream status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage live streams and content</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Stream</span>
        </button>
      </div>

      {/* Create Stream Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Stream</h2>
            
            <form onSubmit={handleCreateStream}>
              <div className="mb-4">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Stream Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="Enter stream title"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 h-24 resize-none"
                  placeholder="Enter stream description"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Create Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Streams List */}
      <div className="bg-slate-800 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Active Streams</h2>
        </div>
        
        {streams.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <VideoCameraIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No streams created yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {streams.map((stream) => (
              <div key={stream._id} className="px-6 py-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                      <VideoCameraIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium">{stream.title}</h3>
                      <p className="text-slate-400 text-sm">{stream.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Stream Stats */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <SignalIcon className="w-4 h-4 text-green-500" />
                        <span className="text-slate-400 capitalize">{stream.status}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">{stream.viewers}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <select
                        value={stream.status}
                        onChange={(e) => handleStatusChange(stream._id, e.target.value)}
                        className="bg-slate-700 text-white px-3 py-1 rounded text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="ended">Ended</option>
                      </select>
                      
                      <button
                        onClick={() => handleDeleteStream(stream._id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;