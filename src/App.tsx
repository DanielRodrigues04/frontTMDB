import React, { useState, useEffect } from 'react';
import { Film, Search, Loader, X } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchQuery, movies]);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movies/popular');
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      setMovies(data.results);
      setFilteredMovies(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-indigo-400 animate-spin" />
          <p className="text-indigo-200 text-lg">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 p-6 rounded-lg max-w-md text-center">
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={fetchMovies}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-8">
            <div className="flex items-center gap-3">
              <Film className="w-10 h-10 text-indigo-400" />
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                PiaFlix
              </h1>
            </div>
             {/* fazer uma contagem com umm loading para mostrar o resultado apos pesquisa */}
            <div className="relative flex-1 max-w-xl w-full">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'scale-105' : 'scale-100'
              }`}>
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-gray-800/50 text-white placeholder-gray-400 px-12 py-3 rounded-xl 
                    border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 
                    outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                      hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Film className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl text-gray-400 mb-2">No movies found</h2>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group bg-gray-800/50 rounded-xl overflow-hidden hover:scale-[1.02] 
                  transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                    {movie.title}
                  </h2>
                  <p className="text-sm text-indigo-400 mb-2">
                    {new Date(movie.release_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {movie.overview}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;