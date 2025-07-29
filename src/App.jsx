import React, { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import Search from './Components/Search'
import Loader from './Components/Loader';
import Moviecard from './Components/Moviecard';
import { updatesearchcount, trendingmovies } from './appwrite';
const API_BASE_URL = 'https://api.themoviedb.org/3/keyword/{keyword_id}/movies';

const Api_Opitons = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`

  }
}
const App = () => {
  const [searchterm, setsearchterm] = useState('');
  const [errormsg, seterrormsg] = useState('');
  const [movies, setmovies] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [debouncesearchterm, setdebouncesearchterm] = useState('')
  const [trending, settrending] = useState([]);

  useDebounce(() => setdebouncesearchterm(searchterm), 500, [searchterm])

  const fetchmovies = async (query = '') => {
    setisloading(true);
    seterrormsg('');
    try {
      const endpoint = query
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`
        : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, Api_Opitons);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        seterrormsg('No movies found.');
        setmovies([]);
        return;
      }
      setmovies(data.results || []);
      console.log(data);
      if (query && data.results.length > 0)
        try {
          await updatesearchcount(query, data.results[0]);
        } catch (err) {
          console.error("Error updating search count:", err);
        }

    }
    catch (error) {
      console.log(`Error fetching movies: ${error}`)
      seterrormsg('Error fetching movies. Please try again later');
    }
    finally {
      setisloading(false);
    }

  };
  const LoadTrendingMovies = async () => {
    try {
      const _movies_ = await trendingmovies();
      settrending(_movies_);
    } catch (error) {
      console.error(`Error fetching trending movies:${error}`)

    }
  }
  useEffect(() => { fetchmovies(debouncesearchterm); }
    , [debouncesearchterm])
  useEffect(() => { LoadTrendingMovies() }
    , [])
  return (

    <main>
      <div className="pattren" />
      <div className="wrapper">
        <header>

          <img src="Movies_React_app/hero.png" alt="Banner" />
          <h1>Find the Best <span className="text-gradient">Movies</span> on
            <span className="text-gradient"> NEUTRINO</span>
          </h1>
          <Search searchterm={searchterm} setsearchterm={setsearchterm} />
        </header>
        {trending.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trending.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title || 'Poster'} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all_movies">
          <h2 > All Movies </h2>

          {isloading ? (

            <Loader />

          ) : errormsg ? (<p className="text-red-500">{errormsg}</p>) : (
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {movies.map((movie) => (
                <Moviecard key={movie.id} movie={movie} />
              ))}

            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App