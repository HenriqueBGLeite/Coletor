import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 8px 8px;

  width: 100%;
  margin-top: auto;

  form {
    width: 100%;
    margin: 0 8px 0 8px;
  }

  textarea {
    display: flex;
    width: 100%;
    margin-top: 8px;
    border-radius: 10px;
    padding: 10px;
    border: 2px solid #878787;

    align-items: center;
    background: transparent;
    color: #333;
    resize: vertical;

    &::placeholder {
      color: #878787;
    }
  }

  .loading {
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;

    align-items: center;
    justify-content: center;
  }
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  margin-top: 8px;

  flex-wrap: wrap;

  input {
    font-size: 24px;

    &::placeholder {
      font-size: 16px;
    }
  }

  input + input {
    margin-left: 2px;
  }

  p {
    width: 100;
    margin: 20px 2px;
    font-size: 20px;
    color: #000000;
  }

  button {
    background: #c22e2c;
    color: #fff;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    width: 100%;
    font-weight: bold;
    margin-top: 8px;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#c84241')};
    }
  }
`;
