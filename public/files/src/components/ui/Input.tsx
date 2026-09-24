import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  endIcon?: ReactNode;
}

/** Text input: 44px height, white bg, hairline border, caramel focus ring (DESIGN.md > Input Fields & Controls). */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, endIcon, className = '', ...props }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        className={`h-11 w-full rounded border bg-white px-3 font-sans text-body-md text-roast placeholder:text-on-surface-variant ${
          error ? 'border-danger-text' : 'border-card-border'
        } ${endIcon ? 'pr-10' : ''} ${className}`}
        {...props}
      />
      {endIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">{endIcon}</span>}
    </div>
  )
);
Input.displayName = 'Input';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}

/** Label + control + error message, matching the auth/checkout/account form spacing. */
export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-label-ui text-roast">
          {label}
        </label>
        {hint}
      </div>
      {children}
      {error && <p className="text-body-sm text-danger-text">{error}</p>}
    </div>
  );
}
