import { http, HttpResponse } from "msw";
import {
  BREAKING_RESPONSE,
  EMPTY_RESPONSE,
  VALID_RESPONSE,
} from "./mock-responses";

export const handlers = [
  http.get("https://api.tomtom.com/search/2/search/:address", ({ params }) => {
    const { address } = params;

    switch (address) {
      case "valid.json":
        return HttpResponse.json(VALID_RESPONSE);
      case "empty.json":
        return HttpResponse.json(EMPTY_RESPONSE);
      case "breaking.json":
        return HttpResponse.json(BREAKING_RESPONSE);
      case "clienterror.json":
        return new HttpResponse(null, { status: 404 });
      default:
        return new HttpResponse(null, { status: 500 });
    }
  }),
];
