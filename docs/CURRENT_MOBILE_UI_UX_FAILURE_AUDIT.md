# Current Mobile UI/UX Failure Audit

## Screenshot 1 - OTP
- Visible defect: Large page title and card start too low after an oversized brand block; OTP is a single plain input; public copy says the test OTP and pending production integration.
- UX impact: Feels like an internal test build and weakens trust in authentication.
- Root cause: Onboarding reuses one generic card layout and exposes implementation notes.
- Required correction: Use a safe-area auth shell, separate OTP cells, resend/edit actions, and customer-facing verification copy.
- Priority: P0.
- Verification method: Android screenshot of OTP at 360x640 and 393x873 with no status-bar overlap and no demo copy.

## Screenshot 2 - Login
- Visible defect: Sparse page with excessive blank space, generic input, oversized heading, no country code, terms or trust language.
- UX impact: Login feels unfinished and not presentation-ready.
- Root cause: Minimal developer form rather than a product onboarding flow.
- Required correction: Add compact welcome header, country-code row, privacy copy and clear CTA hierarchy.
- Priority: P0.
- Verification method: Android login screenshot with keyboard hidden and shown.

## Screenshots 3, 4, 7, 11 - Map
- Visible defect: Title overlaps Android status bar; map is too static; explanatory card consumes space; no search, filters, recenter, list toggle or selected-station preview.
- UX impact: Users cannot explore chargers naturally and the screen reads as a placeholder.
- Root cause: Map screen uses a simple title, static markers and a paragraph below the map.
- Required correction: Use full safe-area map layout, floating search/filter controls, recenter button and selected station bottom sheet.
- Priority: P0.
- Verification method: Android map screenshots with marker selected and unselected.

## Screenshots 5, 6 - Home
- Visible defect: "Current location" touches status bar; headline is too large; debug/research language appears; station cards lack tariff, connector, freshness and actions.
- UX impact: Home does not behave as the primary EV charging experience.
- Root cause: Data is rendered directly with raw backend wording.
- Required correction: Add product header, search, filters, recommended charger, rich station cards and clean customer status mapping.
- Priority: P0.
- Verification method: Android home screenshot with loaded, loading and error states.

## Screenshots 8-12 - Location
- Visible defect: Same generic auth shell; large blank lower screen; card-heavy layout; no useful manual-location affordance.
- UX impact: Permission request feels like a form step, not a helpful onboarding moment.
- Root cause: All onboarding states share one generic text/card pattern.
- Required correction: Create compact location intro with benefit bullets, privacy note and manual location CTA.
- Priority: P1.
- Verification method: Android screenshot with permission undecided and denied.

## Screenshot 13 - Activity
- Visible defect: Only a wallet card appears; "ledger-backed demo wallet" is shown publicly; no tabs or history.
- UX impact: Activity appears incomplete and technical.
- Root cause: Activity screen renders raw wallet/session data with no information architecture.
- Required correction: Add Charging, Payments and Support tabs/sections with empty states and customer copy.
- Priority: P0.
- Verification method: Android activity screenshot with empty and populated history.

## Screenshot 14 - Station Detail
- Visible defect: Back button overlaps status bar; raw fields such as verification and maps URL type are exposed; CTA shows internal charger ID.
- UX impact: Detail page looks like an admin/debug view.
- Root cause: Raw station DTO fields are rendered directly.
- Required correction: Add hero/map preview, customer status, connector/tariff cards, amenities, navigate/save/report actions and "Start charging" CTA.
- Priority: P0.
- Verification method: Android station detail screenshot for live and unavailable stations.

## Screenshot 15 - Scan
- Visible defect: Scan is form-first; demo IDs are public; camera frame is not the primary experience.
- UX impact: Charging journey does not feel like a real charger scan flow.
- Root cause: Manual test path was prioritized over camera-first UX.
- Required correction: Build scanner surface, flashlight/help controls, manual-entry panel and hide test IDs unless developer mode is enabled.
- Priority: P0.
- Verification method: Android scan screenshots for permission, camera and manual states.

## Screenshot 16 - Profile
- Visible defect: Profile is a paragraph of planned settings; "API-ready demo flows" is public; no grouped settings or vehicle/payment sections.
- UX impact: Profile appears unfinished.
- Root cause: Placeholder copy substitutes for real menus.
- Required correction: Build avatar header, wallet summary, vehicle section and grouped menu items for settings/support/legal.
- Priority: P0.
- Verification method: Android profile screenshot with menus visible and no developer language.
