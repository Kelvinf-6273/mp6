'use client';
import { useState, useEffect } from 'react';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture: string;
  verified: boolean;
}

export default function Home() {
  const [user, setUser] = useState<UserInfo | null>(null);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {

    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        sessionStorage.removeItem('user');
      }
      return;
    }


    const params = new URLSearchParams(window.location.search);
    const userData = params.get('user');
    const error = params.get('error');

    if (error) {
      console.error('Auth error:', error);
      window.history.replaceState({}, document.title, '/');
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userData));
        setUser(parsedUser);
        sessionStorage.setItem('user', JSON.stringify(parsedUser));
        window.history.replaceState({}, document.title, '/');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
      <main>
        <h1>Google OAuth Integration</h1>

        {user ? (
            <div>
              <h2>Welcome, {user.name}!</h2>
              {user.picture && (
                  <img
                      src={user.picture}
                      alt="Profile"
                      width={200}
                      height={200}
                      style={{ borderRadius: '50%' }}
                  />
              )}
              <div>
                <p>Email: {user.email}</p>
                <p>Verified: {user.verified ? 'Yes' : 'No'}</p>
              </div>
              <button onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <div>
              <p>Please sign in to continue</p>
              <button onClick={handleLogin}>Sign in with Google</button>
            </div>
        )}
      </main>
  );
}