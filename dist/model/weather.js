"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const weatherSchema = new mongoose_1.default.Schema({
    location: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    time: { type: Date, default: Date.now }
});
exports.Weather = mongoose_1.default.model('Weather', weatherSchema);
