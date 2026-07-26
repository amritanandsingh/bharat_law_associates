import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import useIsAdmin from '../hooks/useIsAdmin';
import './AdminLayout.css';

// Staff-only tool: no marketing chrome, no public sign-up. Admin accounts are
// provisioned into the Cognito `Admins` group out of band.
const AdminGate = ({ signOut }) => {
  const { loading, isAdmin } = useIsAdmin();

  if (loading) {
    return <div className="admin-shell" style={{ minHeight: '60svh' }} aria-hidden="true" />;
  }

  if (!isAdmin) {
    return (
      <div className="admin-shell">
        <div className="admin-card">
          <p>This account is not authorised to manage Articles.</p>
          <button type="button" className="btn btn-gold" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-bar">
        <Link to="/admin" className="admin-brand">
          Articles · Admin
        </Link>
        <nav className="admin-nav">
          <Link to="/">View site</Link>
          <button type="button" className="admin-signout" onClick={signOut}>
            Sign out
          </button>
        </nav>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

const AdminLayout = () => (
  <Authenticator hideSignUp>
    {({ signOut }) => <AdminGate signOut={signOut} />}
  </Authenticator>
);

export default AdminLayout;
