/** Pill-shaped quantity stepper used on product detail + cart rows. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(max ? Math.min(max, value + 1) : value + 1);
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-card-border bg-white">
      <button type="button" onClick={dec} aria-label="Decrease quantity" className="flex h-10 w-10 items-center justify-center text-roast">
        −
      </button>
      <span className="w-8 text-center text-label-ui text-roast">{value}</span>
      <button type="button" onClick={inc} aria-label="Increase quantity" className="flex h-10 w-10 items-center justify-center text-roast">
        +
      </button>
    </div>
  );
}

/** Star rating display (read-only) with a review-count label, as on shop/product-detail cards. */
export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1 text-body-sm text-on-surface-variant">
      <span aria-hidden className="text-caramel">
        {'★'.repeat(Math.floor(rounded))}
        {rounded % 1 !== 0 ? '½' : ''}
      </span>
      <span>{rating.toFixed(1)}</span>
      {typeof count === 'number' && <span>({count})</span>}
    </div>
  );
}

/** Bold sans price, with an optional strikethrough compare-at price (e.g. cancelled/refunded order rows). */
export function PriceDisplay({ amount, compareAt, currency = '$' }: { amount: number; compareAt?: number; currency?: string }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="text-title-product text-roast">
        {currency}
        {amount.toFixed(2)}
      </span>
      {typeof compareAt === 'number' && (
        <span className="text-body-sm text-on-surface-variant line-through">
          {currency}
          {compareAt.toFixed(2)}
        </span>
      )}
    </span>
  );
}
