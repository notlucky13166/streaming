import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeftIcon,
  SignalIcon,
  ShareIcon,
  TvIcon
} from '@heroicons/react/24/outline';

const StreamViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [match] = useState(location.state?.match || null);
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (match && match.sources && match.sources.length > 0) {
      fetchStreams();
    } else {
      setError('No streams available for this match');
      setLoading(false);
    }
  }, [match, id]);

  const fetchStreams = async () => {
    try {
      if (!match.sources || match.sources.length === 0) {
        setError('No stream sources available');
        setLoading(false);
        return;
      }

      const firstSource = match.sources[0];
      const response = await axios.get(
        `https://streamed.pk/api/stream/${firstSource.source}/${firstSource.id}`
      );
      
      setStreams(response.data);
      if (response.data.length > 0) {
        setSelectedStream(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streams:', error);
      setError('Failed to load stream');
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: match?.title,
          text: `Watch ${match?.title} live`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading stream...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Match not found'}</p>
          <button
            onClick={() => navigate('/live')}
            className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
          >
            Back to Live Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/live')}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">{match.title}</h1>
                {match.time && (
                  <p className="text-sm text-slate-400">{match.time}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SignalIcon className="w-4 h-4 text-red-500 live-indicator" />
                <span className="text-red-500 font-semibold text-sm">LIVE</span>
              </div>
              
              <button
                onClick={handleShare}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {selectedStream ? (
                <iframe
                  src={selectedStream.embedUrl || selectedStream.streamUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  scrolling="no"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  title={match.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <TvIcon className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl mb-2">No stream available</p>
                    <p className="text-sm">Please try another source</p>
                  </div>
                </div>
              )}
            </div>

            {streams.length > 1 && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">Available Streams</h3>
                <div className="flex flex-wrap gap-2">
                  {streams.map((stream, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedStream(stream)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedStream === stream
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Stream {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Match Info</h3>
              
              <div className="space-y-3">
                {match.category && (
                  <div>
                    <span className="text-slate-400 text-sm">Category</span>
                    <p className="text-white capitalize">{match.category}</p>
                  </div>
                )}
                
                {match.time && (
                  <div>
                    <span className="text-slate-400 text-sm">Time</span>
                    <p className="text-white">{match.time}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-slate-400 text-sm">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full live-indicator"></div>
                    <span className="text-red-500">Live</span>
                  </div>
                </div>

                {match.sources && (
                  <div>
                    <span className="text-slate-400 text-sm">Available Sources</span>
                    <p className="text-white">{match.sources.length}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              
              <button 
                onClick={handleShare}
                className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <ShareIcon className="w-4 h-4" />
                <span>Share Match</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamViewer;
