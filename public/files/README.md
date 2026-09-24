# Espresso UI Kit — Phase 1–2 starter

This is the design-token layer and the first batch of reusable primitives from
`espresso-frontend-implementation-plan.md` (§5, steps 1–2), built directly
from the Stitch export so real screens can be assembled on top of them.

## What's here

```
tailwind.config.js                 # merge into your existing config's theme.extend
src/styles/espresso-base.css       # fonts + base resets (@tailwind directives included)
src/components/ui/
  Button.tsx                       # primary / secondary / tertiary / danger
  Input.tsx                        # Input + FormField (label/error/hint wrapper)
  Badge.tsx                        # status/stock pill, 3 semantic tones
  Modal.tsx                        # confirm dialogs (cancel order, delete product)
  Toast.tsx                        # ToastProvider + useToast()
  Skeleton.tsx                     # ProductTileSkeleton / TableRowSkeleton / DetailSkeleton
  EmptyAndErrorStates.tsx          # EmptyState + ErrorState (401/403/404/500)
  ProductPrimitives.tsx            # QuantityStepper, RatingStars, PriceDisplay
src/components/product/
  ProductCard.tsx                  # merchandising tile (home + shop grid)
```

## Integration steps

1. **Tailwind config** — copy the `colors`, `borderRadius`, `spacing`, `maxWidth`,
   `fontFamily`, `fontSize`, `boxShadow`, and `backdropBlur` blocks into your
   project's own `tailwind.config.ts` under `theme.extend`. Don't replace your
   whole config — just merge these keys in.
2. **Fonts** — add the two `<link>` tags noted at the top of
   `espresso-base.css` to your `index.html`, or self-host Playfair Display /
   Plus Jakarta Sans / Material Symbols Outlined if you prefer not to hit
   Google Fonts at runtime.
3. **Global CSS** — import `espresso-base.css` once at your app root (it
   already contains the `@tailwind` directives, so it can replace your
   current global stylesheet if that's all it contains).
4. **Components** — drop the `src/components` folders into your client,
   adjusting the import paths to match your project's alias setup (`@/…` etc).
5. Everything here is typed with plain props — no API calls, no routing,
   no state management assumptions — so it plugs into whatever data layer
   your `client/` already uses.

## Still open (see the implementation plan, §3 and §6)

- **Brand name**: components above don't hardcode "Espresso" vs.
  "Café & Patisserie" anywhere — that only shows up in `Navbar`/`Footer`,
  which aren't built yet pending your call.
- **No payment-provider strings anywhere** in this kit, by design — the
  cancellation modal's "reversal method" and any checkout copy should be
  populated from whatever your order model actually stores.
- Copy passed into `EmptyState`/`ErrorState` in the examples is illustrative;
  swap in real product-voice copy per screen rather than reusing Stitch's
  placeholder lines verbatim.

## Next up (plan §5, steps 3–4)

Global layout (`Navbar`, `Footer`, routing shell, protected-route wrapper)
and then the Home → Shop → Product Detail pages, once the brand-name
question is settled and I can see the actual API contract your `client/`
talks to.
