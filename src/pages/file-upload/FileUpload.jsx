import styled from 'styled-components';

const PageWrapper = styled.div`
  flex: 1;
  background: var(--gold-light-bg);
  padding: 32px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Placeholder = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gold-dark);
`;

export default function FileUpload() {
  return (
    <PageWrapper>
      <Placeholder>File Upload — coming soon</Placeholder>
    </PageWrapper>
  );
}
