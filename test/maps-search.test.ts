import { config } from "dotenv";
import { describe } from "@jest/globals";
import { getPlaceAutocomplete } from "../src/maps-api";
import { getAutoCompleteDetails } from "../src";
import { FetchError } from "../src/errors";

config({ path: ".env.test" });

// These are end-to-end tests and need an api key
describe("Tomtom Places E2E Tests", () => {
    describe("getAutoCompleteDetails", () => {
        it("returns a promise", () => {
            const res = getAutoCompleteDetails("Charlotte Street");
            expect(res).toBeInstanceOf(Promise);
        });

        it("can fetch from the autocomplete api", async () => {
            const res = await getAutoCompleteDetails("Charlotte Street");
            const firstRes = res[0];
            expect(firstRes).toHaveProperty("placeId");
            expect(firstRes).toHaveProperty("streetNumber");
            expect(firstRes).toHaveProperty("countryCode");
            expect(firstRes).toHaveProperty("country");
            expect(firstRes).toHaveProperty("freeformAddress");
            expect(firstRes).toHaveProperty("municipality");
        });

        it("can fetch response with all results when it has results", async () => {
            const res = await getAutoCompleteDetails("297 queen street");
            expect(res.length).toEqual(100);
            expect(res[0]).toEqual({ "country": "Australia", "countryCode": "AU", "freeformAddress": "297 Queen Street, Campbelltown, New South Wales, 2560", "municipality": "Sydney", "placeId": "yO5pmQM6gdwXt4IdJyQyXQ", "streetNumber": "297" });
        });

        it("can fetch response when has no result", async () => {
            const res = await getAutoCompleteDetails("asfasffasfasafsafs");
            expect(res).toStrictEqual([]);
        });

        it("handles clienterror", async () => {
            await expect(
                async () => await getAutoCompleteDetails("")
            ).rejects.toThrow(new FetchError("Failed to fetch from tomtom api!"));
        });
    });

    describe("getPlaceAutocomplete", () => {
        it("handles no results", async () => {
            const res = await getPlaceAutocomplete(
                process.env.TOMTOM_API_KEY as string,
                "asfasffasfasafsafs"
            );
            expect(res).toStrictEqual([]);
        });

        it("handles error", async () => {
            expect(
                getPlaceAutocomplete(process.env.TOMTOM_API_KEY as string, "")
            ).rejects.toThrow();
        });
    });
});
