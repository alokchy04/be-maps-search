import { Counter, Registry } from "prom-client";

export const register = new Registry();

export const successCounter = new Counter({
    name: "get_autocomplete_details_success_count",
    help: "Counts the number of success in get_autocomplete_details",
    registers: [register],
});

export const failureCounter = new Counter({
    name: "get_autocomplete_details_failure_count",
    help: "Counts the number of fail in get_autocomplete_details",
    registers: [register],
});