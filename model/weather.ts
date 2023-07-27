import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  time: { type: Date, default: Date.now }
});

export const Weather = mongoose.model('Weather', weatherSchema);
