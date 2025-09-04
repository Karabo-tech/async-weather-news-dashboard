// src/promiseVersion.ts
import axios, { AxiosResponse } from 'axios';
import { WeatherData, NewsData } from './types';

const parseWeatherData = (data: any): WeatherData => ({
  temperature: data.current.temperature_2m,
  description: data.current.weathercode === 0 ? 'Clear' : 'Cloudy'
});

const parseNewsData = (data: any): NewsData[] => data.posts;

function fetchWeatherPromise(latitude: number, longitude: number): Promise<WeatherData> {
  return axios
    .get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`)
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