import Link from "next/link";
import { StarRating } from "@/components/star-rating";
import { prisma } from "@/lib/prisma";
import { reviewTypeLabel } from "@/lib/reviews";

export default async function Home() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  if (reviews.length === 0) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">No reviews yet</p>
        <h2 className="mt-3 text-2xl font-semibold">The library is empty for now.</h2>
        <p className="mt-3 text-zinc-300">
          Add your first review in the admin CRM to publish books, articles, and
          substack notes.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-full bg-zinc-100 px-5 py-2 font-medium text-zinc-950"
        >
          Add first review
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/reviews/${review.id}`}
          className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 transition hover:border-zinc-600"
        >
          <div
            className="h-44 w-full bg-cover bg-center"
            style={{
              backgroundImage: review.imageUrl
                ? `linear-gradient(rgba(0,0,0,.18), rgba(0,0,0,.55)), url(${review.imageUrl})`
                : "linear-gradient(120deg, #27272a, #18181b)",
            }}
          />
          <div className="space-y-3 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              {reviewTypeLabel(review.type)}
            </p>
            <h2 className="text-xl font-semibold leading-tight group-hover:text-white">
              {review.title}
            </h2>
            <div className="flex items-center justify-between text-sm text-zinc-300">
              <StarRating rating={review.rating} />
              <span>{review.likes} likes</span>
            </div>
            <p className="line-clamp-3 text-sm text-zinc-300">{review.summary}</p>
            <p className="text-xs text-zinc-400">{review._count.comments} comments</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
