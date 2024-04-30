type Address = {
  placeId: string;
  streetNumber?: string;
  countryCode?: string;
  country?: string;
  municipality?: string;
  freeformAddress?: string;
};

export type AutoCompleteDetailsResponse = Address[];
