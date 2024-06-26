import { getPlaceAutocomplete } from "./maps-api";
import { failureCounter, successCounter } from "./metrics";
import { AutoCompleteDetailsResponse } from "./models";
import { logger } from "./utils";

export async function getAutoCompleteDetails(
  address: string
): Promise<AutoCompleteDetailsResponse> {
  const apiKey = process.env.TOMTOM_API_KEY as string;

  return getPlaceAutocomplete(apiKey, address)
    .then((tomtomResponse) => {
      successCounter.inc();
      return tomtomResponse;
    })
    .catch((error) => {
      logger.error("Error while autocomplete details:", error);
      failureCounter.inc();
      // Todo: also want to notify error such as honeybadger
      throw error;
    });
}
