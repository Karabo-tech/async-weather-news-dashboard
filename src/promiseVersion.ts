// src/promiseVersion.ts
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

function fetchWeatherPromise(latitude: number, longitude: number): Promise<WeatherData> {
  if (!API_KEY) {
    return Promise.reject('Error: OpenWeatherMap API key is missing');
  }
  return axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    .then((response: AxiosResponse) => parseWeatherData(response.data))
    .catch((error) => Promise.reject(`Weather fetch error: ${error.message}`));
}

function fetchNewsPromise(): Promise<NewsData[]> {
  return axios
    .get('https://dummyjson.com/posts?limit=3')
    .then((response: AxiosResponse) => parseNewsData(response.data))
    .catch((error) => Promise.reject(`News fetch error: ${error.message}`));
}

// Promise chaining
function displayDashboardPromiseChain(latitude: number, longitude: number) {
  console.log('Promise Chain Version:');
  fetchWeatherPromise(latitude, longitude)
    .then((weather) => {
      console.log('Weather:', weather);
      return fetchNewsPromise();
    })
    .then((news) => {
      console.log('News Headlines:');
      news.forEach((item) => console.log(`- ${item.title}`));
    })
    .catch((error) => console.error(error));
}

// Promise.all
function displayDashboardPromiseAll(latitude: number, longitude: number) {
  console.log('Promise.all Version:');
  Promise.all([fetchWeatherPromise(latitude, longitude), fetchNewsPromise()])
    .then(([weather, news]) => {
      console.log('Weather:', weather);
      console.log('News Headlines:');
      news.forEach((item) => console.log(`- ${item.title}`));
    })
    .catch((error) => console.error(error));
}

// Promise.race
function displayDashboardPromiseRace(latitude: number, longitude: number) {
  console.log('Promise.race Version:');
  Promise.race([fetchWeatherPromise(latitude, longitude), fetchNewsPromise()])
    .then((result) => {
      console.log('Fastest Response:', result);
    })
    .catch((error) => console.error(error));
}

// Run all Promise versions
function runPromiseVersion() {
  displayDashboardPromiseChain(52.52, 13.41);
  displayDashboardPromiseAll(52.52, 13.41);
  displayDashboardPromiseRace(52.52, 13.41);
}

runPromiseVersion();