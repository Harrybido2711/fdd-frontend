import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  createDonation,
  deleteDonation,
  fetchDonations,
  formatDonationDate,
  updateDonation,
  uploadDonationsCsv,
} from '@/common/api/donationsApi';
import {
  exportDonationsCsv,
  filterByDateRange,
} from '@/common/utils/donationsUtils';

import DateFilterModal from './DateFilterModal';
import DeleteEntryModal from './DeleteEntryModal';
import EntryFormModal from './EntryFormModal';

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

  &:hover:not(:disabled) {
    opacity: 0.88;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
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

const ImportBtn = styled(ActionBtn)`
  background: #0f766e;
`;

const ExportBtn = styled(ActionBtn)`
  background: #7c3aed;
`;

const DateFilterBtnActive = styled(DateFilterBtn)`
  box-shadow: 0 0 0 3px rgba(154, 131, 72, 0.35);
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 820px;
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

const DataRow = styled.tr`
  cursor: pointer;
  background: ${({ $selected }) =>
    $selected ? 'rgba(154, 131, 72, 0.14)' : 'transparent'};

  &:hover {
    background: ${({ $selected }) =>
      $selected ? 'rgba(154, 131, 72, 0.18)' : 'rgba(15, 23, 42, 0.03)'};
  }
`;

const UploadHint = styled.div`
  margin-left: 10px;
  color: #475569;
  font-weight: 700;
  font-size: 0.9rem;
`;

const StatusBanner = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  background: ${({ $variant }) =>
    $variant === 'error' ? '#fef2f2' : '#f0fdf4'};
  color: ${({ $variant }) => ($variant === 'error' ? '#b91c1c' : '#166534')};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'error' ? '#fecaca' : '#bbf7d0'};
`;

const EmptyCell = styled.td`
  padding: 24px 18px;
  text-align: center;
  color: #64748b;
  font-weight: 700;
`;

const SORT_KEYS = [
  'donated_at',
  'fund',
  'amount',
  'category',
  'city',
  'state',
];

const COLUMN_LABELS = {
  donated_at: 'Date',
  fund: 'Fund',
  amount: 'Amount',
  category: 'Category',
  city: 'City',
  state: 'State',
};

export default function AdminDashboard({ embedded = false }) {
  const fileInputRef = useRef(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('donated_at');
  const [sortDir, setSortDir] = useState('asc');
  const [formModal, setFormModal] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadEntries = useCallback(async () => {
    setError('');
    try {
      const data = await fetchDonations();
      setEntries(data);
      setSelectedId((prev) =>
        prev != null && data.some((row) => row.id === prev) ? prev : null
      );
    } catch (err) {
      setError(err.message || 'Failed to load entries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const selectedEntry = entries.find((row) => row.id === selectedId) ?? null;

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setSelectedFileName(file.name);
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const result = await uploadDonationsCsv(file);
      setSuccess(
        `Imported ${result.inserted ?? 0} new entries from ${file.name}.`
      );
      await loadEntries();
    } catch (err) {
      setError(err.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const dateFiltered = filterByDateRange(entries, dateFrom, dateTo);

  const filtered = normalizedQuery
    ? dateFiltered.filter((row) => {
        const haystack = [
          formatDonationDate(row.donated_at),
          row.fund,
          row.amount,
          row.category,
          row.city,
          row.state,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : dateFiltered;

  const dateFilterActive = Boolean(dateFrom || dateTo);

  const handleExport = () => {
    if (!filtered.length) {
      setError('No entries to export for the current filters.');
      setSuccess('');
      return;
    }
    exportDonationsCsv(filtered);
    setSuccess(`Exported ${filtered.length} entries.`);
    setError('');
  };

  const parseDateKey = (d) => {
    if (!d) return 0;
    const t = new Date(d).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  const compare = (a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];

    if (sortKey === 'amount') {
      av = Number(av) || 0;
      bv = Number(bv) || 0;
    } else if (sortKey === 'donated_at') {
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

  const handleSaveEntry = async (payload) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (formModal === 'create') {
        await createDonation(payload);
        setSuccess('Entry created.');
      } else if (selectedId != null) {
        await updateDonation(selectedId, payload);
        setSuccess('Entry updated.');
      }
      setFormModal(null);
      await loadEntries();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedId == null) return;
    setDeleting(true);
    setError('');
    setSuccess('');
    try {
      await deleteDonation(selectedId);
      setSuccess('Entry deleted.');
      setDeleteModalOpen(false);
      setSelectedId(null);
      await loadEntries();
    } catch (err) {
      setError(err.message || 'Failed to delete entry.');
    } finally {
      setDeleting(false);
    }
  };

  const entryLabel = selectedEntry
    ? `${formatDonationDate(selectedEntry.donated_at)} — ${selectedEntry.fund || 'Fund'} ($${selectedEntry.amount})`
    : '';

  const body = (
    <>
      {error ? <StatusBanner $variant="error">{error}</StatusBanner> : null}
      {success ? <StatusBanner $variant="success">{success}</StatusBanner> : null}

      <ToolBar>
        <ToolBarLeft>
          {dateFilterActive ? (
            <DateFilterBtnActive
              type="button"
              onClick={() => setDateFilterOpen(true)}
              title="Edit date filter"
            >
              Date Filter
            </DateFilterBtnActive>
          ) : (
            <DateFilterBtn
              type="button"
              onClick={() => setDateFilterOpen(true)}
              title="Filter entries by date"
            >
              Date Filter
            </DateFilterBtn>
          )}
          <ImportBtn
            type="button"
            onClick={openFilePicker}
            disabled={uploading || loading}
            title="Import entries from a CSV file"
          >
            {uploading ? 'Importing…' : 'Import'}
          </ImportBtn>
          <ExportBtn
            type="button"
            onClick={handleExport}
            disabled={loading || filtered.length === 0}
            title="Export filtered entries as CSV"
          >
            Export
          </ExportBtn>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={handleFileChange}
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
          <NewEntryBtn
            type="button"
            onClick={() => setFormModal('create')}
            disabled={loading}
          >
            New Entry
          </NewEntryBtn>
          <EditBtn
            type="button"
            onClick={() => setFormModal('edit')}
            disabled={loading || selectedId == null}
            title={
              selectedId == null ? 'Select a row to edit' : 'Edit selected entry'
            }
          >
            Edit
          </EditBtn>
          <DeleteBtn
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            disabled={loading || selectedId == null}
            title={
              selectedId == null
                ? 'Select a row to delete'
                : 'Delete selected entry'
            }
          >
            Delete
          </DeleteBtn>
        </ToolBarRight>
      </ToolBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {SORT_KEYS.map((key) => (
                <Th key={key}>
                  <ThContent>
                    {COLUMN_LABELS[key]}
                    <SortButton
                      type="button"
                      aria-label={`Toggle sort by ${COLUMN_LABELS[key]}`}
                      $active={sortKey === key}
                      onClick={() => toggleSort(key)}
                      title={
                        sortKey === key
                          ? `Sorted ${sortDir}`
                          : `Sort by ${COLUMN_LABELS[key]}`
                      }
                    >
                      {sortKey === key ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                    </SortButton>
                  </ThContent>
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <EmptyCell colSpan={6}>Loading entries…</EmptyCell>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <EmptyCell colSpan={6}>
                  No entries match your filters. Add one or import a CSV.
                </EmptyCell>
              </tr>
            ) : (
              rows.map((row) => (
                <DataRow
                  key={row.id}
                  $selected={row.id === selectedId}
                  onClick={() => setSelectedId(row.id)}
                >
                  <Td>{formatDonationDate(row.donated_at)}</Td>
                  <Td>{row.fund ?? '—'}</Td>
                  <Td>{row.amount}</Td>
                  <Td>{row.category ?? '—'}</Td>
                  <Td>{row.city ?? '—'}</Td>
                  <Td>{row.state ?? '—'}</Td>
                </DataRow>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>

      <EntryFormModal
        isOpen={formModal != null}
        mode={formModal === 'edit' ? 'edit' : 'create'}
        entry={formModal === 'edit' ? selectedEntry : null}
        saving={saving}
        onClose={() => setFormModal(null)}
        onSubmit={handleSaveEntry}
      />

      <DeleteEntryModal
        isOpen={deleteModalOpen}
        entryLabel={entryLabel}
        deleting={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <DateFilterModal
        isOpen={dateFilterOpen}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onClose={() => setDateFilterOpen(false)}
        onApply={(from, to) => {
          setDateFrom(from);
          setDateTo(to);
        }}
      />
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
