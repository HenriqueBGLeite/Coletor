import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin: auto;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;
  margin: auto;

  form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;

    background: transparent;
    border-radius: 10px;
    padding: 16px;

    justify-content: space-between;
  }
`;

export const Button = styled.div`
  display: flex;
  width: 100%;
  padding: 0 16px;

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
  }

  button + button {
    margin-left: 5px;
  }
`;

export const Loanding = styled.div`
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
