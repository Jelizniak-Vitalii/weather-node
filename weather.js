#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { printError, printHelp, printSuccess, printWeather } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY } from './services/storage.service.js';
import { getIcon, getWeather } from './services/api.service.js';

const saveToken = async (token) => {
  if (!token.length) {
    printError('не передан token');
    return;
  }

  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess('Token saved');
  } catch (e) {
    printError(e.message);
  }
};

const saveCity = async (city) => {
  if (!city.length) {
    printError('не передан city');
    return;
  }

  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city);
    printSuccess('City saved');
  } catch (e) {
    printError(e.message);
  }
};

const getForcast = async () => {
  try {
    const weather = await getWeather(process.env.CITY ?? 'kiev');
    printWeather(weather, getIcon(weather.weather[0].icon));
  } catch (e) {
    if (e?.response.status === 404) {
      printError('Неверно указан город');
    } else if (e?.response.status === 401) {
      printError('Неверно указан token');
    } else {
      printError(e.message);
    }
  }
};

const initCLI = () => {
  const args = getArgs(process.argv);

  if (args.h) {
    printHelp();
  }

  if (args.t) {
    saveToken(args.t)
  }

  if (args.s) {
    saveCity(args.s);

  }

  getForcast();
};

initCLI();
