// Keep in sync with MARKETING_VERSION / CURRENT_PROJECT_VERSION (iOS)
// and versionName / versionCode (android/app/build.gradle).
export const APP_INFO = {
  name: 'Truth Over Lies',
  version: '1.0',
  build: '16',
  // Store listings used by the "Share" invite on the More screen.
  // TODO: fill in the App Store link once the app has an App Store ID (https://apps.apple.com/app/id<ID>).
  appStoreUrl: '',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.truthoverlies',
} as const;
