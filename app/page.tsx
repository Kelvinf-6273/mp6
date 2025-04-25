'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture: string;
  verified: boolean;
}


const Main = styled.main`
  max-width: 80%;
  margin: 0 auto;
  padding: 32px 24px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #7c05b3;
  display: flex;
  flex-direction: column;
  align-items: center;
 
`;

const Title = styled.h1`
  font-size: min(max(1.5rem, 4vw), 2rem);
  margin-bottom: 15px;
  color: #7c05b3;
  font-weight: bold;
  font-style: italic;
`;

const Welcome = styled.h2`
  font-size: min(max(1.5rem, 4vw), 2rem);
  margin-bottom: 1.5rem;
  color: #7c05b3;
  font-weight: bold;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin: 10px auto;
  border: 8px solid #7c05b3;
`;

const UserInfo = styled.div`
  background: #7c05b3;
  padding: 10px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;

  p {
    margin: 20px 0;
    font-size: min(max(1rem, 1.25vw), 1.5rem);
    color: black;
    font-weight: bold;
    
  }
`;

const Button = styled.button`
  background-color: #7c05b3;
  color: black;
  border: none;
  padding: 18px 12px;
  font-size: min(max(1rem, 1.25vw), 1.5rem);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
  font-weight: bold;

  &:hover {
    background-color: #6f069f;
  }
`;

const SignInPrompt = styled.p`
  font-size: min(max(1rem, 1.25vw), 1.5rem);;
  margin-bottom: 10px;
  color: #7c05b3;
`;

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
      <Main>
        <Title>Google OAuth Integration</Title>

        {user ? (
            <div>
              <Welcome>Welcome, {user.name}!</Welcome>
              {user.picture && (
                  <ProfileImage
                      src={user.picture}
                      alt="Profile"
                      width={200}
                      height={200}
                  />
              )}
              <UserInfo>
                <p>Email: {user.email}</p>
                <p>Verified: {user.verified ? 'Yes' : 'No'}</p>
              </UserInfo>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
        ) : (
            <div>
              <SignInPrompt>Please sign in to continue</SignInPrompt>
              <Button onClick={handleLogin}>Sign in with Google</Button>
            </div>
        )}
      </Main>
  );
}