# APK Build And Sharing Guide

`mobile/eas.json` contains a preview profile with:

```json
{
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

## Commands

```powershell
cd mobile
npm install
npx eas login
npx eas build:configure
npx eas build --platform android --profile preview
```

Share the EAS build URL after the build completes. Testers can install the APK directly and may need to allow installation from unknown apps.

An APK was not generated locally in this pass because EAS credentials and a public HTTPS backend are external requirements.

The preview profile builds an APK. The production profile builds an Android App Bundle.
