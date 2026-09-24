---
name: Espresso Reserve
colors:
  surface: '#fff8f5'
  surface-dim: '#e9d7ca'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e8'
  surface-container: '#fdebde'
  surface-container-high: '#f7e5d8'
  surface-container-highest: '#f1dfd2'
  on-surface: '#231a12'
  on-surface-variant: '#4e4540'
  inverse-surface: '#392e26'
  inverse-on-surface: '#ffeee2'
  outline: '#807570'
  outline-variant: '#d1c4be'
  surface-tint: '#695c55'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#231a14'
  on-primary-container: '#908179'
  inverse-primary: '#d5c3ba'
  secondary: '#5e5e5c'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdc'
  on-secondary-container: '#636361'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f1500'
  on-tertiary-container: '#ba7334'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f2dfd6'
  primary-fixed-dim: '#d5c3ba'
  on-primary-fixed: '#231a14'
  on-primary-fixed-variant: '#51443e'
  secondary-fixed: '#e4e2df'
  secondary-fixed-dim: '#c8c6c4'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#474745'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fff8f5'
  on-background: '#231a12'
  surface-variant: '#f1dfd2'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  title-product:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
  data-mono:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an editorial, tactile luxury aesthetic crafted for direct-to-consumer specialty coffee and artisanal confections. The system pairs the refined gravity of haute patisserie and third-wave roaster culture with the operational clarity required by both high-conversion consumer storefronts and data-intensive administrative tooling.

The visual narrative relies on warm ivory surfaces, deep roast charcoal tones, tactile hairline borders, and deliberate typographic tension between classical editorial serifs and functional, high-density sans-serifs. The emotional response is intentional, warm, and uncompromisingly high-end—evoking the sensory experience of a sunlit Milanese or Parisian espresso bar rather than a sterile tech platform.

## Colors

The palette is rooted in roast levels, warm parchment, and molten caramel accents:

- **Primary Roast & Canvas Dark (`#1C130E`, `#2B1D16`):** Used for commanding typography, primary interactive actions, high-contrast footers, and administrative structural framing.
- **Secondary Surfaces & Cream (`#FAF8F5`, `#F5F0EA`, `#EBE3D7`):** The primary canvas across consumer views and administrative shells, replacing cold sterile whites with tactile warmth.
- **Accent Tones (`#C27A3A`, `#9B5C28`, `#D4A373`):** Reserved for deliberate points of focus: add-to-cart confirmation states, checkout affordances, roast profiles, and curated badges.
- **Card Surfaces & Separation (`#FFFFFF`, `#E8DFD5`):** Pure white elevates product containers, checkout forms, and metric widgets above the warm base, bounded by subtle parchment borders.
- **Semantic Feedback:**
  - **Success / In-Stock / Fulfilled:** Sage Olive (`#4A6B53`) with muted parchment backing (`#EEF3EF`).
  - **Warning / Processing / Roasting:** Roasted Pecan Amber (`#C27A3A`) with warm cream backing (`#FAF2EA`).
  - **Error / Sold Out / Cancelled:** Muted Terracotta (`#A84236`) with soft clay backing (`#F8ECEB`).
- **Administrative Portal Canvas (`#F9F8F6`):** Provides a clean, paper-finish surface optimized for tables, ledger lines, and sustained operational clarity.

## Typography

The typography system operates on deliberate role segregation:

- **Display & Headings (Playfair Display):** Conveys heritage, origin stories, roast notes, and high-impact merchandising headers. Editorial headings utilize tight negative letter-spacing and italicized variants for tasting accents (e.g., *citrus blossom*, *dark cocoa*).
- **Body, UI & Administrative Data (Plus Jakarta Sans):** Selected for its clear geometric structure, open counters, and high legibility at dense inventory viewports. Used universally for product grids, cart summaries, nutrition specifications, and admin order tables.
- **Micro-Copy & Metadata:** Always set in `label-caps` with uppercase tracking (+0.08em) for roaster attributes (e.g., `WASHED PROCESS`, `ORIGIN: HUILA`, `BATCH #402`).

## Layout & Spacing

The layout model adapts between a wide-margin editorial storefront and a responsive, high-efficiency administrative canvas:

- **Storefront Canvas:** Implements a 12-column grid capped at a max-width of 1360px. Gutters are fixed to `1.5rem` (`24px`) with outer canvas margins expanding to `3rem` (`48px`) on desktop to provide generous negative space reminiscent of luxury print publication.
- **Admin Workspace:** Uses a fluid 12-column system pinned to a fixed `260px` operational sidebar. Content areas leverage a snugger `1.25rem` gutter with continuous surface framing.
- **Breakpoints:**
  - **Mobile (< 768px):** 4-column system, `1rem` gutters, `1.25rem` screen padding. Grids collapse into vertical stacks with horizontal edge-to-edge carousel options for packaging discovery.
  - **Tablet (768px - 1024px):** 8-column system, `1.25rem` gutters, `2rem` screen margins. 2-up product grids and condensed admin filters.
  - **Desktop (1024px+):** 12-column layout, full multi-column checkout flows, and 3-up to 4-up curated product displays.

