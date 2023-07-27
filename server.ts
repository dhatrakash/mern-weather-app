import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import cors from 'cors';
import { Weather } from './model/weather';

const app = express();
app.use(cors());

const port = 3000;

const mongoDB = 'mongodb+srv://aishwaryadhatrak:Aishu%4069696@cluster0.kfqs6ws.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

app.use(express.json());

let currentCity = '';

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (city) {
    currentCity = city as string;  // assert that city is a string
    const apiKey = 'e71c1740fa171b936f30f5a6659faf10';
    
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      const weatherData = response.data;

      const weatherReading = new Weather({
        location: weatherData.name,
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
      });

      await weatherReading.save();
      
      // Fetch all weather readings for the city and sort by time
      const allWeatherReadings = await Weather.find({ location: city }).sort({ time: 1 });
      res.send(allWeatherReadings);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.error(`City ${city} not found`);
        res.status(404).send({ message: `City ${city} not found` });
      } else {
        console.error("Error fetching weather data: ", error);
        res.status(500).send({ message: 'Error fetching weather data' });
      }
    }
  } else {
    const weather = await Weather.find().sort({ time: 1 });
    res.send(weather);
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Fetch weather data from OpenWeatherMap API every 1 minutes and save it to MongoDB
setInterval(async () => {
  const apiKey = 'e71c1740fa171b936f30f5a6659faf10';

  try {
    if (currentCity) {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}`);
      const weatherData = response.data;

      const weatherReading = new Weather({
        location: weatherData.name,
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
      });

      await weatherReading.save();
    }
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 404) {
      console.log('City not found');
      return;
    }

    console.error("Error fetching weather data: ", error);
  }
}, 60000); // 60000 ms is 1 minutes