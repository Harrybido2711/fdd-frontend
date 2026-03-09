import styled from 'styled-components';

const PageWrapper = styled.div`
  flex: 1;
  background: var(--gold-light-bg);
  padding: 32px 40px;
  min-height: 0;
`;

const ToolBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const ToolBarLeft = styled.div``;

const ToolBarRight = styled.div`
  display: flex;
  gap: 12px;
`;

const DateFilterBtn = styled.button`
  background: var(--gold-dark);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 22px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.15s;

  &:hover {
    background: var(--gold);
  }
`;

const ActionBtn = styled.button`
  border: none;
  border-radius: 4px;
  padding: 10px 22px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  letter-spacing: 0.02em;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }
`;

const NewEntryBtn = styled(ActionBtn)`
  background: var(--btn-new-entry);
`;

const EditBtn = styled(ActionBtn)`
  background: var(--btn-edit);
`;

const DeleteBtn = styled(ActionBtn)`
  background: var(--btn-delete);
`;

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 60%;
  min-width: 480px;
  background: #fff;
`;

const Th = styled.th`
  border: 1.5px solid var(--gold-border);
  padding: 14px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gold-dark);
  text-align: center;
  background: #fff;
`;

const Td = styled.td`
  border: 1.5px solid var(--gold-border);
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gold-dark);
  text-align: center;
`;

const MOCK_DATA = [
  { date: '1/13', fund: 'Fund A', amount: 50, city: 'Evanston', state: 'IL' },
  { date: '1/13', fund: 'Fund B', amount: 100, city: 'Evanston', state: 'IL' },
  { date: '1/14', fund: 'Fund C', amount: 20, city: 'Milwaukee', state: 'WI' },
  { date: '1/15', fund: 'Fund A', amount: 40, city: 'Evanston', state: 'IL' },
];

export default function AdminDashboard() {
  return (
    <PageWrapper>
      <ToolBar>
        <ToolBarLeft>
          <DateFilterBtn>Date Filter</DateFilterBtn>
        </ToolBarLeft>
        <ToolBarRight>
          <NewEntryBtn>New Entry</NewEntryBtn>
          <EditBtn>Edit</EditBtn>
          <DeleteBtn>Delete</DeleteBtn>
        </ToolBarRight>
      </ToolBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Fund</Th>
              <Th>Amount</Th>
              <Th>City</Th>
              <Th>State</Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((row, i) => (
              <tr key={i}>
                <Td>{row.date}</Td>
                <Td>{row.fund}</Td>
                <Td>{row.amount}</Td>
                <Td>{row.city}</Td>
                <Td>{row.state}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </PageWrapper>
  );
}