## Elevation & Depth

Visual hierarchy rejects hyper-synthetic 3D drop shadows in favor of warm, low-opacity ambient layers and tactile hairline boundaries:

- **Surface Tiers:**
  - **Base Canvas:** `#FAF8F5` (Storefront) or `#F9F8F6` (Admin).
  - **Level 1 (Card & Module Deck):** `#FFFFFF` bounded by a 1px solid `#E8DFD5` border. No drop shadow in resting state.
  - **Level 2 (Hover & Active Product Tiles):** `#FFFFFF` elevated by an ultra-soft roast-tinted shadow: `0 10px 25px -5px rgba(28, 19, 14, 0.05), 0 4px 6px -2px rgba(28, 19, 14, 0.02)`. Border transitions to `#D4A373`.
  - **Level 3 (Cart Drawers, Popovers, Dropdowns):** `#FFFFFF` with `0 20px 30px -10px rgba(28, 19, 14, 0.12)` paired with a structural `#1C130E` 1px keyline on active boundaries.
  - **Level 4 (Modals & Toast Alerts):** Floating high-focus modules backed by an espresso scrim (`rgba(28, 19, 14, 0.5)` with `4px` background blur).
- **Hairline Framing:** Micro-borders (1px) are non-negotiable for table headers, metadata chips, and section dividers to preserve artisanal paper-like precision.

## Shapes

The design language balances organic warmth and architectural structure:

- **Roundedness Level 2 (`rounded` = 0.5rem / 8px):** The default radius for product cards, text inputs, segmented controllers, and content panels.
- **Large Surfaces (`rounded-lg` = 1rem / 16px):** Applied to promotional hero banners, modal dialogs, and subscription configuration modules.
- **Extra Large (`rounded-xl` = 1.5rem / 24px):** Restricted to checkout summary groupings and full-bleed image frames.
- **Pill Exception (Full Round):** Exclusively reserved for metadata badges, status chips, and quantity selectors to contrast against the architectural rectangular grid.

## Components

### Buttons
- **Primary Action (Add to Cart / Confirm Purchase):** `#1C130E` background, `#FAF8F5` text, subtle 0.5rem radius, 14px padding horizontal, 12px padding vertical. Hover state transitions to roasted pecan (`#2B1D16`) with an intentional micro-lift (`translate-y-[-1px]`).
- **Secondary Action (View Notes / Quick View):** Pure white canvas, 1px solid border in `#E8DFD5`, text `#1C130E`. On hover: surface tints to `#FAF8F5` with border deepening to `#9B5C28`.
- **Tertiary / Editorial Link:** Text-only in `#C27A3A` with an underlined hover state and trailing typographic arrow (`→`).

### Chips & Badges
- **Status Tags (Admin & Logistics):** Pill-shaped, height 24px, uppercase 11px tracked text (`label-caps`). 
  - *Fulfilled / Fresh Roast:* Background `#EEF3EF`, text `#4A6B53`.
  - *Awaiting Roast / In Transit:* Background `#FAF2EA`, text `#C27A3A`.
  - *Archived / Out of Stock:* Background `#F8ECEB`, text `#A84236`.
- **Flavor & Tasting Chips:** Background `#FAF8F5`, 1px border `#E8DFD5`, text `#6B5E54`.

### Input Fields & Controls
- **Text Inputs:** Height 44px, background `#FFFFFF`, border 1px solid `#E8DFD5`, radius 0.5rem. Active focus rings replace standard browser defaults with a 1px solid `#C27A3A` border and an ambient `0 0 0 3px rgba(194, 122, 58, 0.15)` glow.
- **Checkboxes & Radios:** 18px box, border `#9A8C82`, filling with `#1C130E` when selected. High-contrast white glyph center.

### Product & Data Cards
- **Merchandising Product Tile:** `#FFFFFF` background, 1px `#E8DFD5` border, padded image container with warm grey underlay (`#F5F0EA`) to give packaging photography depth. Includes tasting note subheadings in serif italic and persistent price display in bold sans.
- **Admin Metric & Data Cards:** Clean `#FFFFFF` fill, 16px inner padding, containing metric value (`28px Playfair Display`), delta indicator chip, and label in `label-caps`.

### Domain-Specific Components
- **Roast Spectrum Meter:** A 5-point segmented horizontal bar displaying roast intensity (Light to Dark French Roast) using `#EBE3D7` unselected segments and `#C27A3A` active fill.
- **Subscription Cadence Selector:** Segmented toggle card showing delivery frequency (Weekly, Bi-weekly, Monthly) with highlighted per-shipment savings badge in sage olive.