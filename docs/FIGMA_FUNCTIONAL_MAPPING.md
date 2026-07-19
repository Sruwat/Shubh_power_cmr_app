# Figma Functional Mapping

| Reference Screen | Control | Expected Action | React Native Route / Function | Backend API | Implemented | Tested |
|---|---|---|---|---|---|---|
| Onboarding | Language chips | Select language | `/onboarding` local state | none | Existing partial | Pending visual QA |
| Onboarding | Phone continue | Request OTP | `requestOtp` | `POST /api/v1/auth/request-otp` | Existing | Pending visual QA |
| Onboarding | Verify | Verify OTP and create session | `verifyOtp` | `POST /api/v1/auth/verify-otp` | Existing | Pending visual QA |
| Home | Search bar | Open search | `router.push("/search")` | `GET /stations/search` | Yes | Automated route build passed |
| Home | Filter chips | Apply/open filters | `/filters`, `/search?filters=` | `GET /stations/nearby` | Yes | Automated route build passed |
| Home | Station details | Open station detail | `/station/[id]` | `GET /stations/{id}` | Yes | Automated route build passed |
| Map | Marker | Select station | `setSelected` | station data | Existing | Pending visual QA |
| Map | List chip | Toggle list | local state | station data | Existing | Pending visual QA |
| Station detail | Save | Save station | mutation | `POST /stations/{id}/save` | Yes | Automated route build passed |
| Station detail | Start charging | Open scan | `/(tabs)/scan` | charging/payment APIs | Yes | Automated route build passed |
| Scan | Camera permission | Request permission | `requestPermission` | none | Existing | Pending visual QA |
| Scan | Connector select | Select charger connector | local scan state | none | Yes | Automated route build passed |
| Scan | Tariff confirm | Confirm auth estimate/payment method | local scan state | payments APIs on start | Yes | Automated route build passed |
| Scan | Manual code | Start backend session | `startCharging` | charging/payment APIs | Yes | Automated route build passed |
| Activity | Add credits | Wallet top-up | mutation | `POST /wallet/top-up` | Yes | Automated route build passed |
| Activity | Report issue | Create ticket | `/support` mutation | `POST /support/tickets` | Yes | Automated route build passed |
| Profile | Menu rows | Open sub-screen or modal | `/saved`, `/payments`, `/history`, `/notifications`, `/support` | varies | Yes | Automated route build passed |
