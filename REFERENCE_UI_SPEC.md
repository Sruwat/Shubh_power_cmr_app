# Shubh Power Approved Reference UI Spec

Reference source: `https://shubh-power-ev-ui.shankranand332.chatgpt.site`

## Visual System
- Primary canvas: bright white surfaces with pale blue backgrounds and deep navy accents.
- Brand styling: Shubh Power wordmark in the top chrome and a compact mark in map/list cards.
- Core colors:
  - Blue action color
  - Teal success/charging color
  - Navy for map sheets and hero panels
  - Light cyan for status chips and highlights
- Shape language:
  - Rounded cards and pills
  - Soft borders
  - Elevated sheets and drawers
- Typography:
  - Heavy, compact titles
  - Small uppercase section labels
  - Strong contrast for actionable labels

## Global Chrome
- Hamburger on the far left when drawer access is available.
- Back button on detail and nested screens.
- Shubh Power wordmark in the header.
- Screen title centered or visually prominent.
- Notification button on the right.

## Navigation Surfaces
- Functional side drawer with charging, activity, and help/account sections.
- Five-tab bottom navigation used for the main app shell.
- Map-first home experience with a floating station sheet.

## Core Flow Surfaces
- Home and map discovery.
- Station details.
- Connector selection.
- Slot booking.
- Payment confirmation and wallet top-up.
- Session start and live charging.
- Charging complete and charging failure states.
- Profile, vehicles, history, support, settings, rescue, rewards, QueuePass, OneBill, trip planning, offline access.

## Reference Behaviors Captured In Code
- Drawer navigation routes map to the implemented app routes.
- The map screen uses a real `react-native-maps` view on native platforms.
- Charging states are represented as distinct route screens.
- Several feature routes remain demo-backed for data, but use the approved shell and card language.
