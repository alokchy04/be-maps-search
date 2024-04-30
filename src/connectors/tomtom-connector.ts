import axios from "axios";
import axiosRetry from "axios-retry";
import { FetchError } from "../errors";
import { logger } from "../utils";
import { TomtomFuzzySearchResponse } from "./models";

const tomtomAxios = axios.create({
  baseURL: "https://api.tomtom.com/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosRetry(tomtomAxios, {
  retries: 5,
  retryDelay: (retryCount) => Math.min(2 ** retryCount * 1000, 2000),
  retryCondition: (error) => error.response?.status === 500,
  onRetry: (attempt, error) =>
    logger.warn(`Retry attempt ${attempt + 1}: Error - ${error.message}`),
});

export async function getTomtomFuzzySearchResponse(
  key: string,
  address: string,
  countriesToInclude: string[] = ["AU"]
): Promise<TomtomFuzzySearchResponse> {
  return tomtomAxios
    .get<TomtomFuzzySearchResponse>(
      `search/2/search/${encodeURIComponent(address)}.json`,
      {
        params: {
          key,
          countrySet: countriesToInclude.join(","),
          limit: 100,
        },
        timeout: 10000,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new FetchError("Failed to fetch from tomtom api!", error);
    });
}
