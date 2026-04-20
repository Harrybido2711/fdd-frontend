import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import StaffLoginModal from '@/common/components/navigation/StaffLoginModal';
import ForgotPasswordModal from '@/common/components/navigation/ForgotPasswordModal';
import { useUser } from '@/common/contexts/UserContext';
import AdminDashboard from '@/pages/admin-dashboard/AdminDashboard';

const CategoryData = [
  { name: 'Education', value: 20, fill: '#6b21a8' },
  { name: 'Community Support', value: 72, fill: '#1d4ed8' },
  { name: 'Legal', value: 28, fill: '#9a8348' },
  { name: 'Operations', value: 45, fill: '#4a5568' },
  { name: 'Special Projects', value: 60, fill: '#15803d' },
];

const StateData = [
  { name: 'FL', value: 58.72, percent: 15.89, fill: '#4a5568' },
  { name: 'TX', value: 33.2, percent: 9.3, fill: '#f4a0a0' },
  { name: 'AL', value: 10.44, percent: 2.92, fill: '#1e3a5f' },
  { name: 'NC', value: 91.06, percent: 25.5, fill: '#ffa500' },
  { name: 'SC', value: 22, percent: 6.16, fill: '#2f4f4f' },
  { name: 'IL', value: 78.84, percent: 22.08, fill: '#166534' },
  { name: 'MN', value: 64.78, percent: 18.14, fill: '#9370db' },
];

const TOTAL_FUNDS = 852324;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--rsae-bg);
  font-family: var(--font-agenda);
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 1.1rem 2rem;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  justify-self: start;
  min-width: 0;
`;

const LogoImg = styled.img`
  height: 58px;
  width: auto;
  display: block;
  flex-shrink: 0;
`;

const TitleCenter = styled.h1`
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--rsae-gold);
  margin: 0;
  white-space: nowrap;
  text-align: center;
  justify-self: center;
`;

const StaffLoginBtn = styled.button`
  padding: 12px 18px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background-color: var(--rsae-gold);
  color: white;
  font-size: 1.05rem;
  font-weight: 900;
  cursor: pointer;
  font-family: var(--font-agenda);
  transition: transform 0.05s ease, opacity 0.15s ease;

  &:hover {
    opacity: 0.95;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const FlashSuccess = styled.div`
  margin-bottom: 1.25rem;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #edf7ed;
  color: #1b5e20;
  font-size: 0.95rem;
  font-family: var(--font-agenda);
`;

const FlashError = styled.div`
  margin-bottom: 1.25rem;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #ffebee;
  color: #b71c1c;
  font-size: 0.95rem;
  font-family: var(--font-agenda);
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 2rem;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TotalFunds = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 1rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f6f1 100%);
  border-radius: 16px;
  border: 1px solid rgba(154, 131, 72, 0.2);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
`;

const TotalFundsLabel = styled.span`
  font-weight: 600;
  font-size: 1.5rem;
  color: #4a5568;
  font-family: var(--font-agenda);
  margin-bottom: 0.5rem;
`;

const TotalFundsAmount = styled.span`
  font-weight: 700;
  font-size: 2.5rem;
  color: var(--rsae-gold);
  font-family: var(--font-agenda);
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  grid-column: 1 / -1;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  min-height: 460px;
`;

const ChartTitle = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--rsae-black);
  font-family: var(--font-agenda);
`;

const MenuButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-left: 18px;
`;

const MenuButton = styled.button`
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: ${({ $active }) => ($active ? 'var(--rsae-gold)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--rsae-gold)')};
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  font-family: var(--font-agenda);
  transition: transform 0.05s ease, opacity 0.15s ease, background 0.15s ease;

  &:hover {
    opacity: 0.92;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HeaderNav = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
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
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--rsae-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: max-content;
  min-width: 200px;
  max-width: min(280px, calc(100vw - 32px));
  border-radius: 14px;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.12);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.14);
  padding: 12px;
  z-index: 2000;
`;

