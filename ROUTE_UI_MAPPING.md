# Route UI Mapping

Total Expo route screens discovered in `mobile/app`: 46

## Shell And Global Navigation
| Route/File | Implemented UI | Notes |
|---|---|---|
| `app/_layout.tsx` | Implemented | Root shell now hydrates auth, wraps the app in `AppDrawerProvider`, mounts the drawer overlay, and registers the route stack. |
| `app/(tabs)/_layout.tsx` | Implemented | Five-tab navigation shell and label styling are active. |
| `src/components/ShubhShell.tsx` | Implemented | Functional drawer, top chrome, and menu/back/notification controls are shared here. |
| `src/components/Futuristic.tsx` | Implemented | Shared headers/cards/buttons used across the routed screens. |
| `src/design-system/components.tsx` | Implemented | Shared screen/header primitives for the non-futuristic routes. |

## Main Tabs
| Route | Implemented UI | Notes |
|---|---|---|
| `app/(tabs)/index.tsx` | Implemented | Home map discovery tab with top chrome, search, station sheet, and station cards. |
| `app/(tabs)/map.tsx` | Implemented | Map-focused tab with real native map on native platforms. |
| `app/(tabs)/activity.tsx` | Implemented | Wallet/activity tab with balance, trips, bookings, and payments. |
| `app/(tabs)/scan.tsx` | Implemented | QR / charger ID entry flow for starting a session. |
| `app/(tabs)/profile.tsx` | Implemented | Profile/account tab with stats, vehicles, support, and settings shortcuts. |

## Discovery And Search
| Route | Implemented UI | Notes |
|---|---|---|
| `app/search.tsx` | Implemented | Search screen with filters, recent searches, and station results. |
| `app/filters.tsx` | Implemented | Filter controls for station discovery and sort modes. |
| `app/station/[id].tsx` | Implemented | Station detail screen with pricing, connectors, reviews, and booking actions. |
| `app/saved.tsx` | Implemented | Saved stations list. |
| `app/menu.tsx` | Implemented | Drawer-style menu hub for quick navigation. |

## Charging Flow
| Route | Implemented UI | Notes |
|---|---|---|
| `app/select-connector.tsx` | Implemented | Connector selection step. |
| `app/book-slot.tsx` | Implemented | Slot selection and booking step. |
| `app/booking-confirmed.tsx` | Implemented | Booking success state. |
| `app/confirm-pay.tsx` | Implemented | Payment confirmation step. |
| `app/add-money.tsx` | Implemented | Wallet top-up entry step. |
| `app/pay-upi.tsx` | Implemented | UPI payment form. |
| `app/card-payment.tsx` | Implemented | Card payment form. |
| `app/starting-session.tsx` | Implemented | Session start state. |
| `app/charging/[sessionId].tsx` | Implemented | Live charging state. |
| `app/charging-complete.tsx` | Implemented | Charging complete state. |
| `app/charging-failed.tsx` | Implemented | Charging failure state. |
| `app/payment-failed.tsx` | Implemented | Payment failure state. |
| `app/enter-charger.tsx` | Implemented | Charger ID entry / scan fallback. |
| `app/navigation.tsx` | Implemented | Route guidance to station / charger. |
| `app/session-detail.tsx` | Implemented | Historical session detail view. |
| `app/invoice.tsx` | Implemented | Invoice summary screen. |

## Account And Support
| Route | Implemented UI | Notes |
|---|---|---|
| `app/notifications.tsx` | Implemented | Notification inbox screen with shared app header and bottom nav. |
| `app/support.tsx` | Implemented | Support hub with quick actions and ticket list. |
| `app/support-ticket.tsx` | Implemented | Support ticket creation form. |
| `app/ticket/[id].tsx` | Implemented | Ticket detail / chat screen. |
| `app/vehicles.tsx` | Implemented | Vehicle management and add-vehicle flow with camera capture path. |
| `app/profile-edit.tsx` | Implemented | Profile edit form. |
| `app/payments.tsx` | Implemented | Saved payments list and add-payment entry. |
| `app/history.tsx` | Implemented | Charging history list and session drill-in. |
| `app/settings.tsx` | Implemented | Settings screen. |

## New Reference-Aligned Routes
| Route | Implemented UI | Notes |
|---|---|---|
| `app/about.tsx` | Implemented | About screen. |
| `app/offline-access.tsx` | Implemented | Offline access screen. |
| `app/onebill.tsx` | Implemented | Shubh OneBill screen. |
| `app/queuepass.tsx` | Implemented | QueuePass screen. |
| `app/rescue.tsx` | Implemented | Standalone Shubh Rescue screen. |
| `app/rewards.tsx` | Implemented | Rewards screen. |
| `app/trip-plan.tsx` | Implemented | Trip planning screen. |

## Special Routes
| Route | Implemented UI | Notes |
|---|---|---|
| `app/onboarding.tsx` | Implemented | Entry/onboarding flow and sign-in path remain active. |

## Functional Notes
- The drawer now drives navigation into the new routes and the existing charging, account, and help areas.
- The shared header primitives now show menu access, logo branding, back affordance, and notification affordance on the screens that use them.
- Native map rendering is active through `react-native-maps` on native platforms.
- The scan tab was updated to the shared header chrome during the final polish pass so it no longer stands out as a legacy surface.
- Several screens still use mocked or local presentation data where backend coverage is incomplete, but the UI and navigation are implemented.
