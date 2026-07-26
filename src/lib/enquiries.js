import { generateClient } from 'aws-amplify/data';

const client = generateClient();

// Fire-and-forget: append a customer form submission to the enquiries Excel in
// S3 (via the logEnquiry mutation). Best-effort — it must never block or break
// the user's WhatsApp/email flow, so all errors are swallowed.
export function logEnquiry(payload) {
  client.mutations
    .logEnquiry(payload, { authMode: 'identityPool' })
    .catch(() => {});
}
