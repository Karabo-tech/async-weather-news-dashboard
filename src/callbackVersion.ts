// src/callbackVersion.ts
import axios, { AxiosResponse } from 'axios';
import { WeatherData, NewsData } from './types';
import * as dotenv from 'dotenv';

dotenv.config();
const API_KEY = '056eabac7ae706b64eb151e2a617bb1d';

// Parse OpenWeatherMap response
const parseWeatherData = (data: any): WeatherData => ({
  temperature: data.main.temp,
  description: data.weather[0].description
});

// Parse DummyJSON response
const parseNewsData = (data: any): NewsData[] => data.posts;

// Callback-based weather fetch
function fetchWeatherCallback(
  latitude: number,
  longitude: number,
  callback: (error: string | null, data?: WeatherData) => void
) {
  if (!API_KEY) {
    callback('Error: OpenWeatherMap API key is missing');
    return;
  }
  axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
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

// Main callback function
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

// Run callback version
displayDashboardCallback(52.52, 13.41); // Berlin coordinates