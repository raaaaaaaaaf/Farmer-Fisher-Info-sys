import React, { useState } from "react";
import Search from "../components/search/Search";
import Weather from "../components/weather/Weather";
import { API_URL, API_KEY } from "../components/weather/api";
import Forecast from "../components/forecast/Forecast";

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const handleOnSearchChange = async (searchData) => {
    try {
      const [lat, lon] = searchData.value.split(" ");
      const weatherFetch = await fetch(
        `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const forecastFetch = await fetch(
        `${API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      Promise.all([weatherFetch, forecastFetch]).then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      });
    } catch (err) {
      console.error(err);
    }
  };
  console.log(weather);
  console.log(forecast);
  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {weather && <Weather data={weather} />}
      {forecast && <Forecast data={forecast}/>}
    </div>
  );
};

export default WeatherApp;
