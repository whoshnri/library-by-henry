type StarRatingProps = {
  rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span aria-label={`${safeRating} out of 5 stars`} className="text-amber-500">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < safeRating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}
