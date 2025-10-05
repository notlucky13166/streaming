import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeftIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-500">{error || 'Movie not found'}</p>
          <button
            onClick={() => navigate('/movies')}
            className="mt-4 btn-primary"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const vidsrcUrl = movie.imdbId 
    ? `https://vidsrc.dev/embed/movie/${movie.imdbId}`
    : null;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/movies')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Movies</span>
        </button>
      </div>

      {/* Video Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-8">
          {vidsrcUrl ? (
            <iframe
              src={vidsrcUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
              title={movie.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <p className="text-xl mb-2">Player not available</p>
                <p className="text-sm">IMDb ID not found for this movie</p>
              </div>
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              {movie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  className="w-64 rounded-lg shadow-xl"
                />
              ) : (
                <div className="w-64 h-96 bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-slate-600">No poster</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-lg text-slate-400 italic mb-4">{movie.tagline}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-300">
                {movie.releaseDate && (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span>{movie.rating?.toFixed(1)} / 10</span>
                </div>
              </div>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
                <p className="text-slate-300 leading-relaxed">{movie.overview}</p>
              </div>

              {/* Cast */}
              {movie.cast?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Cast</h2>
                  <div className="flex flex-wrap gap-3">
                    {movie.cast.slice(0, 6).map((actor) => (
                      <div
                        key={actor.id}
                        className="text-sm"
                      >
                        <p className="text-white font-medium">{actor.name}</p>
                        <p className="text-slate-400">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePlayer;
