# Mobile Screen State Matrix

| Screen | Loading | Empty | Error/offline | Permission/disabled | Success |
|---|---|---|---|---|---|
| Login | Button spinner | Not applicable | Inline alert copy | Invalid phone disables flow through validation | OTP step opens |
| OTP | Button spinner | Empty cells | Friendly incorrect-code alert | Resend timer copy | Location step opens |
| Location | Not applicable | Manual city fallback | Permission denied copy | Manual location CTA | Tabs open |
| Home | Station skeleton cards | No chargers nearby card | Retry card with safe customer copy | Location unavailable label | Recommended and nearby lists |
| Map | Map loading region | Empty pin state | Retry/search-this-area action | Recenter disabled without permission | Selected-station sheet |
| Search/filters | Chip loading | No results card | Retry card | Apply disabled with no change | Results count shown |
| Station detail | Detail skeleton | Station not found | Retry/back actions | Start disabled for live unavailable | Navigate/save/start actions |
| Scan | Camera loading | Manual entry fallback | Invalid QR alert | Camera permission card | Connector/payment starts |
| Charging | Session polling | Session not found | Retry/stop support | Stop button loading | Receipt/activity navigation |
| Activity | Session/wallet skeletons | Empty history cards | Retry copy | Add credits disabled in test build | Session/payment/support rows |
| Profile | Profile skeleton | Default initials | Retry copy | Logout loading | Menus and vehicles visible |
