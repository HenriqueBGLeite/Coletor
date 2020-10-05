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
    margin: 0;
    padding: 8px 8px;

    justify-content: space-between;
  }
`;

export const Button = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  button {
    background: #c22e2c;
    color: #fff;
    height: 56px;
    border-radius: 10px;
    border: 0;
    width: 49%;
    margin: 0;
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

export const ContainerConf = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 0 8px 0;

  width: 100%;
  margin-top: auto;

  form {
    width: 100%;
    margin: 0;
  }
`;

export const ContentConf = styled.div`
  display: flex;
  width: 100%;

  flex-wrap: wrap;

  input {
    font-size: 24px;

    &::placeholder {
      font-size: 16px;
    }
  }

  div + div {
    margin-top: 8px;
  }

  p {
    width: 100;
    margin: 20px 2px;
    font-size: 20px;
    color: #000000;
  }
`;
