import { getAutoCompleteDetails } from ".";
import { getPlaceAutocomplete } from "./maps-api";
import { failureCounter, successCounter } from "./metrics";
import { logger } from "./utils";


jest.mock("./maps-api", () => ({
    getPlaceAutocomplete: jest.fn(),
}));

jest.mock("./metrics", () => ({
    successCounter: {
        inc: jest.fn(),
    },
    failureCounter: {
        inc: jest.fn(),
    },
}));

jest.mock("./utils", () => ({
    logger: {
        error: jest.fn(),
    },
}));

describe("getAutoCompleteDetails", () => {
    const address = "test_address";
    const apiKey = "test_key";

    beforeAll(() => {
        process.env.TOMTOM_API_KEY = apiKey;
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should increment successCounter on success", async () => {
        (getPlaceAutocomplete as jest.Mock).mockResolvedValue({});

        const response = await getAutoCompleteDetails(address);

        expect(response).toEqual({});
        expect(getPlaceAutocomplete).toHaveBeenCalledWith(apiKey, address);
        expect(successCounter.inc).toHaveBeenCalled();
    });

    it("should increment failureCounter and log error on failure", async () => {
        (getPlaceAutocomplete as jest.Mock).mockRejectedValue(new Error("Network Error"));

        await expect(getAutoCompleteDetails(address)).rejects.toThrow("Network Error");

        expect(failureCounter.inc).toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith("Error while autocomplete details:", expect.anything());
    });
});
