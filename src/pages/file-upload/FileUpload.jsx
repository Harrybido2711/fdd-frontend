import { useRef, useState } from 'react';
import styled from 'styled-components';

import {
  fetchDonations,
  uploadDonationsCsv,
} from '@/common/api/donationsApi';
import { exportDonationsCsv } from '@/common/utils/donationsUtils';

const PageWrapper = styled.div`
  flex: 1;
  background: var(--gold-light-bg);
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div`
  width: min(560px, 100%);
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(154, 131, 72, 0.15);
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
`;

const Hint = styled.p`
  margin: 0 0 24px;
  color: #64748b;
  font-weight: 600;
  line-height: 1.5;
`;

const BtnRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Btn = styled.button`
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 800;
  cursor: pointer;
  color: #fff;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImportBtn = styled(Btn)`
  background: #0f766e;
`;

const ExportBtn = styled(Btn)`
  background: #7c3aed;
`;

const Status = styled.p`
  margin-top: 16px;
  font-weight: 700;
  color: ${({ $error }) => ($error ? '#b91c1c' : '#166534')};
`;

export default function FileUpload() {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleImport = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setMessage('');
    setIsError(false);
    try {
      const result = await uploadDonationsCsv(file);
      setMessage(
        `Imported ${result.inserted ?? 0} new entries from ${file.name}.`
      );
    } catch (err) {
      setIsError(true);
      setMessage(err.message || 'Import failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setMessage('');
    setIsError(false);
    try {
      const rows = await fetchDonations();
      if (!rows.length) {
        setIsError(true);
        setMessage('No entries to export.');
        return;
      }
      exportDonationsCsv(rows);
      setMessage(`Exported ${rows.length} entries.`);
    } catch (err) {
      setIsError(true);
      setMessage(err.message || 'Export failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <Title>Import &amp; export</Title>
        <Hint>
          CSV columns: donated_at, fund, amount, category, city, state. Import
          adds new rows without removing existing entries.
        </Hint>
        <BtnRow>
          <ImportBtn type="button" onClick={handleImport} disabled={uploading}>
            {uploading ? 'Importing…' : 'Import'}
          </ImportBtn>
          <ExportBtn type="button" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Export'}
          </ExportBtn>
        </BtnRow>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {message ? <Status $error={isError}>{message}</Status> : null}
      </Card>
    </PageWrapper>
  );
}
