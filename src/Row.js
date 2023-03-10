import axios from './axios';
import React, { useState , useEffect } from 'react'
import './Row.css'
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

function Row({ title, fetchUrl, isLargeRow = false }) {
    const [movies, setMovies] = useState([]);
    const base_url = "https://image.tmdb.org/t/p/original/";
    const [trailerUrl, setTrailerUrl] = useState("");
    const [description, setDescription] = useState('');
    const [Title, setTitle] = useState('');
    const [rating, setRating] = useState('')

    
    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl])
    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
    };
    
    const handleClick = (movie) => {
        if (trailerUrl){
            setTrailerUrl('');
            setTitle('');
            setDescription('');
            setRating('');
        } else {
            movieTrailer(movie?.name || "" || movie?.title || movie?.original_name || movie?.original_title)
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));

                setDescription(movie?.overview);
                setTitle(movie?.name || movie?.title);
                setRating(movie?.vote_average)
            }).catch((error) => console.log(error.message))
        }
    }
  return (
    <div className='row'>
        <h2>{title}</h2>
        <div className="row__posters">
            {movies.map((movie) => 
                ((isLargeRow && movie.poster_path) ||
                (!isLargeRow && movie.backdrop_path)) &&(
                    <img 
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        src={`${base_url}${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        }`} alt={movie.name} 
                        />
                    )
                )}
                
        </div>
        {trailerUrl &&<YouTube videoId={trailerUrl} opts={opts} style = {{
            width: "50%",
            height: "50%",
            margin: "auto",
        }} /> }
        <div className="info__overlay--text">
            <h1>{Title}</h1>
            <h2>{rating}</h2>
        </div>
        <div className="paragraph">
            <p>{description}</p>
        </div>
        
    </div>
  )
}

export default Row