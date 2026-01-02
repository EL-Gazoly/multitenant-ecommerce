import {
  parseAsString,
  createLoader,
  parseAsArrayOf,
  parseAsStringLiteral,
} from "nuqs/server";

export const sortVAlues = ["curated", "trending", "hot_and_new"] as const;

export const params = {
  sort: parseAsStringLiteral(sortVAlues).withDefault("curated"),
  minPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  maxPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault([]),
};

export const loadProductFilter = createLoader(params);
