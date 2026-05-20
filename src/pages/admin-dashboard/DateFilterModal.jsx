import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

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
  padding: 28px;
  width: min(420px, 92vw);
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18);
`;

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 1.25rem;
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
  box-sizing: border-box;
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
`;

const SecondaryBtn = styled(Btn)`
  background: #e2e8f0;
  color: #0f172a;
`;

const PrimaryBtn = styled(Btn)`
  background: var(--rsae-gold);
  color: #fff;
`;

export default function DateFilterModal({
  isOpen,
  dateFrom,
  dateTo,
  onClose,
  onApply,
}) {
  const [from, setFrom] = useState(dateFrom);
  const [to, setTo] = useState(dateTo);

  useEffect(() => {
    if (!isOpen) return;
    setFrom(dateFrom);
    setTo(dateTo);
  }, [isOpen, dateFrom, dateTo]);

  if (!isOpen) return null;

  const handleClear = () => {
    onApply('', '');
    onClose();
  };

  const handleApply = () => {
    if (from && to && from > to) {
      onApply(to, from);
    } else {
      onApply(from, to);
    }
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Date filter</Title>
        <Field>
          From
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </Field>
        <Field>
          To
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </Field>
        <Actions>
          <SecondaryBtn type="button" onClick={handleClear}>
            Clear
          </SecondaryBtn>
          <SecondaryBtn type="button" onClick={onClose}>
            Cancel
          </SecondaryBtn>
          <PrimaryBtn type="button" onClick={handleApply}>
            Apply
          </PrimaryBtn>
        </Actions>
      </ModalContent>
    </ModalOverlay>
  );
}

DateFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  dateFrom: PropTypes.string.isRequired,
  dateTo: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};
