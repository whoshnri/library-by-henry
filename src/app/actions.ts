"use server";

import { ReviewType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  parseOptionalText,
  parseRating,
  parseText,
  reviewTypeOptions,
} from "@/lib/reviews";

function parseReviewType(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    throw new Error("Review type is required.");
  }

  const type = value.toUpperCase() as ReviewType;

  if (!reviewTypeOptions.includes(type)) {
    throw new Error("Invalid review type.");
  }

  return type;
}

function reviewPayload(formData: FormData) {
  return {
    type: parseReviewType(formData.get("type")),
    title: parseText(formData.get("title"), "Title"),
    imageUrl: parseOptionalText(formData.get("imageUrl")),
    rating: parseRating(formData.get("rating")),
    summary: parseText(formData.get("summary"), "Summary"),
    content: parseText(formData.get("content"), "Review reason"),
  };
}

export async function createReview(formData: FormData) {
  await prisma.review.create({
    data: reviewPayload(formData),
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateReview(reviewId: string, formData: FormData) {
  await prisma.review.update({
    where: { id: reviewId },
    data: reviewPayload(formData),
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/reviews/${reviewId}`);
}

export async function deleteReview(reviewId: string) {
  await prisma.review.delete({
    where: { id: reviewId },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function likeReview(reviewId: string) {
  await prisma.review.update({
    where: { id: reviewId },
    data: {
      likes: {
        increment: 1,
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/reviews/${reviewId}`);
}

export async function addComment(reviewId: string, formData: FormData) {
  const content = parseText(formData.get("content"), "Comment");

  await prisma.comment.create({
    data: {
      reviewId,
      author: parseOptionalText(formData.get("author")),
      content,
    },
  });

  revalidatePath(`/reviews/${reviewId}`);
  revalidatePath("/");
  revalidatePath("/admin");
}
