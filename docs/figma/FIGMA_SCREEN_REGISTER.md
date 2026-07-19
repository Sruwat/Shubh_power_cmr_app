# Figma Screen Register

Status: browser capture completed with Chrome DevTools Protocol fallback after the Codex Browser runtime failed to initialize. Evidence screenshots are stored in `docs/evidence/figma-reference/`.

| Screen | Reference Screenshot | Entry Point | Exit Actions | RN Route | Implementation Status |
|---|---|---|---|---|---|
| Entry / Splash | `01-entry.png` | Site load | Continue | `/onboarding` | Rebuild required |
| Language | `02-language.png` | Continue from entry | Continue | `/onboarding` | Rebuild required |
| Login | `03-login.png` | Continue | Continue / OTP | `/onboarding` | Rebuild required |
| Payment / Setup | `04-payment-or-home.png` | Continue | Continue | `/onboarding` | Rebuild required |
| Home | `05-home.png` | Main tab | Search, filters, details, map | `/(tabs)` | Rebuild required |
| Map | `06-map.png` | Bottom tab | Search, list, details | `/(tabs)/map` | Rebuild required |
| Map List | `07-map-list.png` | List chip | Select station | `/(tabs)/map` | Rebuild required |
| Station Detail | `08-station-detail.png` | Details CTA | Back, maps, start | `/station/[id]` | Rebuild required |
| Scan | `09-scan.png` | Bottom tab | Camera, manual code | `/(tabs)/scan` | Rebuild required |
| Activity | `10-activity.png` | Bottom tab | Add credits, support | `/(tabs)/activity` | Rebuild required |
| Profile | `11-profile.png` | Bottom tab | Menus, logout | `/(tabs)/profile` | Rebuild required |

Additional captured reference states:

- `12-tariff-confirm.png`
- `13-active-session.png`
- `14-activity-wallet.png`
- `16-history.png`
- `17-saved.png`
- `18-notifications.png`
- `19-support.png`
- `20-dark-home.png`

Implementation status after rebuild:

- Home/List View: rebuilt.
- Station cards: rebuilt with price, distance, ETA, rating, trust, availability and connector metadata.
- Station detail: rebuilt with hero, tariff breakdown, connector rows and amenities.
- Scan/charging entry: rebuilt into scan, connector selection and tariff/payment steps.
- Wallet/activity: rebuilt with balance, quick add and seeded transactions.
- Profile: rebuilt with profile stats, vehicle summary and working routes.
- Saved, payments, notifications, history, support and filters routes: added.
