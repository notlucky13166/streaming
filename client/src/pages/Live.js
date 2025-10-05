import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  VideoCameraIcon, 
  UsersIcon, 
  PlayIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

const Live = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await axios.get('/api/streams');
      setStreams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streams:', error);
      setError('Failed to load streams');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading streams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-2">
          Live Streams
        </h1>
        <p className="text-slate-400">
          Watch live streams from our community
        </p>
      </div>

      {/* Streams Grid */}
      {streams.length === 0 ? (
        <div className="text-center py-12">
          <VideoCameraIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No live streams</h3>
          <p className="text-slate-500">Check back later for new streams!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div
              key={stream._id}
              className="stream-card rounded-xl p-6 card-hover cursor-pointer group"
            >
              {/* Stream Preview */}
              <div className="relative mb-4">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                  <VideoCameraIcon className="w-12 h-12 text-slate-600" />
                </div>
                
                {/* Live Indicator */}
                <div className="absolute top-2 left-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold live-indicator flex items-center">
                    <SignalIcon className="w-3 h-3 mr-1" />
                    LIVE
                  </span>
                </div>

                {/* Viewers */}
                <div className="absolute top-2 right-2">
                  <span className="bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                    <UsersIcon className="w-3 h-3 mr-1" />
                    {stream.viewers}
                  </span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary-600 rounded-full p-3">
                    <PlayIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Stream Info */}
              <Link to={`/stream/${stream._id}`}>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {stream.title}
                </h3>
              </Link>
              
              <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                {stream.description}
              </p>

              {/* Stream Meta */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>By {stream.createdBy?.name || 'Unknown'}</span>
                <span>{new Date(stream.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Live;