const ProfileMenuName = styled.div`
  font-weight: 900;
  color: #0f172a;
  font-size: 1rem;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileMenuSub = styled.div`
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileMenuButton = styled.button`
  width: 100%;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: var(--rsae-gold);
  color: white;
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.05s ease, opacity 0.15s ease;

  &:hover {
    opacity: 0.94;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export default function PublicView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, logout } = useUser();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [view, setView] = useState('entries'); // 'dashboard' | 'entries'
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleStaffLoginClick = () => setLoginModalOpen(true);
  const handleShowForgotPassword = () => setForgotModalOpen(true);

  useEffect(() => {
    if (location.state?.scrollToAdmin) {
      setView('entries');
      requestAnimationFrame(() => {
        document
          .getElementById('staff-admin')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const { scrollToAdmin: _s, ...rest } = location.state || {};
      navigate('/', {
        replace: true,
        state: Object.keys(rest).length ? rest : {},
      });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Logged-out users should always see the public dashboard (charts + title).
    if (!isLoading && !user) {
      setView('dashboard');
      setProfileMenuOpen(false);
    }
  }, [isLoading, user]);

  const displayName = useMemo(() => {
    const first = user?.firstname || user?.displayName?.split(' ')?.[0] || '';
    const last =
      user?.lastname ||
      (user?.displayName?.split(' ')?.slice(1).join(' ') || '');
    const full = `${first} ${last}`.trim();
    return full || user?.displayName || user?.email || 'Account';
  }, [user]);

  const firstInitial = useMemo(() => {
    const first =
      user?.firstname ||
      user?.displayName?.split(' ')?.[0] ||
      user?.email?.[0] ||
      '?';
    return String(first).trim().slice(0, 1).toUpperCase() || '?';
  }, [user]);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setProfileMenuOpen(false);
      setView('dashboard');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const totalFormattedWithComma = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(TOTAL_FUNDS);

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <LogoImg
            src="/rsae-logo.png"
            alt="Reparations Stakeholders Authority Evanston"
          />
          {isLoading ? null : user ? (
            <MenuButtons>
              <MenuButton
                type="button"
                $active={view === 'entries'}
                onClick={() => setView('entries')}
              >
                Entries
              </MenuButton>
              <MenuButton
                type="button"
                $active={view === 'dashboard'}
                onClick={() => setView('dashboard')}
              >
                Dashboard
              </MenuButton>
            </MenuButtons>
          ) : null}
        </HeaderLeft>
        {view === 'dashboard' ? (
          <TitleCenter>Public Funds and Donation Dashboard</TitleCenter>
        ) : (
          <div />
        )}
        <HeaderRight>
          {isLoading ? null : user ? (
            <HeaderNav style={{ position: 'relative' }}>
              <UserIconButton
                type="button"
                onClick={() => setProfileMenuOpen((v) => !v)}
                aria-label="Account menu"
              >
                <UserCircle aria-hidden="true">{firstInitial}</UserCircle>
              </UserIconButton>
              {profileMenuOpen ? (
                <ProfileMenu role="menu" aria-label="Account">
                  <ProfileMenuName>{displayName}</ProfileMenuName>
                  {user?.email ? (
                    <ProfileMenuSub>{user.email}</ProfileMenuSub>
                  ) : (
                    <ProfileMenuSub>Signed in</ProfileMenuSub>
                  )}
                  <ProfileMenuButton type="button" onClick={handleLogoutConfirm}>
                    Log out
                  </ProfileMenuButton>
                </ProfileMenu>
              ) : null}
            </HeaderNav>
          ) : (
            <StaffLoginBtn onClick={handleStaffLoginClick}>Staff Log In</StaffLoginBtn>
          )}
        </HeaderRight>
      </Header>

      <Main>
        {location.state?.message && (
          <FlashSuccess role="status">{location.state.message}</FlashSuccess>
        )}
        {location.state?.error && (
          <FlashError role="alert">{location.state.error}</FlashError>
        )}
        {view === 'dashboard' ? (
          <ChartsSection>
            <TotalFunds>
              <TotalFundsLabel>Total Funds</TotalFundsLabel>
              <TotalFundsAmount>{totalFormattedWithComma}</TotalFundsAmount>
            </TotalFunds>

            <ChartsGrid>
              <ChartCard>
                <ChartTitle>Fund Breakdown By Category</ChartTitle>
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={CategoryData}
                    margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="0"
                      stroke="#f0f0f0"
                      vertical={false}
                      horizontal={true}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: '#4a5568',
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: 'var(--font-agenda)',
                      }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                      tickMargin={12}
                    />
                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      tick={{
                        fill: '#4a5568',
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: 'var(--font-agenda)',
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={4}
                      width={36}
                    />
                    <Tooltip
                      contentStyle={{
                        fontFamily: 'var(--font-agenda)',
                        borderRadius: 12,
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }}
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={80}>
                      {CategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke="none"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard>
                <ChartTitle>Fund Breakdown By State</ChartTitle>
                <ResponsiveContainer width="100%" height={420}>
                  <PieChart margin={{ right: 100 }}>
                    <Pie
                      data={StateData}
                      cx="42%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={175}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      stroke="none"
                      labelLine={false}
                      label={({ cx, cy, index }) =>
                        index === 0 ? (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              fill: '#4a5568',
                              fontFamily: 'var(--font-agenda)',
                            }}
                          >
                            {totalFormattedWithComma}
                          </text>
                        ) : null
                      }
                    >
                      {StateData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} (${props.payload.percent}%)`,
                        name,
                      ]}
                      contentStyle={{
                        fontFamily: 'var(--font-agenda)',
                        borderRadius: 12,
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        color: '#4a5568',
                      }}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{
                        fontFamily: 'var(--font-agenda)',
                        color: '#4a5568',
                        fontSize: 15,
                        lineHeight: 1.8,
                      }}
                      iconType="circle"
                      iconSize={12}
                      iconGap={10}
                      itemGap={14}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </ChartsGrid>
          </ChartsSection>
        ) : null}

        {view === 'entries' && user ? <AdminDashboard embedded /> : null}
      </Main>

      <StaffLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onShowForgotPassword={handleShowForgotPassword}
      />
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
      />
    </PageWrapper>
  );
}
