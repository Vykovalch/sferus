---
target: главная страница
total_score: 21
max_score: 36
na_heuristics: 9
p0_count: 1
p1_count: 3
target_identity: "file:E:\\sferus\\src\\app\\(main)\\page.tsx"
target_fingerprint: "sha256:28f61d3b99642f281a1841dcb74fa97b57bff962a1f4097b36c874d88d380cb4"
target_path: "E:\\sferus\\src\\app\\(main)\\page.tsx"
timestamp: 2026-09-18T21-49-56Z
slug: src-app-main-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser evidence)

ENV WARNING: dev server on :3000 served stale CSS (crimson --primary #a20033, no --brand-fill); colors judged from source tokens. Owner to restart dev server with .next cleared.

## Design Health Score — 21/36 (58%, Acceptable), #9 n/a
1 Visibility 3 — guest favorite heart silently redirects to /login
2 Real world 2 — "4 объявлений" no pluralization (CategoryCard.tsx:43); "IT и Digital"
3 Control 3 — ok
4 Consistency 2 — 3 section-header patterns (#16); "Найди" (ты) vs title "Найдите" (вы)
5 Error prevention 2 — Разместить/Создать задание lead guest to login wall without warning
6 Recognition 3 — cities hidden in dropdown
7 Flexibility 2 — no city chips / popular queries
8 Minimalism 2 — client/provider split twice (HowItWorks + CTA); decorative 128px icons
9 n/a — no validated input on home
10 Help 2 — doesn't say contact is free / login required

## Specificity: category-interchangeable marketplace template; local character = one word in H1; contact-reveal mechanic unexplained; tasks board absent from home.
Detector static: 0 findings (28 files). URL scan: layout-transition (Header.tsx:205), text-overflow (ServiceCard.tsx:93), overused-font Inter (design call), image-hover-transform (advisory). No overlay (owner declined live-server).

## Priority issues
- [P0] Test listings ("Тест…", typo "принета") + footer phone placeholder +373 000 000 00 with tel: on prod-shared DB — owner content action; harden
- [P1] Small inventory not designed: 2/5 popular category cards (PopularCategories.tsx:51), orphan 5th listing card at 375 and 1024–1279, no pluralization — harden
- [P1] Two invisible focus stops: hidden header compact search (Header.tsx:202-209 opacity-0/max-w-0) still tabbable; weak hero input focus (#32) — fix with inert — audit
- [P1] v1 contact mechanic not explained; no tasks on home — clarify / shape
- [P2] Mobile: 24 targets <44px (burger 32, heart 26, Войти 64x24, magnifier 20); price truncated (ServiceCard.tsx:93); 1024 header search 101px for guest ("Ремо") → revert to xl — adapt

## Personas
Jordan: test data, "1 объявлений", contact cost unclear, silent login redirect. Riley: "Ремо" at 1024, tel:+37300000000, orphan cards, min-h-12 hack in HowItWorks. Casey: 20px magnifier / 32px burger top corners, Разместить only in burger, no Найти in expanded header search, truncated price.

## Minor
hero-bg.png 1.27MB CSS background, no next/image/preload (LCP) — optimize; DESIGN.md tension: brand-colored 20–30px headings in HowItWorks:79/CTA:20 vs "no large brand text"; CTA client link duplicates "Все категории"; footer h4 orphaned; CTA without h2 (#34); burger lacks Войти; 9 font sizes / 5 weights.

## Questions
1 Without "в Приднестровье" what distinguishes this page? 2 Why trust rests on a stock face instead of real local providers? 3 Why would a provider open the home page with zero tasks on it?
