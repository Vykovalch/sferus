---
target: главная страница
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
target_identity: "file:E:\\sferus\\src\\app\\(main)\\page.tsx"
target_fingerprint: "sha256:28f61d3b99642f281a1841dcb74fa97b57bff962a1f4097b36c874d88d380cb4"
target_path: "E:\\sferus\\src\\app\\(main)\\page.tsx"
timestamp: 2026-09-19T07-06-52Z
slug: src-app-main-page-tsx
---
Method: dual-agent (A: design review with PRODUCT.md · B: detector + browser measurements). Fresh CSS verified (#FFC825 / #8A6A00).

## Design Health Score — 22/40 (55%, Acceptable), all 10 applicable
1 Visibility 2 — "4 объявлений/1 объявлений"; guest heart silently → login
2 Real world 2 — "IT и Digital"; "от 15000" no separators; ты/вы mixed
3 Control 3 — mobile expanded search has no submit button
4 Consistency 2 — 3 section-header patterns (#16); 4 catalog links with different labels; 2 CTA button styles
5 Error prevention 2 — Создать задание/Разместить/heart → login without warning
6 Recognition 3 — 2 of 20 categories visible
7 Flexibility 2 — no quick queries/city chips/tasks entry
8 Minimalism 2 — empty grid slots, faded stock photo, watermark icons, filler subtitle
9 Error recovery 2 — empty states dead-end
10 Help 2 — how-it-works omits login, limit, moderation, task vs service

## Specificity: category-interchangeable composition; honest + color discipline are own; promises: find-in-a-minute partial, direct/no-commission buried, order&protection absent; contact reveal never explained.
Detector static 0 (28 files). URL: text-overflow x3 @375 ServiceCard.tsx:93; layout-transition Header.tsx:205 (CLS 0.003); overused-font Inter (taste); image-hover-transform (advisory). No overlay (owner declined).

## Known, outside list: test listings in prod DB, footer phone placeholder (owner, P0 for launch).

## Priority issues
- [P1] Home is one-sided: no tasks, hero only addresses clients — violates PRODUCT principle 2 — shape
- [P1] Contact cost (login, daily limit) and promises 2–3 not shown at decision points (HowItWorks.tsx:33, CtaSection.tsx:45) — clarify
- [P1] Small inventory looks broken: 2/5 popular categories, orphan cards @1024 (4+1) & 375 (2+2+1) (PopularCategories.tsx:51, TopListings.tsx:34), hardcoded "объявлений" CategoryCard.tsx:43, truncated prices — harden
- [P1] Invisible keyboard focus: hidden header search tabbable (Header.tsx:203-209, stops #2-3), CityDropdown.tsx:60 focus-visible:ring-0, hero input outline-none (3.7:1 border) — WCAG 2.4.7 — audit
- [P2] Mobile: expanded header search lacks submit; targets <44 (heart 26, burger 32, Войти 64x24); hero "Создать задание" over photo 3.9:1 (min 3.6) @375; placeholder 3.5:1 — adapt

## Personas
Jordan: task vs service unclear, "IT и Digital", login surprise. Riley: 1024 header search 101px vs city 139px ("Ремо", #15), no digit grouping, orphan cards, empty query submits. Casey: Разместить only in burger top-left, magnifier only after scroll, no submit, heart 26px, truncated prices. Andrey (Bendery plumber in Viber groups): hero not for him, no tasks/demand, 4/5 listings one author, who sees his phone unexplained, Создать услугу → /register unexplained.

## Minor
CTA: 30px #8A6A00 heading vs "no large brand text" rule (DESIGN internal conflict), client button = 4th catalog link, watermark icons scale on hover (false affordance), p-12 wraps button @375. h1 inherits --brand-heading (globals.css:223-230, DESIGN open q5), tracking-wide on Cyrillic h1, CTA no h2 (#34), footer orphan h4. Filler subtitle HowItWorks.tsx:69; footer "профессиональных исполнителей" excludes individuals; ты/вы. 3 nav without aria-label, no skip link; teal category icon 2.42:1 (#17); burger icon muted vs magnifier; hero PNG 1.27MB CSS bg (optimize). Console clean.

## Questions
1 If sides are equal, why is the task board absent from home? 2 What if the hero promise were the mechanic itself (open contact — deal directly)? 3 With 5 test listings, is "popular/new" honest — or "we just opened, post first in your city"?
