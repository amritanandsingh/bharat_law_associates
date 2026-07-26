import { defineStorage } from '@aws-amplify/backend';

// Give the production bucket a recognizable name; sandbox/dev keep the plain
// name. (Amplify still appends its own unique suffix — the DynamoDB table name
// is Amplify-managed and cannot be prefixed, but is deletion-protected instead.)
const isProduction =
  process.env.AWS_BRANCH === 'master' || process.env.AWS_BRANCH === 'main';

/**
 * S3 storage for Articles cover images.
 * - Cover images are world-readable (public feed).
 * - Only Admins can upload / delete.
 */
export const storage = defineStorage({
  name: isProduction ? 'productionLegalInsightsMedia' : 'legalInsightsMedia',
  access: (allow) => ({
    'media/posts/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['Admins']).to(['read', 'write', 'delete']),
    ],
  }),
});
