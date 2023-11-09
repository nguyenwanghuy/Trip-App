import React, {useEffect,useState} from 'react'
import axios from 'axios'
import moment from 'moment';
import '../assets/weather.css'

const API_KEY = 'c86f10718fc34c3283b8ba3531ecf461';
const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [search, setSearch] = useState('hanoi')
    useEffect(() => {
      const weatherSource = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}`
          );
          setWeather(response.data);
        } catch (error) {
          console.log(error, 'weather not available');
          setWeather(null)
        }
      };
    
      weatherSource();
    }, [search]);
    useEffect(() => {
      const fetchCurrentTime = () => {
        const vietnamTime =  moment().format('DD/MM/YYYY HH:mm'); 
        setCurrentTime(vietnamTime);
      };
      fetchCurrentTime();
    }, []);
    const handleSearch = (e) => {
     if(e.code === 'Enter') {
      setSearch(e.target.value);
      e.target.value = '';
      e.target.focus();
     }
    };
 let weatherClass = 'weather-hot';
 if (weather && weather.main.temp - 273.15 >= 31) {
    weatherClass = 'weather-warm';
  } else if (weather && weather.main.temp - 273.15 < 25) {
    weatherClass = 'weather-cold';
  } else if (weather && weather.main.temp - 273.15 <= 28) {
    weatherClass = 'weather-cloud';
  } 

  return (
    <div className={`weather ${weatherClass}`}>
      <input placeholder='' type='text' className='search' onKeyDown={handleSearch}/>
      {weather? (
        <div className='content'>
        <h1 className='capital'>
            <span className="city">{weather.name}</span>
            <span>,</span>
            <span className="country">{weather.sys.country}</span>
        </h1>
        <div className="time">{currentTime}</div>
        <div className="temperture">
          <span className='value'>{Math.round(weather.main.temp - 273.15)}<sup>o</sup>C</span>
          
        </div>
        <div className="short-desc">{weather.weather[0].main}</div>
        <div className="more-desc">
          <div className="visibility">
          <i className="fa-regular fa-eye"></i>
            <span>{weather.visibility}m</span>
          </div>
          <div className="wind">
          <i className="fa-solid fa-wind"></i>
            <span>{weather.wind.speed}m/s</span>
          </div>
          <div className="sun">
          <i className="fa-solid fa-cloud-sun"></i>
            <span>{weather.main.humidity}%</span>
          </div>
        </div>
      </div>
      ):(
        <div className='hide'>
          <p>Không có dữ liệu ....</p>
        </div>
      )}
    </div>
  )
}

export default Weather