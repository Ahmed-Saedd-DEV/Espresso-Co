import { ReactNode } from 'react';
import { Button } from './Button';

interface StateShellProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

function StateShell({ icon, eyebrow, title, description, action, secondaryAction }: StateShellProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-card-border bg-white p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-roast">{icon}</div>
      <p className="text-label-caps uppercase text-caramel">{eyebrow}</p>
      <h3 className="text-headline-sm text-roast">{title}</h3>
      <p className="max-w-sm text-body-md text-on-surface-variant">{description}</p>
      <div className="mt-2 flex gap-3">
        {secondaryAction && (
          <Button variant="secondary" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
        {action && <Button onClick={action.onClick}>{action.label}</Button>}
      </div>
    </div>
  );
}

/** Empty cart / empty order history / empty product grid. Pass real copy per context — don't reuse Stitch's placeholder lines verbatim. */
export function EmptyState(props: Omit<StateShellProps, 'icon'> & { icon?: ReactNode }) {
  return <StateShell icon={props.icon ?? <span className="material-symbols-outlined">inventory_2</span>} {...props} />;
}

type ErrorCode = 401 | 403 | 404 | 500;

const errorCopy: Record<ErrorCode, { eyebrow: string; icon: string }> = {
  401: { eyebrow: 'Authentication required', icon: 'lock' },
  403: { eyebrow: 'Access restricted', icon: 'block' },
  404: { eyebrow: 'Not found', icon: 'search_off' },
  500: { eyebrow: 'Something went wrong', icon: 'error' },
};

/** Shared shell for the 4 HTTP error pages/panels from the global-ux-states screen. */
export function ErrorState({
  code,
  title,
  description,
  action,
}: {
  code: ErrorCode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  const meta = errorCopy[code];
  return (
    <StateShell
      icon={<span className="material-symbols-outlined">{meta.icon}</span>}
      eyebrow={`${meta.eyebrow} · ${code}`}
      title={title}
      description={description}
      action={action}
    />
  );
}
