import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  flex: 1;
  background: var(--gold-light-bg);
  padding: 32px 40px;
  min-height: 0;
`;

const EmbeddedSection = styled.section`
  margin-top: 2rem;
  background: var(--gold-light-bg);
  padding: 32px 24px;
  border-radius: 12px;
  border: 1px solid rgba(154, 131, 72, 0.15);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

const ToolBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const ToolBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const ToolBarRight = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
`;

const ToolBarCenter = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const SearchInput = styled.input`
  width: min(520px, 44vw);
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: white;
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 700;
  outline: none;

  &::placeholder {
    color: rgba(15, 23, 42, 0.45);
    font-weight: 700;
  }

  &:focus {
    border-color: rgba(154, 131, 72, 0.55);
    box-shadow: 0 0 0 4px rgba(154, 131, 72, 0.18);
  }
`;

const DateFilterBtn = styled.button`
  background: var(--rsae-gold);
  color: #fff;
  border: 1px solid rgba(154, 131, 72, 0.28);
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: transform 0.05s ease, opacity 0.15s ease;

  &:hover {
    opacity: 0.94;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ActionBtn = styled.button`
  border: 1px solid rgba(17, 24, 39, 0.12);
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  color: #fff;
  letter-spacing: 0.01em;
  transition: transform 0.05s ease, opacity 0.15s ease;

  &:hover {
    opacity: 0.88;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const NewEntryBtn = styled(ActionBtn)`
  background: #16a34a;
`;

const EditBtn = styled(ActionBtn)`
  background: #2563eb;
`;

const DeleteBtn = styled(ActionBtn)`
  background: #dc2626;
`;

const FileUploadBtn = styled(ActionBtn)`
  background: #0f766e;
`;

const TableWrapper = styled.div`
  width: 100%;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 680px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
`;

const Th = styled.th`
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 14px 18px;
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  text-align: left;
  background: #fafafa;
`;

const ThContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const SortButton = styled.button`
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: ${({ $active }) => ($active ? 'var(--rsae-gold)' : '#94a3b8')};
  font-weight: 900;
  line-height: 1;

  &:hover {
    color: var(--rsae-gold);
  }
`;

const Td = styled.td`
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 12px 18px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  text-align: left;
`;

const MOCK_DATA = [
  { date: '1/13', fund: 'Fund A', amount: 50, city: 'Evanston', state: 'IL' },
  { date: '1/13', fund: 'Fund B', amount: 100, city: 'Evanston', state: 'IL' },
  { date: '1/14', fund: 'Fund C', amount: 20, city: 'Milwaukee', state: 'WI' },
  { date: '1/15', fund: 'Fund D', amount: 40, city: 'Evanston', state: 'IL' },
  { date: '1/16', fund: 'Fund E', amount: 75, city: 'Chicago', state: 'IL' },
  { date: '1/16', fund: 'Fund F', amount: 120, city: 'Evanston', state: 'IL' },
  { date: '1/17', fund: 'Fund G', amount: 35, city: 'Oak Park', state: 'IL' },
  { date: '1/18', fund: 'Fund H', amount: 200, city: 'Madison', state: 'WI' },
  { date: '1/18', fund: 'Fund I', amount: 55, city: 'Minneapolis', state: 'MN' },
  { date: '1/19', fund: 'Fund J', amount: 90, city: 'Houston', state: 'TX' },
  { date: '1/19', fund: 'Fund K', amount: 18, city: 'Birmingham', state: 'AL' },
  { date: '1/20', fund: 'Fund L', amount: 140, city: 'Charlotte', state: 'NC' },
  { date: '1/20', fund: 'Fund M', amount: 62, city: 'Columbia', state: 'SC' },
  { date: '1/21', fund: 'Fund N', amount: 110, city: 'Evanston', state: 'IL' },
  { date: '1/22', fund: 'Fund O', amount: 45, city: 'St. Paul', state: 'MN' },
];

const UploadHint = styled.div`
  margin-left: 10px;
  color: #475569;
  font-weight: 700;
  font-size: 0.9rem;
`;

export default function AdminDashboard({ embedded = false }) {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? MOCK_DATA.filter((row) => {
        const haystack = `${row.date} ${row.fund} ${row.amount} ${row.city} ${row.state}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : MOCK_DATA;

  const parseDateKey = (d) => {
    // Treat as M/D (assume same year). We just need stable ordering for mock data.
    const [m, day] = String(d).split('/').map((x) => Number(x));
    if (!Number.isFinite(m) || !Number.isFinite(day)) return 0;
    return m * 100 + day;
  };

  const compare = (a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];

    if (sortKey === 'amount') {
      av = Number(av) || 0;
      bv = Number(bv) || 0;
    } else if (sortKey === 'date') {
      av = parseDateKey(av);
      bv = parseDateKey(bv);
    } else {
      av = String(av ?? '').toLowerCase();
      bv = String(bv ?? '').toLowerCase();
    }

    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  };

  const rows = [...filtered].sort(compare);

  const toggleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
      return;
    }
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  };

  const body = (
    <>
      <ToolBar>
        <ToolBarLeft>
          <DateFilterBtn>Date Filter</DateFilterBtn>
          <FileUploadBtn
            type="button"
            onClick={openFilePicker}
            title="Upload a file"
          >
            File Upload
          </FileUploadBtn>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedFileName(file?.name || '');
            }}
          />
          {selectedFileName ? (
            <UploadHint title={selectedFileName}>{selectedFileName}</UploadHint>
          ) : null}
        </ToolBarLeft>
        <ToolBarCenter>
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entries…"
            aria-label="Search entries"
          />
        </ToolBarCenter>
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
                <Th>
                  <ThContent>
                    Date
                    <SortButton
                      type="button"
                      aria-label="Toggle sort by date"
                      $active={sortKey === 'date'}
                      onClick={() => toggleSort('date')}
                      title={
                        sortKey === 'date'
                          ? `Sorted ${sortDir}`
                          : 'Sort by date'
                      }
                    >
                      {sortKey === 'date' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                    </SortButton>
                  </ThContent>
                </Th>
                <Th>
                  <ThContent>
                    Fund
                    <SortButton
                      type="button"
                      aria-label="Toggle sort by fund"
                      $active={sortKey === 'fund'}
                      onClick={() => toggleSort('fund')}
                      title={
                        sortKey === 'fund'
                          ? `Sorted ${sortDir}`
                          : 'Sort by fund'
                      }
                    >
                      {sortKey === 'fund' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                    </SortButton>
                  </ThContent>
                </Th>
                <Th>
                  <ThContent>
                    Amount
                    <SortButton
                      type="button"
                      aria-label="Toggle sort by amount"
                      $active={sortKey === 'amount'}
                      onClick={() => toggleSort('amount')}
                      title={
                        sortKey === 'amount'
                          ? `Sorted ${sortDir}`
                          : 'Sort by amount'
                      }
                    >
                      {sortKey === 'amount'
                        ? sortDir === 'asc'
                          ? '▲'
                          : '▼'
                        : '↕'}
                    </SortButton>
                  </ThContent>
                </Th>
                <Th>
                  <ThContent>
                    City
                    <SortButton
                      type="button"
                      aria-label="Toggle sort by city"
                      $active={sortKey === 'city'}
                      onClick={() => toggleSort('city')}
                      title={
                        sortKey === 'city'
                          ? `Sorted ${sortDir}`
                          : 'Sort by city'
                      }
                    >
                      {sortKey === 'city' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                    </SortButton>
                  </ThContent>
                </Th>
                <Th>
                  <ThContent>
                    State
                    <SortButton
                      type="button"
                      aria-label="Toggle sort by state"
                      $active={sortKey === 'state'}
                      onClick={() => toggleSort('state')}
                      title={
                        sortKey === 'state'
                          ? `Sorted ${sortDir}`
                          : 'Sort by state'
                      }
                    >
                      {sortKey === 'state' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                    </SortButton>
                  </ThContent>
                </Th>
            </tr>
          </thead>
          <tbody>
              {rows.map((row, i) => (
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
    </>
  );

  if (embedded) {
    return (
      <EmbeddedSection id="staff-admin" aria-label="Staff fund entries">
        {body}
      </EmbeddedSection>
    );
  }

  return <PageWrapper>{body}</PageWrapper>;
}

AdminDashboard.propTypes = {
  embedded: PropTypes.bool,
};
