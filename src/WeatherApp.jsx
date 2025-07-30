import React, { useState, useEffect } from "react";
import "./style.css";

const API_KEY = "be788f08cc468bedacc31979727822da";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState([]);
  const [current, setCurrent] = useState(null);

  const getWeatherDetails = async (cityName, lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const data = await res.json();
      const uniqueDays = [];
      const filteredForecast = data.list.filter((item) => {
        const date = new Date(item.dt_txt).getDate();
        if (!uniqueDays.includes(date)) return uniqueDays.push(date);
        return false;
      });
      setCity(cityName);
      setCurrent(filteredForecast[0]);
      setForecast(filteredForecast.slice(1));
    } catch (err) {
      alert("Error fetching weather forecast.");
    }
  };

  const getCityCoordinates = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.length === 0) return alert("City not found.");
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    } catch (err) {
      alert("Error fetching coordinates.");
    }
  };

  const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
          );
          const data = await res.json();
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        } catch {
          alert("Error getting location name.");
        }
      },
      (error) => {
        alert("Geolocation error or denied.");
      }
    );
  };

  const renderWeatherCard = (data, index) => (
    <li className="card" key={index}>
      <h3>({data.dt_txt.split(" ")[0]})</h3>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
        alt="weather-icon"
      />
      <h6>Temp: {(data.main.temp - 273.15).toFixed(2)}°C</h6>
      <h6>Wind: {data.wind.speed} M/S</h6>
      <h6>Humidity: {data.main.humidity}%</h6>
    </li>
  );

  return (
    <div>
      <h1>
        <u>Weather Forecast</u>
      </h1>
      <div className="container">
        <div className="weather-input">
          <h3>Enter a City Name</h3>
          <input
            type="text"
            placeholder="E.g., New York, London, Tokyo"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && getCityCoordinates()}
          />
          <button className="search-btn" onClick={getCityCoordinates}>
            Search
          </button>
          <div className="separator"></div>
          <button className="location-btn" onClick={getUserCoordinates}>
            Use Current Location
          </button>
        </div>

        <div className="weather-data">
          {current && (
            <div className="current-weather">
              <div className="details">
                <h2>
                  {city} ({current.dt_txt.split(" ")[0]})
                </h2>
                <h6>
                  Temperature: {(current.main.temp - 273.15).toFixed(2)}°C
                </h6>
                <h6>Wind: {current.wind.speed} M/S</h6>
                <h6>Humidity: {current.main.humidity}%</h6>
              </div>
              <div className="icon">
                <img
                  src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
                  alt="weather-icon"
                />
                <h6>{current.weather[0].description}</h6>
              </div>
            </div>
          )}

          {forecast.length > 0 && (
            <div className="days-forecast">
              <h2 style={{ color: "white" }}>5-Day Forecast</h2>
              <ul className="weather-cards">
                {forecast.map((day, index) => renderWeatherCard(day, index))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
