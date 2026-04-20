import styled from 'styled-components';

import { Button } from '@/common/components/atoms/Button';

export const InputContainer = styled.div``;

export const InputName = styled.h3`
  margin: 0;
  text-align: left;
  font-weight: normal;
  font-size: 1rem;
  margin-bottom: 4px;
`;
export const InputTitle = styled.span`
  margin-right: 2px;
`;
export const RedSpan = styled.span`
  color: red;
`;

export const StyledInput = styled.input`
  font-size: 1rem;
  padding: 14px 16px;
  border: 1px solid rgba(15, 23, 42, 0.16);
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.75);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  }
`;

export const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 8px;
  cursor: pointer;
`;

export const StyledButton = styled(Button.Primary)`
  font-size: 1.1rem;
  width: 200px;
  font-align: center;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;
