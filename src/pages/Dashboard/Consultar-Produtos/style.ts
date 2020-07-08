import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100%;

  padding: 4px 10px;
`;

export const Content = styled.div`
  form {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    p {
      color: #404040;
      font-weight: bold;
      margin: 8px 0 0 6px;
      width: 68%;
      font-size: 16px;
    }

    #detalhe {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      button {
        width: 49%;
      }

      button + button {
        margin-left: 5px;
      }
    }

    button {
      background: #c22e2c;
      color: #fff;
      height: 50px;
      border-radius: 10px;
      border: 0;
      padding: 0 16px;
      width: 100%;
      font-weight: bold;
      margin-top: 6px;
      transition: background-color 0.2s;

      &:hover {
        background: ${shade(0.2, '#c84241')};
      }
    }
  }
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 8px;
  flex-wrap: wrap;

  div + div {
    margin: 6px 0 0 6px;
  }

  div {
    margin-top: 6px;
  }
`;

export const Fieldset = styled.fieldset`
  width: 100%;
  padding: 6px;
  border-radius: 10px;
  margin: 6px 0 6px 0;

  legend {
    padding: 0 6px;
    color: #000000;
  }

  .wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: -6px;

    div + div {
      margin: 6px 0 0 6px;
    }

    div {
      margin-top: 6px;
    }
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
