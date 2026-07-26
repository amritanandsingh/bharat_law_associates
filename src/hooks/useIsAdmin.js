import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

// Reads the signed-in user's Cognito groups from the access token. This is a
// client-side convenience gate only — the real enforcement is the `Admins`
// group authorization on Post writes in the Amplify data schema.
export default function useIsAdmin() {
  const [state, setState] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    let alive = true;
    fetchAuthSession()
      .then((session) => {
        const groups = session?.tokens?.accessToken?.payload?.['cognito:groups'] || [];
        if (alive) setState({ loading: false, isAdmin: Array.isArray(groups) && groups.includes('Admins') });
      })
      .catch(() => alive && setState({ loading: false, isAdmin: false }));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
