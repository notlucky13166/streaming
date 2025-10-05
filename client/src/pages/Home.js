import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayIcon, 
  FilmIcon, 
  VideoCameraIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to Lukie's Streams
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Your ultimate destination for movies and live streaming entertainment. 
            Watch, stream, and connect with our community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/movies"
              className="flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <FilmIcon className="w-5 h-5" />
              <span>Browse Movies</span>
            </Link>
            
            <Link
              to="/live"
              className="flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              <VideoCameraIcon className="w-5 h-5" />
              <span>Watch Live</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose Lukie's Streams?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Experience entertainment like never before with our comprehensive streaming platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 bg-slate-800 rounded-lg card-hover">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FilmIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Huge Movie Library</h3>
              <p className="text-slate-400">
                Access thousands of movies from various genres with regular updates
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 bg-slate-800 rounded-lg card-hover">
              <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <VideoCameraIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Streaming</h3>
              <p className="text-slate-400">
                Watch live streams from content creators and join the community
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 bg-slate-800 rounded-lg card-hover">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">High Quality</h3>
              <p className="text-slate-400">
                Enjoy HD streaming with adaptive bitrate for the best experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Streaming?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of users already enjoying Lukie's Streams
          </p>
          
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <PlayIcon className="w-5 h-5" />
            <span>Get Started Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;