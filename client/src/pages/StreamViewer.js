import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hls from 'hls.js';
import {
  ArrowLeftIcon,
  UsersIcon,
  SignalIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const StreamViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchStream();
    incrementViewerCount();

    // Decrement viewer count on unmount
    return () => {
      decrementViewerCount();
    };
  }, [id]);

  const fetchStream = async () => {
    try {
      const response = await axios.get(`/api/streams/${id}`);
      setStream(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stream:', error);
      setError('Failed to load stream');
      setLoading(false);
    }
  };

  const incrementViewerCount = async () => {
    try {
      await axios.post(`/api/streams/${id}/viewers`, { action: 'increment' });
    } catch (error) {
      console.error('Error incrementing viewer count:', error);
    }
  };

  const decrementViewerCount = async () => {
    try {
      await axios.post(`/api/streams/${id}/viewers`, { action: 'decrement' });
    } catch (error) {
      console.error('Error decrementing viewer count:', error);
    }
  };

  useEffect(() => {
    if (stream && stream.hlsUrl && videoRef.current) {
      setupHLSPlayer();
    }
  }, [stream]);

  const setupHLSPlayer = () => {
    const video = videoRef.current;
    const hlsUrl = stream.hlsUrl;

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.log('Autoplay was prevented');
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error');
              break;
            default:
              console.error('Other error');
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.log('Autoplay was prevented');
        });
      });
    } else {
      setError('Your browser does not support HLS streaming');
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play();
        setIsPlaying(true);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: stream?.title,
          text: stream?.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Stream not found'}</p>
          <button
            onClick={() => navigate('/live')}
            className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
          >
            Back to Live Streams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Stream Header */}
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
                <h1 className="text-xl font-semibold text-white">{stream.title}</h1>
                <p className="text-sm text-slate-400">{stream.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Live Indicator */}
              <div className="flex items-center space-x-2">
                <SignalIcon className="w-4 h-4 text-red-500 live-indicator" />
                <span className="text-red-500 font-semibold text-sm">LIVE</span>
              </div>
              
              {/* Viewer Count */}
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">{stream.viewers}</span>
              </div>
              
              {/* Share Button */}
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
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                playsInline
              />
              
              {/* Custom Play/Pause Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayPause}
                    className="bg-primary-600 hover:bg-primary-700 rounded-full p-4 transition-colors"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stream Info Sidebar */}
          <div className="space-y-6">
            {/* Stream Details */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Stream Info</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 text-sm">Streamed by</span>
                  <p className="text-white">{stream.createdBy?.name || 'Unknown'}</p>
                </div>
                
                <div>
                  <span className="text-slate-400 text-sm">Started</span>
                  <p className="text-white">
                    {new Date(stream.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <span className="text-slate-400 text-sm">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full live-indicator"></div>
                    <span className="text-green-500 capitalize">{stream.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Actions */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors">
                  <HeartIcon className="w-4 h-4" />
                  <span>Follow Streamer</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <ShareIcon className="w-4 h-4" />
                  <span>Share Stream</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamViewer;