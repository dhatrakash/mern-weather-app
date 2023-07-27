"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const weather_1 = require("./model/weather");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 3000;
const mongoDB = 'mongodb+srv://aishwaryadhatrak:Aishu%4069696@cluster0.kfqs6ws.mongodb.net/?retryWrites=true&w=majority';
mongoose_1.default.connect(mongoDB).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});
app.use(express_1.default.json());
let currentCity = '';
app.get('/weather', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const city = req.query.city;
    if (city) {
        currentCity = city; // assert that city is a string
        const apiKey = 'e71c1740fa171b936f30f5a6659faf10';
        try {
            const response = yield axios_1.default.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            const weatherData = response.data;
            const weatherReading = new weather_1.Weather({
                location: weatherData.name,
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
            });
            yield weatherReading.save();
            // Fetch all weather readings for the city and sort by time
            const allWeatherReadings = yield weather_1.Weather.find({ location: city }).sort({ time: 1 });
            res.send(allWeatherReadings);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                console.error(`City ${city} not found`);
                res.status(404).send({ message: `City ${city} not found` });
            }
            else {
                console.error("Error fetching weather data: ", error);
                res.status(500).send({ message: 'Error fetching weather data' });
            }
        }
    }
    else {
        const weather = yield weather_1.Weather.find().sort({ time: 1 });
        res.send(weather);
    }
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// Fetch weather data from OpenWeatherMap API every 5 minutes and save it to MongoDB
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = 'e71c1740fa171b936f30f5a6659faf10';
    try {
        if (currentCity) {
            const response = yield axios_1.default.get(`http://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}`);
            const weatherData = response.data;
            const weatherReading = new weather_1.Weather({
                location: weatherData.name,
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
            });
            yield weatherReading.save();
        }
    }
    catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('City not found');
            return;
        }
        console.error("Error fetching weather data: ", error);
    }
}), 60000); // 300000 ms is 5 minutes
