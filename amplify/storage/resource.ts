import { defineStorage } from '@aws-amplify/backend';

// Give the production bucket a recognizable name; sandbox/dev keep the plain
// name. (Amplify still appends its own unique suffix — the DynamoDB table name
// is Amplify-managed and cannot be prefixed, but is deletion-protected instead.)
const isProduction =
  process.env.AWS_BRANCH === 'master' || process.env.AWS_BRANCH === 'main';

/**
 * S3 storage for public site media.
 * - `media/posts/*`     — Articles cover images.
 * - `media/documents/*` — the SAMPLE PAGE of a document offered for sale.
 * - `media/courts/*`    — Court photographs.
 *
 * These prefixes are world-readable by design: covers and court photographs
 * belong to public listings, and only a teaser page of a document is ever
 * uploaded (the full document is sent privately to buyers and never touches
 * this bucket). Only Admins can upload or delete.
 *
 * The `enquiries/*` prefix is deliberately absent — it holds customer PII and
 * is reachable only by the log-enquiry Lambda's IAM role, never by a browser.
 */
export const storage = defineStorage({
  name: isProduction ? 'productionLegalInsightsMedia' : 'legalInsightsMedia',
  access: (allow) => ({
    'media/posts/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['Admins']).to(['read', 'write', 'delete']),
    ],
    'media/documents/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['Admins']).to(['read', 'write', 'delete']),
    ],
    'media/courts/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['Admins']).to(['read', 'write', 'delete']),
    ],
  }),
});
