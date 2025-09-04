# Async Weather & News Dashboard

A Node.js + TypeScript project demonstrating asynchronous programming using callbacks, promises, and async/await to fetch weather data and news headlines.

## Features
- Fetches weather from Open-Meteo API.
- Fetches news headlines from DummyJSON Posts API.
- Implements three versions: Callbacks, Promises, and Async/Await.
- Uses `Promise.all` for parallel fetching and `Promise.race` for fastest response.

## Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Configure `tsconfig.json`.

## Usage
Run each version with:
```bash
npm run callback
npm run promise
npm run async