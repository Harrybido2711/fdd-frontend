import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import GoogleButton from '@/common/components/atoms/GoogleButton';
import { Form } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import { useUser } from '@/common/contexts/UserContext';
import { RedSpan } from '@/common/components/form/styles';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 35%, #eef4f7 100%);
  font-family: var(--font-agenda);
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    filter: blur(38px);
    opacity: 0.38;
  }

  &::before {
    width: 340px;
    height: 340px;
    background: rgba(255, 238, 204, 0.65);
    top: -80px;
    left: -70px;
  }

  &::after {
    width: 260px;
    height: 260px;
    background: rgba(123, 139, 255, 0.2);
    bottom: -100px;
    right: -80px;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 540px;
  position: relative;
  z-index: 1;
`;

const LoginForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 18px;
  border: none;
  background: transparent;
  padding: 0;
  text-align: left;
`;

const Top = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Overline = styled.p`
  margin: 0 0 12px;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: rgba(71, 85, 105, 0.88);
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.3rem, 4vw, 3rem);
  line-height: 1.02;
  font-weight: 900;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 14px auto 0;
  max-width: 42ch;
  font-size: 1rem;
  line-height: 1.7;
  color: #475569;
  font-weight: 600;
`;

const Card = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 32px;
  padding: 32px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 40px 90px rgba(15, 23, 42, 0.12);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  left: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(15, 23, 42, 0.08);
  color: #111827;
  font-size: 1.2rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(15, 23, 42, 0.16);
  }
`;

const Actions = styled.div`
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #b8902c 0%, #7a6420 100%);
  color: white;
  border-radius: 18px;
  padding: 16px 18px;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 16px 28px rgba(31, 41, 55, 0.16);

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 10px 18px rgba(31, 41, 55, 0.2);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ForgotRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ForgotLink = styled(Link)`
  color: #475569;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;

  &:hover {
    color: #0f172a;
    text-decoration: underline;
  }
`;

const OrRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0 0;
  color: #64748b;
  font-weight: 800;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: var(--font-agenda);

  &::before,
  &::after {
    content: '';
    height: 1px;
    background: rgba(15, 23, 42, 0.12);
    flex: 1;
  }
`;

function mapAuthCodeToMessage(authCode) {
  switch (authCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/invalid-credential':
      return 'Email or password is incorrect. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

function mapGoogleAuthError(error) {
  const code = error?.code;
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'The pop-up was blocked. Allow pop-ups for this site and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    default:
      return error?.message || 'Failed to sign in with Google.';
  }
}

export default function StaffLogin() {
  const navigate = useNavigate();
  const { login, googleAuth } = useUser();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({ email: '', password: '' });

  const doEmailLogin = async () => {
    await login(formState.email, formState.password);
    navigate('/', { replace: true, state: { scrollToAdmin: true } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await doEmailLogin();
    } catch (err) {
      setError(mapAuthCodeToMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await googleAuth();
      navigate('/', { replace: true, state: { scrollToAdmin: true } });
    } catch (err) {
      setError(mapGoogleAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <Shell>
        <Top>
          <Overline>STAFF ACCESS</Overline>
          <Title>Log in as staff</Title>
          <Subtitle>
            Securely access fund entries and upload files for processing.
          </Subtitle>
        </Top>

        <Card>
          <CloseButton
            type='button'
            onClick={() => navigate('/')}
            aria-label='Close login'
          >
            ×
          </CloseButton>
          <LoginForm onSubmit={handleSubmit}>
            {error && <RedSpan>{error}</RedSpan>}
            <Input.Text
              title='Email address'
              name='email'
              placeholder='name@company.com'
              value={formState.email}
              onChange={(e) => {
                setFormState((s) => ({ ...s, email: e.target.value }));
                setError('');
              }}
              required
            />
            <Input.Password
              title='Password'
              name='password'
              placeholder='Enter your password'
              value={formState.password}
              onChange={(e) => {
                setFormState((s) => ({ ...s, password: e.target.value }));
                setError('');
              }}
              required
            />

            <Actions>
              <PrimaryButton
                type='submit'
                disabled={isLoading}
                aria-label='Log in as staff'
              >
                {isLoading ? 'Logging in...' : 'Log in securely'}
              </PrimaryButton>
              <ForgotRow>
                <ForgotLink to='/request-password-reset'>Forgot password?</ForgotLink>
              </ForgotRow>
              <OrRow>or</OrRow>
              <GoogleButton
                onClick={handleGoogleLogin}
                isLoading={isLoading}
                text='Continue with Google'
              />
            </Actions>
          </LoginForm>
        </Card>
      </Shell>
    </Page>
  );
}
