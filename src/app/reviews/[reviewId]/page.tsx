import { notFound } from "next/navigation";
import { addComment, likeReview } from "@/app/actions";
import { StarRating } from "@/components/star-rating";
import { prisma } from "@/lib/prisma";
import { reviewTypeLabel } from "@/lib/reviews";

type ReviewDetailsPageProps = {
  params: Promise<{
    reviewId: string;
  }>;
};

export default async function ReviewDetailsPage({ params }: ReviewDetailsPageProps) {
  const { reviewId } = await params;

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!review) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50">
        <div
          className="h-64 w-full bg-cover bg-center"
          style={{
            backgroundImage: review.imageUrl
              ? `linear-gradient(rgba(0,0,0,.12), rgba(0,0,0,.5)), url(${review.imageUrl})`
              : "linear-gradient(120deg, #27272a, #18181b)",
          }}
        />
        <div className="space-y-4 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            {reviewTypeLabel(review.type)}
          </p>
          <h2 className="text-3xl font-semibold">{review.title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
            <StarRating rating={review.rating} />
            <span>{review.likes} likes</span>
            <span>Posted {new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-zinc-200">{review.summary}</p>
          <p className="whitespace-pre-wrap leading-7 text-zinc-300">{review.content}</p>
          <form action={likeReview.bind(null, review.id)}>
            <button
              type="submit"
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium"
            >
              Like review
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-7">
        <h3 className="text-xl font-semibold">Comments</h3>

        <form action={addComment.bind(null, review.id)} className="mt-5 space-y-3">
          <input
            name="author"
            placeholder="Your name (optional)"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm outline-none"
          />
          <textarea
            name="content"
            required
            placeholder="Leave your thoughts"
            className="min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950"
          >
            Add comment
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {review.comments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">
              No comments yet. Be the first to respond.
            </p>
          ) : (
            review.comments.map((comment) => (
              <article key={comment.id} className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm font-medium text-zinc-100">
                  {comment.author || "Anonymous"}
                </p>
                <p className="mt-1 text-sm text-zinc-300">{comment.content}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
