import styled from 'styled-components';
import { shade } from 'polished';

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  button {
    background: #c22e2c;
    color: #fff;
    height: 40px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    width: 100%;
    font-weight: bold;
    margin-top: 16px;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#c84241')};
    }
  }
`;
