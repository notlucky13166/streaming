import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  VideoCameraIcon, 
  PlayIcon,
  SignalIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Live = () => {
  const [matches, setMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('football');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      fetchMatches();
    }
  }, [selectedSport]);

  const fetchSports = async () => {
    try {
      const response = await axios.get('https://streamed.pk/api/sports');
      setSports(response.data);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://streamed.pk/api/matches/${selectedSport}`);
      setMatches(response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load live matches');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading live matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-2">
          Live Sports
        </h1>
        <p className="text-slate-400">
          Watch live sports matches from around the world
        </p>
      </div>

      {sports.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {sports.map((sport) => {
            const sportId = typeof sport === 'string' ? sport : sport.id;
            const sportName = typeof sport === 'string' ? sport : sport.name;
            
            return (
              <button
                key={sportId}
                onClick={() => setSelectedSport(sportId)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  selectedSport === sportId
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sportName}
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <TrophyIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No live matches</h3>
          <p className="text-slate-500">Check back later for live {selectedSport} matches!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const firstSource = match.sources && match.sources[0];
            const matchId = firstSource ? `${firstSource.source}-${firstSource.id}` : match.id;
            
            return (
              <div
                key={matchId}
                className="stream-card rounded-xl p-6 card-hover cursor-pointer group"
              >
                <div className="relative mb-4">
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {match.poster ? (
                      <img 
                        src={match.poster} 
                        alt={match.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <VideoCameraIcon className="w-12 h-12 text-slate-600" />
                    )}
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold live-indicator flex items-center">
                      <SignalIcon className="w-3 h-3 mr-1" />
                      LIVE
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary-600 rounded-full p-3">
                      <PlayIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <Link to={`/stream/${matchId}`} state={{ match }}>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {match.title}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="capitalize">{match.category || selectedSport}</span>
                  {match.time && <span>{match.time}</span>}
                </div>

                {firstSource && (
                  <div className="text-xs text-slate-500">
                    {match.sources.length} stream{match.sources.length !== 1 ? 's' : ''} available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Live;
