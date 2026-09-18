# Desa Klepu UMKM Investment Showcase

## Goal
Rework the current Lapak into a modern, welcoming investment showcase using the selected **Clay 3D Lapak** direction. Keep Desa Klepu’s green identity while making each UMKM’s opportunity, readiness, and indicative funding needs easy to understand.

## Pages and navigation
- Build `/` as the opening page with the Desa Klepu introduction, investment overview, UMKM directory, and data-status explanation.
- Build `/umkm/$slug` as a dedicated page for every listed UMKM.
- Add a compact shared header and footer with links back to the directory and the relevant village contact action.
- Ensure all pages work cleanly on phones, tablets, and desktops.

## Opening page
- Create the playful, dimensional green-and-amber introduction chosen in the prototype, with one strong local-product image and concise village context.
- Show the documented headline figures: 7 active UMKM and the supporting farmer, livestock, and tourism groups.
- Present seven UMKM cards: Kopi Family, Kopi Kreweng, Kopi Fatima, Secangkir/Secangker, Keripik Tempe, Tas Anyaman Plastik, and Kedai Lungguh.
- Add category filters so visitors can quickly browse coffee, herbal products, food, crafts, and culinary businesses.
- Include a clear explanation of the five evidence labels: factual, derived, needs verification, simulation, and recommendation.
- Present wider village opportunities separately from active businesses so recommended products are never mistaken for products already in production.

## UMKM detail pages
Each business page will include:
- Business identity, category, owner/manager only where publication is supported, and current verification status.
- Current products, market context, operations, equipment, legal-readiness summary, and documented constraints.
- A focused investment section showing the indicative funding range, intended use of funds, readiness level, risks, mitigation, and prerequisites.
- Supporting facts from the document, with every estimate or incomplete field clearly labeled.
- A clear “Nyatakan minat” contact action without exposing private financial data or unapproved personal details.

## Data treatment
- Use the uploaded 2026 document as the primary content source.
- Preserve documented values, including Kopi Liberika at Rp20–28 juta and Keripik Tempe at Rp8–15 juta.
- Use the document’s sector-level ranges for businesses where appropriate, clearly marked as indicative or recommended.
- Fill unavoidable gaps with restrained sample content labeled **Simulasi** or **Perlu verifikasi**, never as verified fact.
- Keep turnover, costs, profit, account details, and private identity data off public pages, following the document’s access guidance.
- Correct obvious prototype inaccuracies, including the location as Ponorogo and dairy products as pasteurized milk/yoghurt.

## Visual direction
- Carry over the selected rounded clay-like forms, friendly Baloo 2 headings, Plus Jakarta Sans body text, deep leaf green, mint, cream, and amber accents.
- Use the current Lapak’s real product photographs where suitable; create cohesive local-product imagery where the source has no usable photo.
- Keep motion subtle: small card lift, calm section reveals, and reduced-motion support.
- Maintain strong contrast, visible focus states, and touch-friendly controls.

## Technical implementation
- Keep content in a typed local data module so cards and detail pages share one reliable source and can later move to a managed database without redesigning the pages.
- Use TanStack Router’s typed dynamic route for UMKM details and route-specific social/search metadata.
- Build reusable site header, footer, status badge, UMKM card, and investment summary components.
- Add a friendly not-found state for unknown UMKM links.
- Verify the final result at desktop and mobile sizes, including filters, every detail link, navigation, and contact actions.
