import { describe } from "@jest/globals";
import { getAutoCompleteDetails } from "../src";
import { mockServer } from "./mock/setup-msw";
import { FetchError } from "../src/errors";
import { logger } from "../src/utils";

jest.mock("../src/utils", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

beforeAll(() => {
  mockServer.listen();
});

afterAll(() => {
  mockServer.close();
});

describe("Tomtom Places E2E Tests - MSW mocked Server", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAutoCompleteDetails - functionality", () => {
    it("returns a promise", () => {
      const res = getAutoCompleteDetails("valid");
      expect(res).toBeInstanceOf(Promise);
    });

    it("can fetch from the autocomplete api", async () => {
      const res = await getAutoCompleteDetails("valid");
      const firstRes = res[0];
      expect(firstRes).toHaveProperty("placeId");
      expect(firstRes).toHaveProperty("streetNumber");
      expect(firstRes).toHaveProperty("countryCode");
      expect(firstRes).toHaveProperty("country");
      expect(firstRes).toHaveProperty("freeformAddress");
      expect(firstRes).toHaveProperty("municipality");
    });

    it("when valid, response has all results", async () => {
      const res = await getAutoCompleteDetails("valid");
      expect(res.length).toEqual(10);
    });

    it("when empty, response has no result", async () => {
      const res = await getAutoCompleteDetails("empty");
      expect(res).toStrictEqual([]);
    });

    it("when breaking, throws apperror", async () => {
      await expect(
        async () => await getAutoCompleteDetails("breaking")
      ).rejects.toThrow(new FetchError("Failed to map tomtom api response!"));

      expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it("when clienterror, throws fetcherror", async () => {
      await expect(
        async () => await getAutoCompleteDetails("clienterror")
      ).rejects.toThrow(new FetchError("Failed to fetch from tomtom api!"));

      expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it("when servererror, throws fetcherror", async () => {
      await expect(
        async () => await getAutoCompleteDetails("fetcherror")
      ).rejects.toThrow(new FetchError("Failed to fetch from tomtom api!"));

      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAutoCompleteDetails - axios retry", () => {
    it("when clienterror, retry 0 times", async () => {
      await expect(
        async () => await getAutoCompleteDetails("clienterror")
      ).rejects.toThrow(new FetchError("Failed to fetch from tomtom api!"));

      expect(logger.warn).toHaveBeenCalledTimes(0);
    });

    it("when apperror, retry 2 times", async () => {
      await expect(
        async () => await getAutoCompleteDetails("servererror")
      ).rejects.toThrow(new FetchError("Failed to fetch from tomtom api!"));

      expect(logger.warn).toHaveBeenCalledTimes(2);
    });

    it("when servererror, retry 2 times", async () => {
      await expect(
        async () => await getAutoCompleteDetails("servererror")
      ).rejects.toThrow(new FetchError("Failed to fetch from tomtom api!"));

      expect(logger.warn).toHaveBeenCalledTimes(2);
    });
  });
});
