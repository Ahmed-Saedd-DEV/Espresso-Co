import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

/**
 * Button variants per DESIGN.md "Components > Buttons":
 * - primary:   roast bg, cream text, lifts 1px + darkens on hover
 * - secondary: white bg, hairline border, border deepens to caramel on hover
 * - tertiary:  text-only caramel link, underline + trailing arrow on hover
 * - danger:    for destructive confirms (cancel order, delete product)
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded font-sans text-label-ui transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none';

const sizes: Record<Size, string> = {
  md: 'h-11 px-4',
  lg: 'h-12 px-6',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-roast text-cream hover:bg-roast-dark hover:-translate-y-px active:translate-y-0',
  secondary:
    'bg-white text-roast border border-card-border hover:bg-cream hover:border-caramel-deep',
  tertiary:
    'bg-transparent text-caramel px-0 h-auto hover:underline underline-offset-4 group',
  danger: 'bg-danger-text text-white hover:brightness-95',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variant === 'tertiary' ? '' : sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
        ) : (
          icon
        )}
        {children}
        {variant === 'tertiary' && (
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
