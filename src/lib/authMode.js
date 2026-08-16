import { fetchAuthSession } from 'aws-amplify/auth';

// Public content is readable by everyone, but the auth path differs: a signed-in
// user (e.g. an admin browsing the site) reads via the Cognito user pool, while
// an anonymous visitor reads via the identity pool (guest). `allow.guest()` only
// authorizes the unauthenticated role, so a logged-in user must NOT use
// identityPool or the read comes back empty.
//
// Every public read in src/lib/ must go through this.
export async function readAuthMode() {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.accessToken ? 'userPool' : 'identityPool';
  } catch (e) {
    return 'identityPool';
  }
}

export default readAuthMode;
