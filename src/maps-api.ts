import { TomtomFuzzySearchResponse } from "./connectors/models";
import { getTomtomFuzzySearchResponse } from "./connectors/tomtom-connector";
import { AppError } from "./errors";
import { AutoCompleteDetailsResponse } from "./models";

export async function getPlaceAutocomplete(
  key: string,
  address: string
): Promise<AutoCompleteDetailsResponse> {
  return getTomtomFuzzySearchResponse(key, address).then((response) => {
    return mapResponse(response);
  });
}

function mapResponse(
  autocompleteResponse: TomtomFuzzySearchResponse
): AutoCompleteDetailsResponse {
  try {
    return autocompleteResponse.results
      .filter((result) => result.address)
      .map((result) => {
        return {
          placeId: result.id,
          streetNumber: result.address.streetNumber,
          countryCode: result.address.countryCode,
          country: result.address.country,
          municipality: result.address.municipality,
          freeformAddress: result.address.freeformAddress,
        };
      });
  } catch (error) {
    throw new AppError("Failed to map tomtom api response!", error as Error);
  }
}
