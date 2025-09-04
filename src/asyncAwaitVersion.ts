// src/asyncAwaitVersion.ts
import axios, { AxiosResponse } from 'axios';
import { WeatherData, NewsData } from './types';
import * as dotenv from 'dotenv';

dotenv.config();
const API_KEY = '056eabac7ae706b64eb151e2a617bb1d';

const parseWeatherData = (data: any): WeatherData => ({
  temperature: data.main.temp,
  description: data.weather[0].description
});

const parseNewsData = (data: any): NewsData[] => data.posts;

async function fetchWeatherAsync(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is missing');
    }
    const response: AxiosResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    return parseWeatherData(response.data);
  } catch (error: any) {
    throw new Error(`Weather fetch error: ${error.message}`);
  }
}

async function fetchNewsAsync(): Promise<NewsData[]> {
  try {
    const response: AxiosResponse = await axios.get('https://dummyjson.com/posts?limit=3');
    return parseNewsData(response.data);
  } catch (error: any) {
    throw new Error(`News fetch error: ${error.message}`);
  }
}

async function displayDashboardAsync(latitude: number, longitude: number) {
  console.log('Async/Await Version:');
  try {
    const [weather, news] = await Promise.all([
      fetchWeatherAsync(latitude, longitude),
      fetchNewsAsync()
    ]);
    console.log('Weather:', weather);
    console.log('News Headlines:');
    news.forEach((item) => console.log(`- ${item.title}`));
  } catch (error: any) {
    console.error(error.message);
  }
}

// Run async/await version
displayDashboardAsync(52.52, 13.41);