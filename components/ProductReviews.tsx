type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

type ProductReviewsProps = {
  reviews: Review[];
};

export default function ProductReviews({
  reviews,
}: ProductReviewsProps) {
  return (
    <section className="detail-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Buyer notes</p>
          <h2>Customer reviews</h2>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>No reviews yet.</p>
          <span>The first owner notes will appear here.</span>
        </div>
      ) : (
        <div className="stack-list">
          {reviews.map((review) => (
            <article key={review.id} className="surface-card">
              <div className="split-row">
                <h3>{review.user}</h3>
                <span className="muted">{review.date}</span>
              </div>
              <p className="metric-line">Rating: {review.rating}/5</p>
              <p className="muted">{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
