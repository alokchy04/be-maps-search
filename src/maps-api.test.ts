import { getTomtomFuzzySearchResponse } from "./connectors/tomtom-connector";
import { getPlaceAutocomplete } from "./maps-api";
import { AppError, FetchError } from "./errors";

jest.mock("./connectors/tomtom-connector", () => ({
  getTomtomFuzzySearchResponse: jest.fn(),
}));

const key = "test_key";
const address = "test_address";

describe("getPlaceAutocomplete", () => {
  const mockValidResponse = {
    summary: {
      query: "297 queen street",
      queryType: "NON_NEAR",
      queryTime: 40,
      numResults: 10,
      offset: 0,
      totalResults: 100,
      fuzzyLevel: 1,
      queryIntent: [],
    },
    results: [
      {
        type: "Point Address",
        id: "RRWJkuHSuDItEQhbRZxb3g",
        score: 6.3785104752,
        address: {
          streetNumber: "297",
          streetName: "Queen Street",
          municipalitySubdivision: "Concord West",
          municipality: "Sydney",
          countrySecondarySubdivision: "Sydney",
          countrySubdivision: "New South Wales",
          countrySubdivisionName: "New South Wales",
          countrySubdivisionCode: "NSW",
          postalCode: "2138",
          countryCode: "AU",
          country: "Australia",
          countryCodeISO3: "AUS",
          freeformAddress:
            "297 Queen Street, Concord West, New South Wales, 2138",
          localName: "Concord West",
        },
        position: {
          lat: -33.844132,
          lon: 151.086392,
        },
        viewport: {
          topLeftPoint: {
            lat: -33.84323,
            lon: 151.08531,
          },
          btmRightPoint: {
            lat: -33.84503,
            lon: 151.08747,
          },
        },
        entryPoints: [
          {
            type: "main",
            position: {
              lat: -33.84415,
              lon: 151.08608,
            },
          },
        ],
      },
      {
        type: "Point Address",
        id: "yO5pmQM6gdwXt4IdJyQyXQ",
        score: 6.3785104752,
        address: {
          streetNumber: "297",
          streetName: "Queen Street",
          municipalitySubdivision: "Campbelltown",
          municipality: "Sydney",
          countrySecondarySubdivision: "Sydney",
          countrySubdivision: "New South Wales",
          countrySubdivisionName: "New South Wales",
          countrySubdivisionCode: "NSW",
          postalCode: "2560",
          countryCode: "AU",
          country: "Australia",
          countryCodeISO3: "AUS",
          freeformAddress:
            "297 Queen Street, Campbelltown, New South Wales, 2560",
          localName: "Campbelltown",
        },
        position: {
          lat: -34.069745,
          lon: 150.811095,
        },
        viewport: {
          topLeftPoint: {
            lat: -34.06885,
            lon: 150.81001,
          },
          btmRightPoint: {
            lat: -34.07064,
            lon: 150.81218,
          },
        },
        entryPoints: [
          {
            type: "main",
            position: {
              lat: -34.06993,
              lon: 150.81134,
            },
          },
        ],
      },
    ],
  };

  const mockValidEmptyResponse = {
    summary: {
      query: "dwcwvwvwv",
      queryType: "NON_NEAR",
      queryTime: 16,
      numResults: 0,
      offset: 0,
      totalResults: 0,
      fuzzyLevel: 2,
      queryIntent: [],
    },
    results: [],
  };

  const mockFaultyResponse = {};

  const mockFaultyResponseNoAddress = {
    summary: {
      query: address,
      numResults: 1,
      offset: 0,
      totalResults: 1,
    },
    results: [
      {
        type: "test_type",
        id: "test_id",
        score: 1,
      },
    ],
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should handle a successful expected response", async () => {
    (getTomtomFuzzySearchResponse as jest.Mock).mockResolvedValue(
      mockValidResponse
    );

    const response = await getPlaceAutocomplete(key, address);
    expect(response.length).toEqual(2);
    expect(response).toEqual([
      {
        countryCode: "AU",
        country: "Australia",
        freeformAddress:
          "297 Queen Street, Concord West, New South Wales, 2138",
        municipality: "Sydney",
        placeId: "RRWJkuHSuDItEQhbRZxb3g",
        streetNumber: "297",
      },
      {
        country: "Australia",
        countryCode: "AU",
        freeformAddress:
          "297 Queen Street, Campbelltown, New South Wales, 2560",
        municipality: "Sydney",
        placeId: "yO5pmQM6gdwXt4IdJyQyXQ",
        streetNumber: "297",
      },
    ]);
  });

  it("should handle a successful empty response", async () => {
    (getTomtomFuzzySearchResponse as jest.Mock).mockResolvedValue(
      mockValidEmptyResponse
    );

    const response = await getPlaceAutocomplete(key, address);
    expect(response.length).toEqual(0);
    expect(response).toEqual([]);
  });

  it("should remove null address during mapping", async () => {
    (getTomtomFuzzySearchResponse as jest.Mock).mockResolvedValue(
      mockFaultyResponseNoAddress
    );

    const response = await getPlaceAutocomplete(key, address);
    expect(response.length).toEqual(0);
    expect(response).toEqual([]);
  });

  it("should throw AppError when can not map", async () => {
    (getTomtomFuzzySearchResponse as jest.Mock).mockResolvedValue(
      mockFaultyResponse
    );

    await expect(async () =>
      getPlaceAutocomplete(key, address)
    ).rejects.toThrow(new AppError("Failed to map tomtom api response!"));
  });

  it("should throw error when FetchError from the connector", async () => {
    (getTomtomFuzzySearchResponse as jest.Mock).mockRejectedValue(
      new FetchError("Failed to fetch from tomtom api!")
    );

    await expect(async () =>
      getPlaceAutocomplete(key, address)
    ).rejects.toThrow(new FetchError("Failed to fetch from tomtom api!"));
  });
});
