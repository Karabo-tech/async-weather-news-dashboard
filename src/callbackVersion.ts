// src/callbackVersion.ts
import axios, { AxiosResponse } from 'axios';
import { WeatherData, NewsData } from './types';

// Simulate weather data parsing
const parseWeatherData = (data: any): WeatherData => ({
  temperature: data.current.temperature_2m,
  description: data.current.weathercode === 0 ? 'Clear' : 'Cloudy'
});

// Simulate news data parsing
const parseNewsData = (data: any): NewsData[] => data.posts;

// Callback-based fetching
function fetchWeatherCallback(
  latitude: number,
  longitude: number,
  callback: (error: string | null, data?: WeatherData) => void
) {
  axios
    .get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`)
    .then((response: AxiosResponse) => {
      const weather = parseWeatherData(response.data);
      callback(null, weather);
    })
    .catch((error) => callback(`Weather fetch error: ${error.message}`));
}

function fetchNewsCallback(callback: (error: string | null, data?: NewsData[]) => void) {
  axios
    .get('https://dummyjson.com/posts?limit=3')
    .then((response: AxiosResponse) => {
      const news = parseNewsData(response.data);
      callback(null, news);
    })
    .catch((error) => callback(`News fetch error: ${error.message}`));
}

// Main callback function demonstrating callback hell
function displayDashboardCallback(latitude: number, longitude: number) {
  console.log('Callback Version:');
  fetchWeatherCallback(latitude, longitude, (weatherError, weatherData) => {
    if (weatherError) {
      console.error(weatherError);
      return;
    }
    fetchNewsCallback((newsError, newsData) => {
      if (newsError) {
        console.error(newsError);
        return;
      }
      console.log('Weather:', weatherData);
      console.log('News Headlines:');
      newsData?.forEach((news) => console.log(`- ${news.title}`));
    });
  });
}

// Run the callback version
displayDashboardCallback(52.52, 13.41); // Example: Berlin coordinates