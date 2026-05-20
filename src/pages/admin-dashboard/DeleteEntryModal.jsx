import PropTypes from 'prop-types';
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
  margin: 0 0 12px;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
`;

const Message = styled.p`
  margin: 0 0 20px;
  color: #475569;
  font-weight: 600;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

const DeleteBtn = styled(Btn)`
  background: #dc2626;
  color: #fff;
`;

export default function DeleteEntryModal({
  isOpen,
  entryLabel,
  deleting,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Delete entry?</Title>
        <Message>
          This permanently removes{' '}
          <strong>{entryLabel || 'the selected entry'}</strong>. This cannot be
          undone.
        </Message>
        <Actions>
          <CancelBtn type="button" onClick={onClose} disabled={deleting}>
            Cancel
          </CancelBtn>
          <DeleteBtn type="button" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </DeleteBtn>
        </Actions>
      </ModalContent>
    </ModalOverlay>
  );
}

DeleteEntryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  entryLabel: PropTypes.string,
  deleting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
