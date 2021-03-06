import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    width: 100%;
    padding: 6px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Button = styled.div`
  display: flex;
  padding: 16px;

  button {
    background: #c22e2c;
    color: #fff;
    height: 56px;
    border-radius: 10px;
    border: 0;
    width: 100%;
    font-weight: bold;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#c84241')};
    }

    &:disabled {
      background: #c84250;
    }
  }

  button + button {
    margin-left: 5px;
  }
`;

export const Loading = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  .loading {
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;

    align-items: center;
    justify-content: center;
  }
`;
