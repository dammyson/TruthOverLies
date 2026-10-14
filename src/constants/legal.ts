// Placeholder legal copy — have these reviewed before release.

export type LegalSection = {heading: string; body: string};

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: '1. Acceptance of Terms',
    body: "By creating an account or using God's Place, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the app.",
  },
  {
    heading: '2. Your Account',
    body: 'You are responsible for keeping your login details secure and for all activity that occurs under your account. Please provide accurate information when registering.',
  },
  {
    heading: '3. Use of the App',
    body: 'You agree to use the app for personal, non-commercial devotional purposes and not to misuse, disrupt, or attempt to gain unauthorised access to the service.',
  },
  {
    heading: '4. Your Content',
    body: 'Journal entries, sermon notes, highlights and other content you create remain yours. You grant us permission to store and process this content solely to provide the service to you.',
  },
  {
    heading: '5. Privacy',
    body: 'We collect only the information needed to run the app, such as your name and email address. We do not sell your personal information to third parties.',
  },
  {
    heading: '6. Scripture Content',
    body: 'Bible translations provided in the app are subject to the copyright and licensing terms of their respective publishers.',
  },
  {
    heading: '7. Termination',
    body: 'You may delete your account at any time. We may suspend or terminate accounts that violate these terms.',
  },
  {
    heading: '8. Changes to These Terms',
    body: 'We may update these terms from time to time. Continued use of the app after changes are made means you accept the updated terms.',
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Information we collect',
    body: 'When you create an account we collect your name, email address and password. Guest sessions are created without an email address.',
  },
  {
    heading: 'Content you create',
    body: 'Journal entries, sermon notes (including any photos you add), saved verses, saved devotions and the feelings you select are stored on our servers so they can sync to your account.',
  },
  {
    heading: 'How we use it',
    body: 'We use your information only to run the app: signing you in, generating devotions for the feelings you choose, and keeping your content available across sessions.',
  },
  {
    heading: 'Sharing',
    body: 'We do not sell your personal information or share it with advertisers. We do not use third-party analytics or advertising tools in the app.',
  },
  {
    heading: 'On your device',
    body: 'Some data, such as your login session and saved content, is cached on your device for speed and offline use. The Home Screen widget stores only the current verse of the day.',
  },
  {
    heading: 'Photos',
    body: 'The app only accesses your photo library when you choose to add an image to a sermon note, and only the photo you pick is used.',
  },
  {
    heading: 'Your choices',
    body: 'You can edit or delete your journal entries and sermon notes at any time, and you can sign out to remove cached data from your device. To delete your account, contact us.',
  },
  {
    heading: 'Changes to this policy',
    body: 'We may update this policy from time to time. We will let you know in the app if anything important changes.',
  },
];
