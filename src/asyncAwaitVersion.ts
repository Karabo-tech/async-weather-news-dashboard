// src/asyncAwaitVersion.ts
import axios, { AxiosResponse } from 'axios';
import { WeatherData, NewsData } from './types';

const parseWeatherData = (data: any): WeatherData => ({
  temperature: data.current.temperature_2m,
  description: data.current.weathercode === 0 ? 'Clear' : 'Cloudy'
});

const parseNewsData = (data: any): NewsData[] => data.posts;

async function fetchWeatherAsync(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    const response: AxiosResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`
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