# Figma Interaction Register

| Reference Screen | Control | Expected Action | RN Route / Function | Backend API | Status |
|---|---|---|---|---|---|
| Onboarding | Continue | Advance setup step | `/onboarding` state machine | `/auth/request-otp`, `/auth/verify-otp` | Needs rebuild |
| Home | Search | Open search results | `/search` | `/stations/search`, `/locations/search` | Needs rebuild |
| Home | Filter icon/chips | Open/update filters | `/search` filter state | `/stations/nearby` | Needs rebuild |
| Home | View details | Open selected station | `/station/[id]` | `/stations/{id}` | Needs rebuild |
| Home/Map | Navigate icon | Open Google Maps | `Linking.openURL` | station maps URL | Needs rebuild |
| Map | Map/List | Toggle map list overlay | local state | `/stations/map-bounds` | Needs rebuild |
| Scan | Allow camera | Request camera permission | Expo camera permission | none | Needs rebuild |
| Scan | Manual code continue | Validate/start charging | `startCharging` | `/charging/validate`, `/charging/sessions` | Needs rebuild |
| Activity | Add credits | Top up wallet | mutation | `/wallet/top-up` | Needs rebuild |
| Activity | Report issue | Create support ticket | mutation | `/support/tickets` | Needs rebuild |
| Profile | Menu rows | Navigate to real sub-screen | route map | varies | Needs rebuild |

