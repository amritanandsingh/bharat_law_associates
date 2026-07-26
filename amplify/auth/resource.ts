import { defineAuth } from '@aws-amplify/backend';

/**
 * Cognito for the Articles feed.
 *
 * - Firm admins sign in with email + password. There is NO public sign-up
 *   (`hideSignUp` on the frontend Authenticator) — admin accounts are created
 *   manually in the Cognito console / CLI and added to the `Admins` group.
 * - Guest (unauthenticated) access to the public feed is provisioned
 *   automatically because the `Post` data model uses `allow.guest()`.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['Admins'],
});
