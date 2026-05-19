import { createReview, deleteReview, updateReview } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { reviewTypeLabel, reviewTypeOptions } from "@/lib/reviews";

function ReviewFormFields({
  defaultValues,
}: {
  defaultValues?: {
    type: string;
    title: string;
    imageUrl: string;
    rating: number;
    summary: string;
    content: string;
  };
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-zinc-400">Type</span>
          <select
            name="type"
            defaultValue={defaultValues?.type ?? "BOOK"}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
          >
            {reviewTypeOptions.map((type) => (
              <option key={type} value={type}>
                {reviewTypeLabel(type)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-zinc-400">Rating</span>
          <input
            type="number"
            min={1}
            max={5}
            required
            name="rating"
            defaultValue={defaultValues?.rating ?? 5}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
          />
        </label>
      </div>

      <label className="space-y-1 text-sm">
        <span className="text-zinc-400">Title</span>
        <input
          required
          name="title"
          defaultValue={defaultValues?.title}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-zinc-400">Image URL</span>
        <input
          name="imageUrl"
          defaultValue={defaultValues?.imageUrl}
          placeholder="https://..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-zinc-400">Card summary</span>
        <textarea
          required
          name="summary"
          defaultValue={defaultValues?.summary}
          className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-zinc-400">Detailed review (why this rating)</span>
        <textarea
          required
          name="content"
          defaultValue={defaultValues?.content}
          className="min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>
    </>
  );
}

export default async function AdminPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-7">
        <h2 className="text-2xl font-semibold">Library CRM</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Create and manage review entries for books, articles, and substack posts.
        </p>

        <form action={createReview} className="mt-6 space-y-3">
          <ReviewFormFields />
          <button
            type="submit"
            className="rounded-full bg-zinc-100 px-5 py-2 font-semibold text-zinc-950"
          >
            Create review
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-700 p-6 text-sm text-zinc-400">
            No records yet. Add your first review above.
          </div>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                <p className="text-zinc-300">
                  {reviewTypeLabel(review.type)} · {review._count.comments} comments · {" "}
                  {review.likes} likes
                </p>
                <p className="text-zinc-500">
                  Created {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              <form action={updateReview.bind(null, review.id)} className="space-y-3">
                <ReviewFormFields
                  defaultValues={{
                    type: review.type,
                    title: review.title,
                    imageUrl: review.imageUrl ?? "",
                    rating: review.rating,
                    summary: review.summary,
                    content: review.content,
                  }}
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-full border border-zinc-700 px-4 py-2 text-sm"
                  >
                    Save changes
                  </button>
                </div>
              </form>

              <form action={deleteReview.bind(null, review.id)} className="mt-3">
                <button
                  type="submit"
                  className="rounded-full border border-red-700 px-4 py-2 text-sm text-red-300"
                >
                  Delete review
                </button>
              </form>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
