import React, { useState, useEffect } from 'react'
import './Banner.css'
import axios from "./axios"
import requests from './Requests';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

function Banner() {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("")

  useEffect(() => {
    async function fetchData(){
      const request = await axios.get(requests.fetchNetflixOriginals)
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
};
  console.log(movie);
  
  function truncate(string, n){
      return string?.length > n ? string.substr(0, n-1) + '...' : string;
  }
  const handleClick = (movie) => {
    if (trailerUrl){
        setTrailerUrl('');
    } else {
        movieTrailer(movie?.name || "" || movie?.title || movie?.original_name || movie?.original_title)
        .then((url) => {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get('v'));
        }).catch((error) => console.log(error.message))
    }
}

  return (
    <header
    className="banner"
    style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
    }}
    >
        <div className="banner__contents">
            <h1 className="banner__title">{movie?.title || movie?.name || movie?.original_name}</h1>
            <div className="banner__buttons">
              <button className='banner__button' onClick={() => handleClick(movie)}>Play</button>
              <button className='banner__button'>My List</button>
            </div>
            <h1 className="banner__description">
              {truncate(movie?.overview, 150)}
            </h1>
        </div>
        {trailerUrl &&<YouTube videoId={trailerUrl} opts={opts} /> }
        <div className="banner__fadeBottom" />
        
    </header>
  )
}

export default Banner