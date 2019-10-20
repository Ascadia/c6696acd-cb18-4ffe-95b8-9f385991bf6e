import requestPromise from "request-promise-native";

import configurations from "../config";

export const getCityByName = async (cityName: string) => {
  const options = {
    uri: `${configurations.openWeather.basePath}/weather?q=${cityName}&APPID=${configurations.openWeather.APPID}&units=metric`,
    json: true,
  };

  const response = await requestPromise(options);
  if (response.error !== undefined) {
    throw new Error(response);
  }

  return response;
};

export const getCityHistoryByName = async (cityName: string) => {
  const options = {
    uri: `${configurations.openWeather.basePath}/forecast?q=${cityName}&APPID=${configurations.openWeather.APPID}&units=metric`,
    json: true,
  };

  const response = await requestPromise(options);
  if (response.error !== undefined) {
    throw new Error(response);
  }

  return response;
};