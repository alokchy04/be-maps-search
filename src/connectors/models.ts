export type TomTomSummary = {
  query: string;
  numResults: number;
  offset: number;
  totalResults: number;
};

export type TomTomAddress = {
  streetNumber: string;
  streetName: string;
  municipalitySubdivision: string;
  municipality: string;
  countrySecondarySubdivision: string;
  countrySubdivision: string;
  countrySubdivisionName: string;
  countrySubdivisionCode: string;
  postalCode: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  localName: string;
};

export type TomTomResult = {
  type: string;
  id: string;
  score: number;
  address: TomTomAddress;
};

export type TomtomFuzzySearchResponse = {
  summary: TomTomSummary;
  results: TomTomResult[];
};
