import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 18px;
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 550;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(31, 41, 55, 0.12);
  transition: transform 0.05s ease, opacity 0.15s ease;

  &:hover {
    opacity: 0.95;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(154, 131, 72, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px;

  &::before,
  &::after {
    content: '';
    height: 1px;
    background-color: rgba(15, 23, 42, 0.12);
    flex: 1;
  }

  span {
    padding: 0 2px;
    color: var(--rsae-gold);
    font-size: 0.9rem;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
`;

export default function GoogleButton({
  isLoading,
  onClick,
  text = 'Sign in with Google',
}) {
  return (
    <>
      <Divider>
        <span>OR</span>
      </Divider>
      <StyledButton type='button' onClick={onClick} disabled={isLoading}>
        <svg width='18' height='18' viewBox='0 0 24 24'>
          <path
            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            fill='#4285F4'
          />
          <path
            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            fill='#34A853'
          />
          <path
            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            fill='#FBBC05'
          />
          <path
            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            fill='#EA4335'
          />
        </svg>
        {text}
      </StyledButton>
    </>
  );
}

GoogleButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
};

GoogleButton.defaultProps = {
  isLoading: false,
  text: 'Sign in with Google',
};
