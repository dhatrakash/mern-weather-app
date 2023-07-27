// src/components/WeatherData.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

// Utility function to capitalize the first letter of a string
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

interface WeatherReading {
  time: string;
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const WeatherData = ({ city }: { city: string }) => {
  const [weatherData, setWeatherData] = useState<WeatherReading[]>([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
         // Convert the city parameter to camelCase
        const formattedCity = capitalizeFirstLetter(city);
        const response = await axios.get(`http://localhost:3000/weather?city=${formattedCity}`);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // If an error occurs, set weatherData to an empty array to show "No data"
        setWeatherData([]);
      }
    };

    // Fetch data immediately
    fetchWeatherData();
    // Then fetch data every 5 minutes
    const intervalId = setInterval(fetchWeatherData, 60000); // 300000 ms is 5 minutes

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [city]);

 // Check if weatherData is empty (no city found or error occurred)
 if (weatherData.length === 0) {
  return <div>No city found</div>;
}

  const temperatureData = [
    ['Time', 'Temperature'],
    ...weatherData.map(reading => [(new Date(reading.time)).toLocaleString(), reading.temperature - 273.15])
  ];
  
  const humidityData = [
    ['Time', 'Humidity'],
    ...weatherData.map(reading => [(new Date(reading.time)).toLocaleString(), reading.humidity])
  ];
  
  const windSpeedData = [
    ['Time', 'Wind Speed'],
    ...weatherData.map(reading => [(new Date(reading.time)).toLocaleString(), reading.windSpeed])
  ];

  const latestWeatherReading = weatherData[weatherData.length - 1];
  return (
  <div className="container">
    <h2 className="text-center my-4">{city}</h2>
    {latestWeatherReading ? (
      <>
        <div className="card mb-3">
          <div className="card-body">
            <p>Temperature: {(latestWeatherReading.temperature - 273.15).toFixed(2)} °C</p>
            <p>Humidity: {latestWeatherReading.humidity}%</p>
            <p>Wind Speed: {latestWeatherReading.windSpeed} m/s</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <Chart
              width={'100%'}
              height={'300px'}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={temperatureData}
              options={{
                title: 'Temperature Over Time',
                hAxis: { title: 'Time' },
                vAxis: { title: 'Temperature' },
              }}
            />
          </div>

          <div className="col-lg-4">
            <Chart
              width={'100%'}
              height={'300px'}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={humidityData}
              options={{
                title: 'Humidity Over Time',
                hAxis: { title: 'Time' },
                vAxis: { title: 'Humidity' },
              }}
            />
          </div>

          <div className="col-lg-4">
            <Chart
              width={'100%'}
              height={'300px'}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={windSpeedData}
              options={{
                title: 'Wind Speed Over Time',
                hAxis: { title: 'Time' },
                vAxis: { title: 'Wind Speed' },
              }}
            />
          </div>
        </div>
      </>
    ) : (
      <div>No data</div>
    )}
  </div>
);

};

export default WeatherData;
