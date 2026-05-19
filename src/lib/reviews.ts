import { ReviewType } from "@prisma/client";

export const reviewTypeOptions: ReviewType[] = ["BOOK", "ARTICLE", "SUBSTACK"];

export function reviewTypeLabel(type: ReviewType) {
  switch (type) {
    case "BOOK":
      return "Book";
    case "ARTICLE":
      return "Article";
    case "SUBSTACK":
      return "Substack";
    default:
      return type;
  }
}

export function parseRating(value: FormDataEntryValue | null) {
  const rating = Number(value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer from 1 to 5.");
  }

  return rating;
}

export function parseText(value: FormDataEntryValue | null, field: string) {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text) {
    throw new Error(`${field} is required.`);
  }

  return text;
}

export function parseOptionalText(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || null;
}
