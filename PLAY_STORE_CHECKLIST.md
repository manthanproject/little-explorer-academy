# Play Store Publishing Checklist — Little Explorer Academy

Use this checklist before every Play Store submission.

---

## 1. Android App Bundle (AAB)

- [ ] Run `npm run android:aab:release` to generate a signed AAB
- [ ] AAB location: `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] Verify the AAB is signed: `"C:\Program Files\Java\jdk-21\bin\jarsigner.exe" -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab`
- [ ] Bump `versionCode` in `android/app/build.gradle` before each new upload (Play Store rejects the same version code)
- [ ] Update `versionName` to match your semantic version (e.g. `"1.0.1"`)

---

## 2. Signing Key

- [ ] Keep `android/key.properties` and `android/app/release-keystore.jks` **backed up** (losing the key means you can never update the app)
- [ ] Both files are listed in `.gitignore` — never commit them
- [ ] Keystore details:
  - Alias: `little-explorer-key`
  - Validity: 10 000 days
  - Store path: `android/app/release-keystore.jks`

---

## 3. App Identity

- [ ] Application ID: `com.littleexplorer.academy` — **never change after first publish**
- [ ] `app_name` in `android/app/src/main/res/values/strings.xml`: **Little Explorer Academy**

---

## 4. Launcher Icon

- [ ] Adaptive icon foreground (`drawable-v24/ic_launcher_foreground.xml`) — branded train vector ✅
- [ ] Adaptive icon background colour (`#7C3AED` purple) ✅
- [ ] Legacy PNG icons present in all mipmap densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) ✅
- [ ] Round icon variant configured in `mipmap-anydpi-v26/ic_launcher_round.xml` ✅
- [ ] For best Play Store results upload a **512 × 512 PNG** store icon in the Play Console (no alpha channel)

---

## 5. Splash Screen

- [ ] SplashScreen theme uses `windowSplashScreenBackground` = `#7C3AED` ✅
- [ ] `windowSplashScreenAnimatedIcon` points to branded `@drawable/ic_splash_icon` ✅
- [ ] `postSplashScreenTheme` transitions cleanly to `AppTheme.NoActionBar` ✅

---

## 6. Permissions

Current permissions in `AndroidManifest.xml`:
- [x] `INTERNET` — required for the WebView

Additional permissions to add **only if** you use features that need them:
- [ ] `ACCESS_NETWORK_STATE` — if you want to check connectivity before loading
- [ ] `VIBRATE` — if you add haptic feedback rewards

---

## 7. Target SDK & Minimum SDK

- [ ] `targetSdkVersion` = 36 (current requirement: 34+) ✅
- [ ] `minSdkVersion` = 24 (Android 7.0 — covers ~97 % of active devices) ✅
- [ ] Check Play Console > App content > Target audience — set to "Children" (ages 5–12)

---

## 8. Google Play Console — Store Listing

Complete these in the Play Console before submission:

### App Details
- [ ] App name (≤30 chars): **Little Explorer Academy**
- [ ] Short description (≤80 chars): e.g. *Fun learning adventures for kids — letters, numbers & animals!*
- [ ] Full description (≤4,000 chars): describe game modes, subjects, safety

### Graphics
- [ ] Hi-res icon: 512 × 512 PNG (no alpha)
- [ ] Feature graphic: 1024 × 500 PNG/JPG
- [ ] Phone screenshots: min 2, max 8 (16:9 or 9:16, min 320px on short side)
- [ ] 7-inch tablet screenshots (optional but recommended)
- [ ] 10-inch tablet screenshots (optional but recommended)
- [ ] Promo video link (optional YouTube URL)

---

## 9. Content Rating

- [ ] Complete the "Content rating" questionnaire in Play Console
- [ ] Expected rating: **Everyone** / **ESRB: E** / **PEGI: 3**
- [ ] Declare: No violence, No user-generated content, No ads (if applicable)

---

## 10. Target Audience & App Content

- [ ] Set "Target age group" → **Ages 5 and under** or **Ages 6–8** (choose both if appropriate)
- [ ] Complete "Ads" declaration (if you have no ads, declare "No ads")
- [ ] Complete "Data safety" section:
  - [ ] Does the app collect personal data? (login name = yes)
  - [ ] Is data encrypted in transit? (yes — HTTPS)
  - [ ] Provide a Privacy Policy URL

---

## 11. Privacy Policy (Required for Children's Apps)

- [ ] Create and host a privacy policy at a public URL
- [ ] Enter it in Play Console > App content > Privacy policy
- [ ] Minimum content: what data is collected, how it is used, contact email

---

## 12. Pre-launch Checklist

- [ ] App runs without crash on first launch (cold start)
- [ ] Back button / navigation works correctly
- [ ] WebView loads within 5 seconds on a slow 3G connection
- [ ] The app does NOT request the YouTube iframe embed to autoplay (Play Store policy)
- [ ] Test on API 24 (min) and API 34+ (target) devices / emulators
- [ ] Test in landscape and portrait orientations
- [ ] Test screen sizes: phone (5"), 7" tablet, 10" tablet

---

## 13. Release Track Order

1. **Internal testing** — small group, instant rollout
2. **Closed testing (Alpha)** — invite testers, check stability
3. **Open testing (Beta)** — wider audience
4. **Production** — staged rollout (start 10 %, monitor crash rate, then full)

---

## Quick Commands

```sh
# One-command signed AAB
npm run android:aab:release

# Verify AAB is signed
"C:\Program Files\Java\jdk-21\bin\jarsigner.exe" -verify android/app/build/outputs/bundle/release/app-release.aab

# Open in Android Studio (to run on device / emulator)
npm run android:open
```
