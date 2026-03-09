import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import logoImg from '@/assets/icons/logo.png';
import { useUser } from '@/common/contexts/UserContext';

import LogoutModal from './LogoutModal';

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e0c8;
  min-height: 64px;
`;

const LogoArea = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const LogoImg = styled.img`
  height: 52px;
  width: auto;
  display: block;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  flex: 1;
  padding-left: 36px;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--gold);
  text-transform: uppercase;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s;

  &.active,
  &:hover {
    border-bottom-color: var(--gold);
  }
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const UserIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const UserCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function UserIcon() {
  return (
    <UserCircle>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="white" />
        <path
          d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </UserCircle>
  );
}

export default function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setIsModalOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <StyledNav>
      <LogoArea onClick={() => navigate('/')}>
        <LogoImg
          src={logoImg}
          alt="Reparations Stakeholders Authority Evanston"
        />
      </LogoArea>

      <NavLinks>
        <StyledNavLink to="/app" end>
          Admin Dashboard
        </StyledNavLink>
        <StyledNavLink to="/app/file-upload">File Upload</StyledNavLink>
      </NavLinks>

      <RightArea>
        <UserIconButton
          onClick={() => user && setIsModalOpen(true)}
          aria-label={user ? 'Account menu' : 'Account'}
        >
          <UserIcon />
        </UserIconButton>
      </RightArea>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogout={handleLogoutConfirm}
      />
    </StyledNav>
  );
}
