import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PriceDisplay, RatingStars } from '../ui/ProductPrimitives';

export interface Product {
  id: string;
  name: string;
  subtitle?: string; // tasting notes / short descriptor, serif italic per DESIGN.md
  category: string;
  price: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  eyebrowTag?: string; // e.g. "Light Roast", "Only 3 left" — top-left image chip
}

const stockCopy: Record<Product['stockStatus'], { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  in_stock: { label: 'In Stock', tone: 'success' },
  low_stock: { label: 'Low Stock', tone: 'warning' },
  out_of_stock: { label: 'Out of Stock', tone: 'danger' },
};

/**
 * Merchandising product tile: white card, hairline border, warm-grey image
 * underlay, serif-italic subtitle, persistent bold price, full-width CTA.
 * Level-2 hover elevation (shadow-roast-sm + border-card-hover) per DESIGN.md.
 */
export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
}) {
  const stock = stockCopy[product.stockStatus];
  const soldOut = product.stockStatus === 'out_of_stock';

  return (
    <div className="group flex flex-col rounded border border-card-border bg-white transition-all hover:-translate-y-0.5 hover:border-card-hover hover:shadow-roast-sm">
      <div className="relative aspect-square overflow-hidden rounded-t bg-cream-alt">
        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 flex gap-1.5">
          {product.eyebrowTag && <Badge tone="neutral">{product.eyebrowTag}</Badge>}
          <Badge tone={stock.tone}>{stock.label}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-label-caps uppercase text-on-surface-variant">{product.category}</p>
        <h3 className="text-title-product text-roast">{product.name}</h3>
        {product.subtitle && <p className="font-serif italic text-body-sm text-on-surface-variant">{product.subtitle}</p>}
        {typeof product.rating === 'number' && <RatingStars rating={product.rating} count={product.reviewCount} />}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <PriceDisplay amount={product.price} />
          <Button
            variant={soldOut ? 'secondary' : 'primary'}
            disabled={soldOut}
            onClick={() => onAddToCart(product)}
            icon={!soldOut && <span className="material-symbols-outlined text-base">shopping_bag</span>}
          >
            {soldOut ? 'Notify Me' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
