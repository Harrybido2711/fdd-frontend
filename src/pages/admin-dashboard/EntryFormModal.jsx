import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { toInputDate } from '@/common/api/donationsApi';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 28px 28px 24px;
  width: min(480px, 92vw);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18);
`;

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
`;

const Field = styled.label`
  display: block;
  margin-bottom: 14px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #475569;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--rsae-gold);
    box-shadow: 0 0 0 3px rgba(154, 131, 72, 0.2);
  }
`;

const ErrorText = styled.p`
  margin: 0 0 12px;
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const Btn = styled.button`
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const CancelBtn = styled(Btn)`
  background: #e2e8f0;
  color: #0f172a;
`;

const SaveBtn = styled(Btn)`
  background: var(--rsae-gold);
  color: #fff;
`;

const EMPTY = {
  donated_at: '',
  fund: '',
  amount: '',
  category: '',
  city: '',
  state: '',
};

function entryToForm(entry) {
  if (!entry) return { ...EMPTY };
  return {
    donated_at: toInputDate(entry.donated_at),
    fund: entry.fund ?? '',
    amount: entry.amount != null ? String(entry.amount) : '',
    category: entry.category ?? '',
    city: entry.city ?? '',
    state: entry.state ?? '',
  };
}

export default function EntryFormModal({
  isOpen,
  mode,
  entry,
  saving,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setForm(entryToForm(mode === 'edit' ? entry : null));
    setError('');
  }, [isOpen, mode, entry]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const amount = parseFloat(form.amount);
    if (!Number.isFinite(amount)) {
      setError('Amount is required and must be a number.');
      return;
    }
    try {
      await onSubmit({
        donated_at: form.donated_at || null,
        fund: form.fund.trim() || null,
        amount,
        category: form.category.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
      });
    } catch (err) {
      setError(err.message || 'Failed to save entry.');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(ev) => ev.stopPropagation()}>
        <Title>{mode === 'create' ? 'New entry' : 'Edit entry'}</Title>
        <form onSubmit={handleSubmit}>
          <Field>
            Date
            <Input
              type="date"
              value={form.donated_at}
              onChange={handleChange('donated_at')}
            />
          </Field>
          <Field>
            Fund
            <Input
              type="text"
              value={form.fund}
              onChange={handleChange('fund')}
              placeholder="Fund name"
            />
          </Field>
          <Field>
            Amount *
            <Input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.amount}
              onChange={handleChange('amount')}
              placeholder="0.00"
            />
          </Field>
          <Field>
            Category
            <Input
              type="text"
              value={form.category}
              onChange={handleChange('category')}
              placeholder="e.g. Individual, Corporate"
            />
          </Field>
          <Field>
            City
            <Input
              type="text"
              value={form.city}
              onChange={handleChange('city')}
            />
          </Field>
          <Field>
            State
            <Input
              type="text"
              value={form.state}
              onChange={handleChange('state')}
              maxLength={2}
              placeholder="IL"
            />
          </Field>
          {error ? <ErrorText>{error}</ErrorText> : null}
          <Actions>
            <CancelBtn type="button" onClick={onClose} disabled={saving}>
              Cancel
            </CancelBtn>
            <SaveBtn type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </SaveBtn>
          </Actions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

EntryFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  entry: PropTypes.object,
  saving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
